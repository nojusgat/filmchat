<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use VfacTmdb\Factory;
use VfacTmdb\Search;
use VfacTmdb\Item;
use VfacTmdb\Media;
use VfacTmdb\Catalog;
use Validator;

use App\Models\User;
use App\Models\FavoriteMovie;

class MoviesController extends Controller
{
    // https://github.com/vfalies/tmdb
    // https://vfac.fr/public/docs/tmdb/source-class-VfacTmdb.Item.html#56-62
    private $tmdb;
    private $media;
    public function __construct() {
        $this->middleware('auth:api');

        $this->tmdb = Factory::create()->getTmdb('189e83538ad961d6e5b7f95f273234c3');
        $this->media = new Media($this->tmdb);
    }

    public function getMovieGenres()
    {
        $cat = new Catalog($this->tmdb);
        $genres = $cat->getMovieGenres();

        $results = array();
        foreach($genres as $genre) {
            $results[] = array("id" => $genre->id, "name" => $genre->name);
        }

        return $results;
    }

    public function getMovie(Request $request)
    {
        switch($request->by) {
            case "id":
                return $this->getInfoById($request->param);
                break;
            case "title":
                $options = array();
                if(isset($request->param))
                    $options['query'] = $request->param;
                if(isset($request->page))
                    $options['page'] = $request->page;

                $search = $this->tmdb->getRequest("search/movie", $options);
                $results = array();
                foreach($search->results as $response) {
                    $checkFavorite = DB::table('movie_favorites')->where(['user_id' => auth()->user()->id, 'movie_id' => $response->id])->first();
                    $results[] = array(
                        "id"        => !isset($response->id) ? null : $response->id,
                        "title"     => !isset($response->title) ? null : $response->title,
                        "poster"    => isset($response->poster_path) ? $this->media->getPosterUrl($response->poster_path, 'w500') : "/images/not_found.png",
                        "overview"  => !isset($response->overview) ? null : $response->overview,
                        "release"   => !isset($response->release_date) ? null : explode("-", $response->release_date)[0],
                        "added_to_favorites" => !is_null($checkFavorite)
                    );
                }
                return array("results" => $results, "this_page" => $search->page, "total_pages" => $search->total_pages);
                break;
            case "category":
                $options = array();
                if(isset($request->param))
                    $options['with_genres'] = $request->param;
                if(isset($request->page))
                    $options['page'] = $request->page;

                $search = $this->tmdb->getRequest("discover/movie", $options);
                $results = array();
                foreach($search->results as $response) {
                    $checkFavorite = DB::table('movie_favorites')->where(['user_id' => auth()->user()->id, 'movie_id' => $response->id])->first();
                    $results[] = array(
                        "id"        => !isset($response->id) ? null : $response->id,
                        "title"     => !isset($response->title) ? null : $response->title,
                        "poster"    => isset($response->poster_path) ? $this->media->getPosterUrl($response->poster_path, 'w500') : "/images/not_found.png",
                        "overview"  => !isset($response->overview) ? null : $response->overview,
                        "release"   => !isset($response->release_date) ? null : explode("-", $response->release_date)[0],
                        "added_to_favorites" => !is_null($checkFavorite)
                    );
                }

                return array("results" => $results, "this_page" => $search->page, "total_pages" => $search->total_pages);
                break;
            default:
                return null;
        }
    }

    private function getInfoById($id)
    {
        $options    = array("append_to_response" => "videos,credits,similar");
        $info       = $this->tmdb->getRequest("movie/".$id, $options);

        $poster     = isset($info->poster_path) ? $this->media->getPosterUrl($info->poster_path, 'original') : "/images/not_found.png";
        $backdrop   = isset($info->backdrop_path) ? $this->media->getBackdropUrl($info->backdrop_path, 'original') : "/images/not_found.png";
        $collection = isset($info->belongs_to_collection) ? array("id" => $info->belongs_to_collection->id, "name" => $info->belongs_to_collection->name, "poster" => (isset($info->belongs_to_collection->poster_path) ? $this->media->getPosterUrl($info->belongs_to_collection->poster_path, 'w500') : "/images/not_found.png")) : null;

        $budget     = !isset($info->budget) ? null : $info->budget;
        $genres     = !isset($info->genres) ? null : $info->genres;
        $homepage   = !isset($info->homepage) ? null : $info->homepage;
        $imdb_id    = !isset($info->imdb_id) ? null : $info->imdb_id;
        $org_lang   = !isset($info->original_language) ? null : $info->original_language;
        $org_title  = !isset($info->original_title) ? null : $info->original_title;
        $desc       = !isset($info->overview) ? null : $info->overview;
        $popularity = !isset($info->popularity) ? null : $info->popularity;
        $prod_comp  = !isset($info->production_companies) ? null : $info->production_companies;
        $prod_cntr  = !isset($info->production_countries) ? null : $info->production_countries;
        $rel_date   = !isset($info->release_date) ? null : $info->release_date;
        $revenue    = !isset($info->revenue) ? null : $info->revenue;
        $runtime    = !isset($info->runtime) ? null : $info->runtime;
        $status     = !isset($info->status) ? null : $info->status;
        $tagline    = !isset($info->tagline) ? null : $info->tagline;
        $title      = !isset($info->title) ? null : $info->title;

        $vote_avg   = !isset($info->vote_average) ? null : $info->vote_average;
        $vote_cnt   = !isset($info->vote_count) ? null : $info->vote_count;
        $s_lang     = !isset($info->spoken_languages) ? null : $info->spoken_languages;

        $yt_trailer = isset($info->videos->results[0]->key) ? $info->videos->results[0]->key : null;

        $cast       = !isset($info->credits->cast) ? null : $info->credits->cast;
        $crew       = !isset($info->credits->crew) ? null : $info->credits->crew;

        $similar    = !isset($info->similar->results) ? null : $info->similar->results;

        $checkFavorite = DB::table('movie_favorites')->where(['user_id' => auth()->user()->id, 'movie_id' => $id])->first();
        return json_encode(
            array(
                "id" => $id,
                "backdrop" => $backdrop,
                "poster" => $poster,
                "collection" => $collection,
                "budget" => $budget,
                "genres" => $genres,
                "homepage" => $homepage,
                "imdb_id" => $imdb_id,
                "original_language" => $org_lang,
                "original_title" => $org_title,
                "overview" => $desc,
                "popularity" => $popularity,
                "production_companies" => $prod_comp,
                "production_countries" => $prod_cntr,
                "release" => $rel_date,
                "revenue" => $revenue,
                "runtime" => $runtime,
                "status" => $status,
                "tagline" => $tagline,
                "title" => $title,
                "vote_average" => $vote_avg,
                "vote_count" => $vote_cnt,
                "spoken_languages" => $s_lang,
                "youtube_trailer" => $yt_trailer,
                "cast" => $cast,
                "crew" => $crew,
                "similar" => $similar,
                "added_to_favorites" => !is_null($checkFavorite)
            )
        );
    }

    public function movieFavoriteAction(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'action' => 'required|string',
            'id' => 'required|int'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user_id = auth()->user()->id;
        switch($request->action) {
            case "add":
                $check = DB::table('movie_favorites')->where(['user_id' => $user_id, 'movie_id' => $request->id])->first();
                if(is_null($check)) {
                    DB::table('movie_favorites')->insert([
                        'user_id' => $user_id,
                        'movie_id' => $request->id
                    ]);
                    auth()->user()->favorites;
                    return response()->json([
                        'success'=> true,
                        'message'=> 'Movie was added to your favorite list.',
                        'updated_info' => auth()->user()
                    ]);
                } else {
                    return response()->json([
                        'success'=> false,
                        'message'=> 'This movie is already in your favorite list.'
                    ]);
                }
                break;
            case "remove":
                $check = DB::table('movie_favorites')->where(['user_id' => $user_id, 'movie_id' => $request->id])->first();
                if(!is_null($check)) {
                    DB::table('movie_favorites')->where(['user_id' => $user_id, 'movie_id' => $request->id])->delete();
                    auth()->user()->favorites;
                    return response()->json([
                        'success'=> true,
                        'message'=> 'Movie was removed from your favorite list.',
                        'updated_info' => auth()->user()
                    ]);
                } else {
                    return response()->json([
                        'success'=> false,
                        'message'=> 'This movie is not in your favorite list and could not be removed.'
                    ]);
                }
                break;
            default:
                return response()->json([
                    'success'=> false,
                    'message'=> 'Invalid data'
                ], 400);
        }
    }
}
