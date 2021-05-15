<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;

class LoginTest extends TestCase
{
    // use RefreshDatabase;
    /**
     * Tests login
     *
     * @return void
     */
    public function login_test()
    {
        $user = User::factory()->create();

        $response = $this->postJson('/api/auth/login', ['email' => $user->email, 'password' => 'password', 'remember' => false]);
        $response->assertStatus(200);

        $user->email = 'bademail';
    }
}
