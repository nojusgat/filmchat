import React, { Component } from 'react';
import {
    Card, CardTitle, CardText, CardImg, CardImgOverlay,
    Button, Row, Col
} from 'reactstrap';

import {IoHeartSharp, IoHeartDislikeSharp} from 'react-icons/io5';

import { store } from 'react-notifications-component';

import BackendService from "../services/BackendService";

class FavoriteButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            movie_id: null,
            favoriteButton: {name: null, text: null}
        };
    }

    componentDidMount() {
        if(this.state.movie_id == null) {
            var favoriteButton = this.state.favoriteButton;
            if (this.props.favorited == true) {
                favoriteButton.name = "removeFavorite";
                favoriteButton.text = "Remove from favorites";
            } else if (this.props.favorited == false) {
                favoriteButton.name = "addFavorite";
                favoriteButton.text = "Add to favorites";
            }
            this.setState({
                movie_id: this.props.movie_id,
                favoriteButton: favoriteButton
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        var favoriteButton = this.state.favoriteButton;
        if (nextProps.favorited == true) {
            favoriteButton.name = "removeFavorite";
            favoriteButton.text = "Remove from favorites";
        } else if (nextProps.favorited == false) {
            favoriteButton.name = "addFavorite";
            favoriteButton.text = "Add to favorites";
        }
        this.setState({
            movie_id: nextProps.movie_id,
            favoriteButton: favoriteButton
        });
    }

    favoriteHandler (name = null) {
        if(name == "addFavorite") {
            BackendService.markUserFavorite("add", this.state.movie_id).then(
                (response) => {
                    if(response.data.success == true) {
                        var currentStorage = JSON.parse(localStorage.getItem('user'));
                        currentStorage.user = response.data.updated_info;
                        localStorage.setItem("user", JSON.stringify(currentStorage));
                        this.setState({
                            favoriteButton: {name: "removeFavorite", text: "Remove from favorites"}
                        });
                        alert(response.data.message);
                    } else {
                        alert(response.data.message);
                    }
                },
                (error) => {
                    console.log("Error getting movie info: " + error.toString());
                }
            );
        } else if (name == "removeFavorite") {
            BackendService.markUserFavorite("remove", this.state.movie_id).then(
                (response) => {
                    if(response.data.success == true) {
                        var currentStorage = JSON.parse(localStorage.getItem('user'));
                        currentStorage.user = response.data.updated_info;
                        localStorage.setItem("user", JSON.stringify(currentStorage));
                        this.setState({
                            favoriteButton: {name: "addFavorite", text: "Add to favorites"}
                        });
                        alert(response.data.message);
                    } else {
                        alert(response.data.message);
                    }
                },
                (error) => {
                    console.log("Error getting movie info: " + error.toString());
                }
            );
        }
    }

    render() {
        if(this.state.favoriteButton.name != null && this.state.favoriteButton.text != null) {
            return (
                <Button title={this.state.favoriteButton.text} color={this.state.favoriteButton.name == "addFavorite" ? "success" : "danger"} onClick={() => this.favoriteHandler(this.state.favoriteButton.name)}>{this.state.favoriteButton.name == "addFavorite" ? <IoHeartSharp /> : <IoHeartDislikeSharp />}</Button>
            );
        } else {
            return (
                "Failed to load"
            );
        }
    }
}

export default FavoriteButton;
