<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Message;
use App\Events\MessageSent;
use Illuminate\Console\Scheduling\Event;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    private function getUserByID($id)
    {
        return User::where('id', $id)->get()[0];
    }

    public function sendMessage(Request $request)
    {
        $user = Auth::user();
        $recipientId = $request->recipientId;
        $other = $this->getUserByID($recipientId);
        if(!$user->isFriendWith($other)) {
            return;
        }
        $message = $user->messages()->create([
            "recipient_id" => $request->recipientId,
            "body" => $request->message
        ]);
        $recipient = User::where('id', $recipientId)->get()[0];
        broadcast(new MessageSent($recipient, $user, $message))->toOthers();
    }

    public function getMessages(Request $request)
    {
        $senderId = auth()->user()->id;
        $recipientId = $request->recipientId;
        $user = $this->getUserByID($senderId);
        $other = $this->getUserByID($recipientId);
        if(!$user->isFriendWith($other)) {
            return;
        }
        $result = Message::with('sender', 'recipient')->where([
            ['sender_id', '=', $senderId],
            ['recipient_id', '=', $recipientId]
        ])->orWhere([
            ['sender_id', '=', $recipientId],
            ['recipient_id', '=', $senderId]
        ])->orderBy('updated_at')->get();
        return ["messages" => $result, "recipient" => User::where('id', $recipientId)->get()[0]];
    }
}
