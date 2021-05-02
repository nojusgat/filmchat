import React, { Component } from "react";
import AppNavbar from "../child-components/AppNavbar";
import { Link, useParams, withRouter } from "react-router-dom";
import BackendService from "../services/BackendService";
import { Button, Container, Row, Col, Spinner } from "reactstrap";
import "../../../css/app.css";

import FavoriteButton from '../child-components/FavoriteButton';

class MovieDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.match.params.id,
            info: [],
            isLoading: true,
        };

        this.getMovieInfo(this.state.id);
    }

    getMovieInfo(id) {
        BackendService.getInfoById(this.props.match.params.id).then(
            (response) => {
                this.setState({
                    isLoading: false,
                    info: response.data
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
                                        <h1>{this.state.info.title} <FavoriteButton movie_id={this.state.info.id} favorited={this.state.info.added_to_favorites} /></h1>
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
