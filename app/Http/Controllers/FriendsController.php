<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use app\Models\User;

class FriendsController extends Controller {

    public function __construct() {
        $this->middleware('auth:api');
    }

    private function getUserByID($id) {
        return User::where('id', $id)->get()[0];
    }

    public function getUsers() {
        $users = array();
        foreach(User::all() as $user) {
            $users[] = $user;
        }
        return $users;
    }

    public function friendAction(Request $request) {
        switch ($request->by) {
            case "befriend":
                $user = $this->getUserByID($request->ownId);
                $other = $this->getUserByID($request->otherId);
                if($user->hasFriendRequestFrom($other)){
                    $user->acceptFriendRequest($other);
                } else {
                    $user->befriend($other);
                }
                break;

            case "accept":
                break;
            case "deny":
                break;
            case "unfriend":
                break;
            default:
                return null;
        }
    }
}
