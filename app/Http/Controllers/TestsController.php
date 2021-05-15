<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class TestsController extends Controller
{
    public function GenerateUser()
    {
        return User::factory()->create();
    }
}
