import React, { Component } from "react";
import { Link } from "react-router-dom";
import AppNavbar from "../child-components/AppNavbar";
import { Button, Container } from "reactstrap";
import {
    Form,
    CustomInput,
    FormGroup,
    Input,
    Label,
    Row,
    Col,
    Modal,
    ModalHeader,
    ModalFooter,
} from "reactstrap";
import { CardBody, Card } from "reactstrap";

import FriendsService from "../services/FriendsService";
import BackendService from "../services/BackendService";
import MovieCard from "../child-components/MovieCard";

import {
    AiOutlineUserAdd,
    AiOutlineUserDelete,
    AiOutlineCheck,
    AiOutlineClose,
    AiOutlineMessage,
} from "react-icons/ai";

import { store } from "react-notifications-component";

class UserProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: [],
            name: "",
            surname: "",
            email: "",
            gender: "",
            about: "",
            avatar: "",
            modal: false,
        };
    }

    componentDidMount() {
        this.getUserInfo(this.props.match.params.id);
    }

    getUserInfo(id) {
        console.log(id);
        FriendsService.getUser(id).then(
            (response) => {
                const user = response.data.user;
                console.log(response.data);
                this.setState(
                    {
                        user: user,
                        name: user.firstname,
                        surname: user.lastname,
                        email: user.email,
                        gender: user.gender,
                        about: user.about,
                        avatar: user.avatar,
                        isFriend: response.data.isFriend,
                        favoritesIDs: response.data.favorites,
                        favorites: [],
                    },
                    this.getFavMovies
                );
            },
            (error) => {
                console.log("Error in getUser: " + error.toString());
            }
        );
    }

    getFavMovies() {
        this.state.favoritesIDs.map((data) => {
            BackendService.getInfoById(data.movie_id).then(
                (response) => {
                    this.setState({
                        favorites: [...this.state.favorites, response.data],
                    });
                },
                (error) => {
                    console.log(
                        "Error getting movie info: " + error.toString()
                    );
                }
            );
        });
    }

    sendFriendRequest(otherId) {
        FriendsService.befriend(otherId).then(
            (response) => {
                this.friendNotification();
            },
            (error) => {
                console.log("Error in befriend: " + error.toString());
            }
        );
    }

    unfriend(otherId) {
        FriendsService.unfriend(otherId).then(
            (response) => {
                this.setState({ isFriend: false });
                this.unFriendNotification();
            },
            (error) => {
                console.log("Error in unfriend: " + error.toString());
            }
        );
    }

    friendNotification() {
        store.addNotification({
            title: "Success!",
            message: `Sent friend request to ${this.state.name} ${this.state.surname}.`,
            type: "success",
            insert: "bottom",
            container: "bottom-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
                duration: 5000,
                onScreen: true,
            },
        });
    }

    unFriendNotification() {
        store.addNotification({
            message: `${this.state.name} ${this.state.surname} has been removed from your friends list.`,
            type: "danger",
            insert: "bottom",
            container: "bottom-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
                duration: 5000,
                onScreen: true,
            },
        });
    }

    render() {
        const toggle = () => this.setState({ modal: !this.state.modal });
        return (
            <div>
                <AppNavbar />
                <Container fluid>
                    <Row
                        style={{
                            margin: "auto",
                            marginTop: "30px",
                            paddingBottom: "30px",
                            width: "60%",
                            borderBottom: "solid 1px lightgrey",
                        }}
                    >
                        <Col sm md={{ offset: 1 }}>
                            <div className="rect-img-container">
                                <img
                                    className="received-image rect-img"
                                    src={
                                        "/storage/images/avatars/" +
                                        this.state.avatar
                                    }
                                    alt={
                                        this.state.firstname +
                                        " " +
                                        this.state.lastname
                                    }
                                />
                            </div>
                        </Col>
                        <Col sm="12" md={{ size: 3, offset: 0 }}>
                            <Form style={{ width: "100%" }}>
                                <FormGroup>
                                    <Label for="Name">
                                        <strong>Name</strong>
                                    </Label>
                                    <Input value={this.state.name} disabled />
                                    <Label for="Surname">
                                        <strong>Surname</strong>
                                    </Label>
                                    <Input
                                        value={this.state.surname}
                                        disabled
                                    />
                                    <Label for="Email">
                                        <strong>Email</strong>
                                    </Label>
                                    <Input
                                        disabled
                                        value={this.state.email}
                                        disabled
                                    />
                                    <Label for="gender">Gender</Label>
                                    <div>
                                        <CustomInput
                                            disabled
                                            type="radio"
                                            value="Male"
                                            id="Male"
                                            name="gender"
                                            label="Male"
                                            checked={
                                                this.state.gender == "Male"
                                            }
                                        />
                                        <CustomInput
                                            disabled
                                            type="radio"
                                            value="Female"
                                            id="Female"
                                            name="gender"
                                            label="Female"
                                            checked={
                                                this.state.gender == "Female"
                                            }
                                        />
                                        <CustomInput
                                            disabled
                                            type="radio"
                                            value="Other"
                                            id="Other"
                                            name="gender"
                                            label="Other"
                                            checked={
                                                this.state.gender == "Other"
                                            }
                                        />
                                    </div>
                                </FormGroup>
                            </Form>
                        </Col>
                        <Col style={{ flexDirection: "column" }}>
                            <div style={{ marginBottom: "10px" }}>
                                {this.state.isFriend ? (
                                    <Button color="danger" onClick={toggle}>
                                        <AiOutlineUserDelete /> Remove from
                                        friends
                                    </Button>
                                ) : (
                                    <Button
                                        color="success"
                                        onClick={() =>
                                            this.sendFriendRequest(
                                                this.props.match.params.id
                                            )
                                        }
                                    >
                                        <AiOutlineUserAdd /> Add to friends
                                    </Button>
                                )}
                            </div>
                            <div>
                                <Link
                                    to={
                                        "/chat/" +
                                        this.props.match.params.id.toString()
                                    }
                                >
                                    <Button
                                        color="success"
                                        disabled={!this.state.isFriend}
                                    >
                                        <AiOutlineMessage /> Chat
                                    </Button>
                                </Link>
                            </div>
                        </Col>
                    </Row>
                    <Row
                        style={{
                            margin: "auto",
                            marginTop: "30px",
                            width: "90%",
                        }}
                    >
                        <Col sm="12" md={{ size: 8, offset: 2 }}>
                            <Card>
                                <CardBody>
                                    {this.state.about != ""
                                        ? this.state.about
                                        : "Nothing here."}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Col sm="12" md={{ size: 8, offset: 2 }}>
                        <Row style={{ marginTop: "30px" }}>
                            <Col></Col>
                        </Row>
                        {this.state.favorites != null &&
                            this.state.favorites.length > 0 ? (
                            <MovieCard data={this.state.favorites} />
                        ) : (
                            ""
                        )}
                        <Row style={{ marginTop: "30px" }}>
                            <Col></Col>
                        </Row>
                    </Col>
                </Container>
                <Modal isOpen={this.state.modal} toggle={toggle}>
                    <ModalHeader toggle={toggle}>
                        Are you sure you want to remove {this.state.name}{" "}
                        {this.state.surname} from your friends?
                    </ModalHeader>
                    <ModalFooter>
                        <Button
                            color="success"
                            onClick={() => {
                                toggle();
                                this.unfriend(this.props.match.params.id);
                            }}
                        >
                            <AiOutlineCheck /> Remove
                        </Button>
                        <Button color="danger" onClick={toggle}>
                            <AiOutlineClose /> Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default UserProfile;
