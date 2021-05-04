import React, { Component } from "react";
import {
    Card,
    CardTitle,
    CardText,
    CardImg,
    CardImgOverlay,
    Button,
    Row,
    Col,
} from "reactstrap";

import { Link } from "react-router-dom";

import "../../../css/app.css";

import FriendsService from "../services/FriendsService";

import {
    AiOutlineUserDelete,
    AiFillEye,
    AiOutlineCheck,
    AiOutlineClose,
    AiOutlineMessage
} from "react-icons/ai";

import { store } from "react-notifications-component";

import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

class FriendCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            modal: false,
        };
    }

    unfriend(otherId) {
        FriendsService.unfriend(otherId).then(
            (response) => {
                this.unFriendNotification();
            },
            (error) => {
                console.log("Error in unfriend: " + error.toString());
            }
        );
    }

    isFriendsWith(id) {
        FriendsService.isFriendsWith(id).then(
            (response) => {
                if (response.data) {
                    this.setState({ btnStatus: "danger" });
                } else {
                    this.setState({ btnStatus: "success" });
                }
            },
            (error) => {
                console.log("Error in getUsers: " + error.toString());
            }
        );
    }

    unFriendNotification() {
        const data = this.props.data;
        store.addNotification({
            message: `${data.firstname} ${data.lastname} has been removed from your friends list.`,
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
        const data = this.state.data;
        const toggle = () => this.setState({ modal: !this.state.modal });
        return (
            <div>
                <Card>
                    <CardTitle tag="h5">
                        {data.firstname} {data.lastname}
                    </CardTitle>
                    <CardImg
                        width="100%"
                        src={"/storage/images/avatars/" + data.avatar}
                        alt={data.firstname + " " + data.lastname}
                    />
                    <div className="align-self-center mx-auto">
                        <CardText>
                            <Link to={"/user/" + data.id.toString()}>
                                <Button>
                                    <AiFillEye /> View profile
                                </Button>
                            </Link>
                            <Link to={"/chat/" + data.id.toString()}>
                                <Button color="success">
                                    <AiOutlineMessage /> Chat
                                </Button>
                            </Link>
                            <Button color="danger" onClick={toggle}>
                                <AiOutlineUserDelete /> Remove from friends
                            </Button>
                        </CardText>
                    </div>
                </Card>
                <Modal isOpen={this.state.modal} toggle={toggle}>
                    <ModalHeader toggle={toggle}>
                        Are you sure you want to remove {data.firstname}{" "}
                        {data.lastname} from your friends?
                    </ModalHeader>
                    <ModalFooter>
                        <Button
                            color="success"
                            onClick={() => {
                                toggle();
                                this.unfriend(data.id);
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

export default FriendCard;
