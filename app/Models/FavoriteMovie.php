<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FavoriteMovie extends Model
{
    use HasFactory;

    protected $table = 'movie_favorites';

    protected $fillable = [
        'user_id',
        'movie_id'
    ];

    protected $hidden = [
        'user_id',
    ];

    public function users()
    {
        return $this->belongsTo(User::class);
    }
}
