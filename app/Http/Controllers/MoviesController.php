<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use VfacTmdb\Factory;
use VfacTmdb\Search;
use VfacTmdb\Item;
use VfacTmdb\Media;
use VfacTmdb\Catalog;

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
                    $results[] = array("id" => $response->id, "title" => $response->title, "poster" => $response->poster_path != null ? $this->media->getPosterUrl($response->poster_path, 'w500') : "/images/not_found.png", "overview" => $response->overview, "release" => $response->release_date != null ? explode("-", $response->release_date)[0] : null);
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
                    $results[] = array("id" => $response->id, "title" => $response->title, "poster" => $response->poster_path != null ? $this->media->getPosterUrl($response->poster_path, 'w500') : "/images/not_found.png", "overview" => $response->overview, "release" => $response->release_date != null ? explode("-", $response->release_date)[0] : null);
                }

                return array("results" => $results, "this_page" => $search->page, "total_pages" => $search->total_pages);
                break;
            default:
                return null;
        }
    }

    private function getInfoById($id)
    {
        $options = array("append_to_response" => "videos,credits,similar");
        $info = $this->tmdb->getRequest("movie/".$id, $options);

        $backdrop = $info->backdrop_path != null ? $this->media->getBackdropUrl($info->backdrop_path, 'original') : "/images/not_found.png";
        $collection = $info->belongs_to_collection != null ? array("id" => $info->belongs_to_collection->id, "name" => $info->belongs_to_collection->name, "poster" => ($info->belongs_to_collection->poster_path != null ? $this->media->getPosterUrl($info->belongs_to_collection->poster_path, 'w500') : "/images/not_found.png")) : null;
        $budget = $info->budget;
        $genres = $info->genres;
        $homepage = $info->homepage;
        $imdb_id = $info->imdb_id;
        $original_language = $info->original_language;
        $original_title = $info->original_title;
        $description = $info->overview;
        $popularity = $info->popularity;
        $poster = $info->poster_path != null ? $this->media->getPosterUrl($info->poster_path, 'original') : "/images/not_found.png";
        $production_companies = $info->production_companies;
        $production_countries = $info->production_countries;
        $release_date = $info->release_date;
        $revenue = $info->revenue;
        $runtime = $info->runtime;
        $status = $info->status;
        $tagline = $info->tagline;
        $title = $info->title;

        $vote_average = $info->vote_average;
        $vote_count = $info->vote_count;
        $spoken_languages = $info->spoken_languages;

        $youtube_trailer = isset($info->videos->results[0]->key) ? $info->videos->results[0]->key : null;

        $cast = $info->credits->cast;
        $crew = $info->credits->crew;

        $similar = $info->similar->results;

        return json_encode(
            array(
                "backdrop" => $backdrop,
                "poster" => $poster,
                "collection" => $collection,
                "budget" => $budget,
                "genres" => $genres,
                "homepage" => $homepage,
                "imdb_id" => $imdb_id,
                "original_language" => $original_language,
                "original_title" => $original_title,
                "description" => $description,
                "popularity" => $popularity,
                "production_companies" => $production_companies,
                "production_countries" => $production_countries,
                "release_date" => $release_date,
                "revenue" => $revenue,
                "runtime" => $runtime,
                "status" => $status,
                "tagline" => $tagline,
                "title" => $title,
                "vote_average" => $vote_average,
                "vote_count" => $vote_count,
                "spoken_languages" => $spoken_languages,
                "youtube_trailer" => $youtube_trailer,
                "cast" => $cast,
                "crew" => $crew,
                "similar" => $similar
            )
        );
    }
}
