<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MoviesController;
use App\Http\Controllers\FriendsController;

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
    Route::get('/users', [FriendsController::class, 'getUsers']);
    Route::get('/users/requests', [FriendsController::class, 'getFriendRequests']);
    Route::get('/users/sentrequests', [FriendsController::class, 'getSentRequests']);
    Route::get('/users/requestscount', [FriendsController::class, 'getFriendRequestsCount']);

});
