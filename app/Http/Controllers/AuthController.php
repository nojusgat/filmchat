<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use App\Models\User;
use Validator;
use Carbon\Carbon;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct() {
        $this->middleware('auth:api', ['except' => ['login', 'loginGoogle', 'register', 'verify', 'lostPasswordRequest', 'resetPassword']]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request){
    	$validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        if($request->remember == true) {
            auth()->factory()->setTTL(7*24*60);
        }

        if (!$token = auth()->attempt($validator->validated())) {
            return response()->json(['error' => 'Wrong email or password. Please try again.'], 401);
        }

        if (auth()->user()->is_verified == 0) {
            return response()->json(['error' => 'Please verify your email address before logging in.'], 401);
        }

        return $this->createNewToken($token);
    }

    public function loginGoogle(Request $request){
    	$validator = Validator::make($request->all(), [
            'token' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $googleInfo = @file_get_contents("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=".$request->token);
        $googleInfo = json_decode($googleInfo);
        if(!$googleInfo || !isset($googleInfo->aud)) {
            return response()->json(['error' => "Invalid token"], 401);
        }

        if($googleInfo->aud != "309423572945-fteqc77rsn47h579ng6e2dcahi0vusis.apps.googleusercontent.com") {
            return response()->json(['error' => 'Token error'], 401);
        }

        $email = $googleInfo->email;
        $name = $googleInfo->given_name;
        $surname = $googleInfo->family_name;

        $user = User::where('email', $email)->first();
        if(is_null($user)) {
            return response()->json(['error' => 'Need to implement a register method, email not found in database'], 401);
        }

        $token = auth()->login($user);

        if (!$token = auth()->login($user)) {
            return response()->json(['error' => 'Can not login. Please try again.'], 401);
        }

        return $this->createNewToken($token);
    }

    /**
     * Register a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'firstname' => 'required|string|between:5,100',
            'lastname' => 'required|string|between:5,100',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|confirmed|min:8',
            'gender' => 'required|in:Male,Female,Other',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $user = User::create(array_merge(
                    $validator->validated(),
                    ['password' => bcrypt($request->password)]
                ));


        $name = $request->firstname." ".$request->lastname;
        $email = $request->email;

        $verification_code = Str::random(30);
        DB::table('user_verifications')->insert(['user_id' => $user->id, 'token' => $verification_code]);
        
        $subject = "Please verify your email address.";
        Mail::send('email.verify', ['username' => $name, 'verification_code' => $verification_code],
            function($mail) use ($email, $name, $subject){
                $mail->from(env('MAIL_FROM_ADDRESS', 'hello@example.com'), env('MAIL_FROM_NAME', 'Example'));
                $mail->to($email, $name);
                $mail->subject($subject);
            });

        return response()->json([
            'message' => 'User successfully registered. Please check your email to complete your registration.',
            'user' => $user
        ], 201);
    }

    /**
     * User email verification.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function verify(Request $request) {
        $validator = Validator::make($request->all(), [
            'verification_code' => 'required|string',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $verification_code = $request->verification_code;
        $check = DB::table('user_verifications')->where('token', $verification_code)->first();

        if(!is_null($check)){
            $user = User::find($check->user_id);

            if($user->is_verified == 1){
                return response()->json([
                    'success'=> false,
                    'error'=> 'This account is already verified'
                ]);
            }

            $user->is_verified = 1;
            $user->save();

            DB::table('user_verifications')->where('token', $verification_code)->delete();

            return response()->json([
                'success'=> true,
                'message'=> 'You have successfully verified your email address.'
            ]);
        }

        return response()->json(['success'=> false, 'error'=> "Verification code is invalid."]);
    }

    /**
     * Lost password request method.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function lostPasswordRequest(Request $request) {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $email = $request->email;
        $check = User::where('email', $email)->first();
        if(!is_null($check) && $check->is_verified == 1){
            $isOtherToken = DB::table('password_resets')->where('email', $email)->first();

            if($isOtherToken) {
                $recover_token = $isOtherToken->token;
            } else {
                $recover_token = Str::random(80);
                DB::table('password_resets')->insert(['email' => $email, 'token' => $recover_token, 'created_at' => Carbon::now()]);
            }
            
            $subject = "Password reset request";
            Mail::send('email.lostpasssword', ['username' => $check->firstname." ".$check->lastname, 'recover_token' => $recover_token, 'email' => $email],
                function($mail) use ($email, $check, $subject){
                    $mail->from(env('MAIL_FROM_ADDRESS', 'hello@example.com'), env('MAIL_FROM_NAME', 'Example'));
                    $mail->to($email, $check->firstname." ".$check->lastname);
                    $mail->subject($subject);
                });
            return response()->json([
                'success'=> true,
                'message'=> 'Password reset email sent. Please check your inbox'
            ]);
        } else if(!is_null($check) && $check->is_verified != 1) {
            return response()->json(['success'=> false, 'error'=> "Can't reset password, email is not verified."]);
        }
        return response()->json(['success'=> false, 'error'=> "No account with matching email."]);
    }

    /**
     * Reset password method.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function resetPassword(Request $request) {
        if($request->check_token) {
            $check = DB::table('password_resets')->where(['token' => $request->check_token])->first();
            if(!is_null($check)) {
                return response()->json(['valid'=> true]);
            }
            return response()->json(['valid'=> false]);
        }
        $validator = Validator::make($request->all(), [
            'request_token' => 'required|string',
            'password' => 'required|string|confirmed|min:8',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $check = DB::table('password_resets')->where(['token' => $request->request_token])->first();
        if(!is_null($check)) {
            $userData = User::whereEmail($check->email)->first();

            $userData->update([
              'password' => bcrypt($request->password)
            ]);


            DB::table('password_resets')->where(['token' => $request->request_token])->delete();

            return response()->json([
                'success'=> true,
                'message'=> 'Password has been changed.'
            ]);
        }
        return response()->json(['success'=> false, 'error'=> "Invalid password reset token."]);
    }

    public function changeDetails(Request $request) {
        $user_id = auth()->user()->id;

        if(!is_null($user_id)) {
            $validator = Validator::make($request->all(), [
                'firstname' => 'string',
                'lastname' => 'string',
                'gender' => Rule::in(['Male', 'Female', 'Other']),
                'password_current' => 'password',
                'password_new' => 'string|confirmed|min:8'
            ]);

            if($validator->fails()){
                return response()->json($validator->errors()->toJson(), 400);
            }

            $user = User::find($user_id);
            $message = array();

            if(isset($request->firstname) && $request->firstname != $user->firstname) {
                $user->update([
                    'firstname' => $request->firstname
                ]);
                $message['firstname'] = array("success" => true, "message" => "Your first name has been successfully changed.");
            }

            if(isset($request->lastname) && $request->lastname != $user->lastname) {
                $user->update([
                    'lastname' => $request->lastname
                ]);
                $message['lastname'] = array("success" => true, "message" => "Your last name has been successfully changed.");
            }

            if(isset($request->gender) && $request->gender != $user->gender) {
                $user->update([
                    'gender' => $request->gender
                ]);
                $message['gender'] = array("success" => true, "message" => "Your gender has been successfully changed.");
            }

            if(isset($request->password_new)) {
                if(!isset($request->password_current)) {
                    $message['password'] = array("success" => false, "error" => "You need to type your current password in order to change it.");
                } else {
                    $user->update([
                        'password' => bcrypt($request->password_new)
                    ]);
                    $message['password'] = array("success" => true, "message" => "Your password has been successfully changed.");
                }
            }
            $user->save();

            if(empty($message))
                $message['error'] = array("success" => false, "error" => "No changes have been made.");

            $message['updated_info'] = $user;
            return response()->json($message);
        }

        return response()->json(['success'=> false, 'error'=> "In order to do this you need to be logged in."]);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout() {
        auth()->logout();

        return response()->json(['message' => 'User successfully signed out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh() {
        return $this->createNewToken(auth()->refresh());
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function userProfile() {
        return response()->json(auth()->user());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function createNewToken($token){
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => auth()->user()
        ]);
    }

}