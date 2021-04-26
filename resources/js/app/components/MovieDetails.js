import React, { Component } from "react";
import AppNavbar from "./AppNavbar";
import { Link, useParams, withRouter } from "react-router-dom";
import BackendService from "../services/BackendService";
import { Button, Container, Row, Col, Spinner } from "reactstrap";
import "../../../css/app.css";

class MovieDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.match.params.id,
            info: [],
            isLoading: true,
            favoriteButton: {name: null, text: null}
        };

        this.getMovieInfo(this.state.id);
    }

    favoriteHandler = (event) => {
        let nam = event.target.name;
        if(nam == "addFavorite") {
            console.log("add");
            BackendService.markUserFavorite("add", this.state.id).then(
                (response) => {
                    console.log(response.data);
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
        } else if (nam == "removeFavorite") {
            console.log("remove");
            BackendService.markUserFavorite("remove", this.state.id).then(
                (response) => {
                    console.log(response.data);
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

    getMovieInfo(id) {
        console.log("getting movie info of id: " + id);
        BackendService.getInfoById(this.props.match.params.id).then(
            (response) => {
                console.log(response.data);
                var favoriteButton = this.state.favoriteButton;
                if (response.data.added_to_favorites == true) {
                    favoriteButton.name = "removeFavorite";
                    favoriteButton.text = "Remove from favorites";
                } else if (response.data.added_to_favorites == false) {
                    favoriteButton.name = "addFavorite";
                    favoriteButton.text = "Add to favorites";
                }
                this.setState({
                    isLoading: false,
                    info: response.data,
                    favoriteButton: favoriteButton
                });
            },
            (error) => {
                console.log("Error getting movie info: " + error.toString());
            }
        );
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div>
                    <AppNavbar />
                    <div className="spinner">
                        <Spinner
                            color="secondary"
                            style={{ width: "100px", height: "100px" }}
                        />
                    </div>
                </div>
            );
        } else {
            return (
                <div
                    className="movie-main"
                    style={{
                        backgroundImage: `url(${this.state.info.backdrop})`,
                    }}
                >
                    <AppNavbar />
                    <div className="movie-container">
                        <Container
                            fluid
                            style={{ paddingLeft: "0px", paddingRight: "0px" }}
                        >
                            <Row>
                                <Col md="5">
                                    <img
                                        className="movie-poster"
                                        src={this.state.info.poster}
                                    />
                                </Col>
                                <Col md="7">
                                    <div className="movie-info">
                                        <h1>{this.state.info.title}</h1>
                                        <h4 style={{ color: "lightgray" }}>
                                            {this.state.info.tagline}
                                        </h4>
                                        <hr />
                                        <h3>Overview</h3>
                                        <p>{this.state.info.overview}</p>
                                        <hr />
                                        <div>
                                            <Container fluid>
                                                <Row xs="2">
                                                    <Col>
                                                        <h5>Release Date:</h5>
                                                        <p>
                                                            {
                                                                this.state.info
                                                                    .release
                                                            }
                                                        </p>
                                                    </Col>
                                                    <Col>
                                                        <h5>Rating:</h5>
                                                        <p>
                                                            {
                                                                this.state.info
                                                                    .vote_average
                                                            }{" "}
                                                            / 10
                                                        </p>
                                                    </Col>
                                                    <Col>
                                                        <h5>Length:</h5>
                                                        <p>
                                                            {
                                                                this.state.info
                                                                    .runtime
                                                            }{" "}
                                                            minutes
                                                        </p>
                                                    </Col>
                                                    <Col>
                                                        <h5>Status:</h5>
                                                        <p>
                                                            {
                                                                this.state.info
                                                                    .status
                                                            }
                                                        </p>
                                                    </Col>
                                                </Row>
                                            </Container>
                                        </div>
                                        <hr />
                                        <h2>Genres</h2>
                                        <p>
                                            {this.state.info.genres
                                                .map((x) => x.name)
                                                .join(", ") + "."}
                                        </p>
                                        {this.state.favoriteButton.name != null && this.state.favoriteButton.text != null
                                        ? <Button color={this.state.favoriteButton.name == "addFavorite" ? "success" : "danger"} name={this.state.favoriteButton.name} onClick={this.favoriteHandler}>{this.state.favoriteButton.text}</Button>
                                        : ""
                                        }
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </div>
            );
        }
    }
}

export default withRouter(MovieDetails);
