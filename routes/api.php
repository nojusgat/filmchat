<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MoviesController;

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
    Route::post('/movie/show', [MoviesController::class, 'getMovie']);
    Route::get('/movie/genres', [MoviesController::class, 'getMovieGenres']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/google/login', [AuthController::class, 'loginGoogle']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/request/lostpassword', [AuthController::class, 'lostPasswordRequest']);
    Route::post('/complete/emailverify', [AuthController::class, 'verify']);
    Route::post('/complete/lostpassword', [AuthController::class, 'resetPassword']);

    Route::post('/change/details', [AuthController::class, 'changeDetails']);

    Route::post('/logout', [AuthController::class, 'logout']);
});
