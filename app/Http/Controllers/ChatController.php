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

    public function sendMessage(Request $request)
    {
        $user = Auth::user();
        $recipientId = $request->recipientId;
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
