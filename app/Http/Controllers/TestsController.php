<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class TestsController extends Controller
{
    public function GenerateUser()
    {
        return User::factory()->create();
    }

    public function GenerateUserSpecific(Request $request)
    {
        return User::factory()->customName($request->name, $request->surname, $request->email)->create();
    }

    public function GetEmailToken(Request $request)
    {
        $db = DB::table('user_verifications')->where('user_id', $request->user_id)->first();
        if(!is_null($db) && !is_null($db->token)){
            return $db->token;
        } else 
            return "error";
    }
}
