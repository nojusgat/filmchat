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
                    $results[] = array("id" => $response->id, "title" => $response->title, "poster" => $response->poster_path != null ? $this->media->getPosterUrl($response->poster_path) : null);
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
                    $results[] = array("id" => $response->id, "title" => $response->title, "poster" => $response->poster_path != null ? $this->media->getPosterUrl($response->poster_path) : null);
                }

                return array("results" => $results, "this_page" => $search->page, "total_pages" => $search->total_pages);
                break;
            default:
                return null;
        }
    }

    private function getInfoById($id)
    {
        // Get movie information
        $item  = new Item($this->tmdb);
        $infos = $item->getMovie($id);

        $similar = $infos->getSimilar();
        $similarMovies = array();
        foreach($similar as $sim) {
            $similarMovies[] = array("id" => $sim->getId(), "title" => $sim->getTitle(), "poster" => $this->media->getPosterUrl($sim->getPosterPath()));
        }

        $crew = $infos->getCrew();
        $movieCrew = array();
        foreach($crew as $cre) {
            $movieCrew[] = array("id" => $cre->getId(), "name" => $cre->getName(), "job" => $cre->getJob());
        }

        $cast = $infos->getCast();
        $movieCast = array();
        foreach($cast as $ca) {
            $movieCast[] = array("id" => $ca->getId(), "name" => $ca->getName(), "character" => $ca->getCharacter(), "image" => !is_null($ca->getProfilePath()) ? $this->media->getProfileUrl($ca->getProfilePath()) : null);
        }

        return json_encode(
            array(
                "genres" => $infos->getGenres(),
                "title" => $infos->getTitle(),
                "overview" => $infos->getOverview(),
                "release" => $infos->getReleaseDate(),
                "original_title" => $infos->getOriginalTitle(),
                "note" => $infos->getNote(),
                "id" => $infos->getId(),
                "imdb" => $infos->getIMDBId(),
                "tagline" => $infos->getTagLine(),
                "collections" => $infos->getCollectionId(),
                "crew" => $movieCrew,
                "cast" => $movieCast,
                //"prod_company" => $infos->getProductionCompanies(),
                //"prod_country" => $infos->getProductionCountries(),
                "backdrop" => $this->media->getBackdropUrl($infos->getBackdropPath()),
                "poster" => $this->media->getPosterUrl($infos->getPosterPath()),
                "similar" => $similarMovies
            )
        );
    }
}
