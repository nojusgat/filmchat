<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use app\Models\User;
use Hootlex\Friendships\Models\Friendship;

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
            if($user->id != auth()->user()->id){
                $users[] = array("id" => $user->id,
                                 "firstname" => $user->firstname,
                                 "lastname" => $user->lastname,
                                 "avatar" => $user->avatar);
            }
        }
        return $users;
    }

    public function friendAction(Request $request) {
        $user = $this->getUserByID(auth()->user()->id);
        $other = $this->getUserByID($request->otherId);
        switch ($request->by) {
            case "befriend":
                if($user->hasFriendRequestFrom($other)){
                    $user->acceptFriendRequest($other);
                } else {
                    $user->befriend($other);
                }
                break;

            case "accept":
                $user->acceptFriendRequest($other);
                break;
            case "deny":
                $user->denyFriendRequest($other);
                break;
            case "cancel":
                $user->unfriend($other);
                break;
            case "unfriend":
                break;
            default:
                return null;
        }
    }

    public function getFriendRequests() {
        $user = $this->getUserByID(auth()->user()->id);
        $sent = array();
        foreach($user->getFriendRequests() as $request) {
            $sent[] = $this->getUserByID($request['sender_id']);
        }
        return $sent;
    }

    private function getSentRequestsQuery($id) {
        return Friendship::select('recipient_id')->where('sender_id', $id)->where('status', 0)->get();
    }

    public function getSentRequests() {
        $ownId = auth()->user()->id;
        $sent = array();
        foreach($this->getSentRequestsQuery($ownId) as $request) {
            $sent[] = $this->getUserByID($request['recipient_id']);
        }
        return $sent;
    }
}
