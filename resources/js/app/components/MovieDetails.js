import React, { Component } from "react";
import AppNavbar from "../child-components/AppNavbar";
import { withRouter } from "react-router-dom";
import BackendService from "../services/BackendService";
import {
    Container,
    Row,
    Col,
    Spinner,
    Card,
    CardBody,
    CardTitle,
    CardText,
    CardImg,
} from "reactstrap";
import "../../../css/app.css";

import FavoriteButton from "../child-components/FavoriteButton";
import YoutubeEmbed from "../child-components/YoutubeEmbed";

class MovieDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.match.params.id,
            info: [],
            isLoading: true,
            castCarouselPages: 0,
            castActiveIndex: 0,
            crewCarouselPages: 0,
            crewActiveIndex: 0,
            carouselCardsPerSlide: 6,
        };

        this.castNext = this.castNext.bind(this);
        this.castPrevious = this.castPrevious.bind(this);
        this.castOnExiting = this.castOnExiting.bind(this);
        this.castOnExited = this.castOnExited.bind(this);
    }

    componentDidMount() {
        this.getMovieInfo();
    }

    getMovieInfo() {
        BackendService.getInfoById(this.state.id).then(
            (response) => {
                this.setState({
                    isLoading: false,
                    info: response.data,
                    castCarouselPages: Math.ceil(
                        response.data.cast.length /
                        this.state.carouselCardsPerSlide
                    ),
                    crewCarouselPages: Math.ceil(
                        response.data.crew.length /
                        this.state.carouselCardsPerSlide
                    ),
                });
                console.log(this.state);
            },
            (error) => {
                console.log("Error getting movie info: " + error.toString());
            }
        );
    }

    castOnExiting() {
        this.castAnimating = true;
    }

    castOnExited() {
        this.castAnimating = false;
    }

    castNext() {
        if (this.castAnimating) return;
        // this.setState({
        //     castActiveIndex: this.state.castActiveIndex + 1,
        // });
        const nextIndex =
            this.state.castActiveIndex === this.state.castCarouselPages - 1
                ? 0
                : this.state.castActiveIndex + 1;
        this.setState({ castActiveIndex: nextIndex });
    }

    castPrevious() {
        if (this.castAnimating) return;
        this.setState({
            castActiveIndex: this.state.castActiveIndex - 1,
        });
    }

    chunk = (arr, size) =>
        Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
            arr.slice(i * size, i * size + size)
        );

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
                <div>
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
                                style={{
                                    paddingLeft: "0px",
                                    paddingRight: "0px",
                                }}
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
                                            <h1>
                                                {this.state.info.title}{" "}

                                            </h1>
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
                                                            <h5>
                                                                Release Date:
                                                            </h5>
                                                            <p>
                                                                {
                                                                    this.state
                                                                        .info
                                                                        .release
                                                                }
                                                            </p>
                                                        </Col>
                                                        <Col>
                                                            <h5>Rating:</h5>
                                                            <p>
                                                                {
                                                                    this.state
                                                                        .info
                                                                        .vote_average
                                                                }{" "}
                                                                / 10
                                                            </p>
                                                        </Col>
                                                        <Col>
                                                            <h5>Length:</h5>
                                                            <p>
                                                                {
                                                                    this.state
                                                                        .info
                                                                        .runtime
                                                                }{" "}
                                                                minutes
                                                            </p>
                                                        </Col>
                                                        <Col>
                                                            <h5>Status:</h5>
                                                            <p>
                                                                {
                                                                    this.state
                                                                        .info
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
                                            <div style={{ marginLeft: "auto", marginRight: "auto", marginTop: "auto", width: "75%" }}>
                                                <FavoriteButton
                                                    movie_id={
                                                        this.state.info.id
                                                    }
                                                    favorited={
                                                        this.state.info
                                                            .added_to_favorites
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </div>
                    <div className="people-container">
                        <div>
                            <h1>Cast</h1>
                        </div>
                        <div className="people-list">
                            {this.state.info.cast.map((item, index) => {
                                return (
                                    <Card className="person-card" key={index}>
                                        <CardImg
                                            variant="top"
                                            style={{
                                                width: "100%",
                                                height: "auto",
                                            }}
                                            src={
                                                item.profile_path
                                                    ? "http://image.tmdb.org/t/p/original" +
                                                    item.profile_path
                                                    : "/storage/images/avatars/no-avatar.png"
                                            }
                                        />
                                        <CardBody>
                                            <CardTitle tag="h5">
                                                {item.name}
                                            </CardTitle>
                                            <CardText>
                                                Plays: {item.character}
                                            </CardText>
                                        </CardBody>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                    <hr />
                    <div className="people-container">
                        <div>
                            <h1>Crew</h1>
                        </div>
                        <div
                            className="people-list"
                            style={{ height: "170px" }}
                        >
                            {this.state.info.crew.map((item, index) => {
                                return (
                                    <Card className="person-card" key={index}>
                                        <CardBody>
                                            <CardTitle tag="h5">
                                                {item.name}
                                            </CardTitle>
                                            <CardText>{item.job}</CardText>
                                        </CardBody>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                    <hr />
                    <div
                        style={{
                            margin: "auto",
                            width: "80%",
                            marginBottom: "30px",
                        }}
                    >
                        <div>
                            <h1>Trailer</h1>
                        </div>
                        <div style={{ margin: "auto", width: "80%" }}>
                            <YoutubeEmbed
                                embedId={this.state.info.youtube_trailer}
                            />
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default withRouter(MovieDetails);
