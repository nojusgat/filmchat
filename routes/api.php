<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\MoviesController;
use App\Http\Controllers\FriendsController;
use App\Http\Controllers\TestsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::group([
    'middleware' => 'api',
    'prefix' => 'test'

],function ($router) {
    Route::get('/generate/user', [TestsController::class, 'GenerateUser']);
    Route::post('/generate/user', [TestsController::class, 'GenerateUserSpecific']);
    Route::post('/generate/emailToken', [TestsController::class, 'GetEmailToken']);
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'

], function ($router) {
    Route::post('/movie/favorite', [MoviesController::class, 'movieFavoriteAction']);

    Route::post('/movie/show', [MoviesController::class, 'getMovie']);
    Route::get('/movie/genres', [MoviesController::class, 'getMovieGenres']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/google/login', [AuthController::class, 'loginGoogle']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/request/lostpassword', [AuthController::class, 'lostPasswordRequest']);
    Route::post('/complete/emailverify', [AuthController::class, 'verify']);
    Route::post('/complete/lostpassword', [AuthController::class, 'resetPassword']);

    Route::post('/change/details', [AuthController::class, 'changeDetails']);
    Route::post('/change/avatar', [AuthController::class, 'uploadUserAvatar']);

    Route::post('/logout', [AuthController::class, 'logout']);

    // Friends system routes
    Route::post('/users/friend', [FriendsController::class, 'friendAction']);
    Route::post('/get/users', [FriendsController::class, 'getUsers']);
    Route::post('/get/user', [FriendsController::class, 'getUser']);
    Route::post('/search/users', [FriendsController::class, 'searchUsers']);
    Route::get('/get/friends', [FriendsController::class, 'getFriends']);
    Route::get('/get/requests', [FriendsController::class, 'getFriendRequests']);
    Route::get('/get/sentrequests', [FriendsController::class, 'getSentRequests']);
    Route::get('/get/requestscount', [FriendsController::class, 'getFriendRequestsCount']);
    Route::get('/get/userscount', [FriendsController::class, 'getUsersCount']);
    Route::get('/get/suggested', [FriendsController::class, 'getSuggested']);

    // Messages routes
    Route::post('/messages/send', [ChatController::class, 'sendMessage']);
    Route::post('/messages/get', [ChatController::class, 'getMessages']);
    Route::post('/messages/getChats', [ChatController::class, 'getLatestChats']);
});
