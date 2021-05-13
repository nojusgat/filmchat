<?php

namespace App\Http\Controllers;

use app\Models\User;
use Illuminate\Http\Request;
use App\Events\FriendRequestSent;
use App\Events\FriendRequestCountChanged;
use App\Events\Unfriended;
use App\Models\FavoriteMovie;
use Hootlex\Friendships\Models\Friendship;

class FriendsController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api');
    }

    private function getUserByID($id)
    {
        return User::where('id', $id)->get()[0];
    }

    public function friendAction(Request $request)
    {
        $user = $request->user();
        $other = $this->getUserByID($request->otherId);
        switch ($request->by) {
            case "befriend":
                if ($user->hasFriendRequestFrom($other)) {
                    $user->acceptFriendRequest($other);
                } elseif (!$user->hasSentFriendRequestTo($other)) {
                    $user->befriend($other);
                    broadcast(new FriendRequestSent($other, $user));
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
                $user->unfriend($other);
                broadcast(new Unfriended($user));
                break;
            case "isFriend":
                return $user->isFriendWith($other);
                break;
            default:
                return null;
        }

        // broadcast event to self and others.
        broadcast(new FriendRequestCountChanged($other));
        broadcast(new FriendRequestCountChanged($user));
    }

    public function getUsers(Request $request)
    {
        $userId = auth()->user()->id;
        $users = array();
        $self = $this->getUserByID($userId);
        $count = User::where("id", "!=", $userId)->orderBy("firstname")->count();
        foreach (User::where("id", "!=", $userId)->orderBy("firstname")->paginate($request->perPage) as $user) {
            $users[] = array(
                "id" => $user->id,
                "firstname" => $user->firstname,
                "lastname" => $user->lastname,
                "avatar" => $user->avatar,
                "isFriend" => $self->isFriendWith($user) || $self->hasSentFriendRequestTo($user)
            );
        }
        return array("users" => $users, "count" => ceil($count / $request->perPage));
    }

    public function getUser(Request $request)
    {
        $userId = auth()->user()->id;
        $self = $this->getUserByID($userId);
        $other = $this->getUserByID($request->id);
        $favs = FavoriteMovie::with('users')->where("user_id", $request->id)->get();
        return array("user" => $other, "isFriend" => $self->isFriendWith($other), "favorites" => $favs);
    }

    public function searchUsers(Request $request)
    {
        $userId = auth()->user()->id;
        $users = array();
        $self = $this->getUserByID($userId);
        $count = User::whereRaw('CONCAT(firstname," ",lastname) LIKE "%' . $request->search . '%"')->where("id", "!=", $userId)->count();
        foreach (User::whereRaw('CONCAT(firstname," ",lastname) LIKE "%' . $request->search . '%"')->where("id", "!=", $userId)->orderBy("firstname")->paginate($request->perPage) as $user) {
            $users[] = array(
                "id" => $user->id,
                "firstname" => $user->firstname,
                "lastname" => $user->lastname,
                "avatar" => $user->avatar,
                "isFriend" => $self->isFriendWith($user) || $self->hasSentFriendRequestTo($user)
            );
        };
        return array("users" => $users, "count" => ceil($count / $request->perPage));
    }

    public function getFriends()
    {
        $user = $this->getUserByID(auth()->user()->id);
        return $user->getFriends();
    }

    public function getFriendRequests()
    {
        $user = $this->getUserByID(auth()->user()->id);
        $sent = array();
        foreach ($user->getFriendRequests() as $request) {
            $sent[] = $this->getUserByID($request['sender_id']);
        }
        return $sent;
    }

    private function getSentRequestsQuery($id)
    {
        return Friendship::select('recipient_id')->where('sender_id', $id)->where('status', 0)->get();
    }

    public function getSentRequests()
    {
        $userId = auth()->user()->id;
        $sent = array();
        foreach ($this->getSentRequestsQuery($userId) as $request) {
            $sent[] = $this->getUserByID($request['recipient_id']);
        }
        return $sent;
    }

    public function getFriendRequestsCount()
    {
        $userId = auth()->user()->id;
        return Friendship::where('recipient_id', $userId)->where('status', 0)->count();
    }

    public function getUsersCount()
    {
        $userId = auth()->user()->id;
        return User::where("id", "!=", $userId)->count();
    }
}
