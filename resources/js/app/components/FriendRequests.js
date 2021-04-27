import React, { Component } from "react";
import AppNavbar from "./AppNavbar";
import "../../../css/app.css";
import {
    Container,
    Row,
    Col,
    Spinner,
    Button,
    InputGroup,
    Input,
    InputGroupAddon,
    Pagination,
    PaginationItem,
    PaginationLink,
} from "reactstrap";
import IncomingRequestsList from "./IncomingRequestsList";
import SentRequestsList from "./SentRequestsList";
import FriendsService from "../services/FriendsService";

class FriendRequests extends Component {
    constructor(props) {
        super(props);

        this.state = {
            incoming: [],
            sent: [],
        };
    }

    componentDidMount() {
        if (this.state.incoming.length == 0) {
            console.log("getting requests");
            this.getIncomingRequests();
        }
        if (this.state.sent.length == 0) {
            console.log("getting sent requests");
            this.getSentRequests();
        }
    }

    getIncomingRequests() {
        FriendsService.getIncomingRequests().then(
            (response) => {
                this.setState({ incoming: response.data });
            },
            (error) => {
                console.log("Error in getIncomingRequests " + error.toString());
            }
        );
    }

    getSentRequests() {
        FriendsService.getSentRequests().then(
            (response) => {
                this.setState({ sent: response.data });
            },
            (error) => {
                console.log("Error in getSentRequests " + error.toString());
            }
        );
    }

    handleRequestAccept = (itemId) => {
        FriendsService.acceptRequest(itemId).then(
            (response) => {
                const items = this.state.incoming.filter(
                    (item) => item.id !== itemId
                );
                this.setState({ incoming: items });
            },
            (error) => {
                console.log("Error in acceptRequest: " + error.toString());
            }
        );
    };

    handleRequestDeny = (itemId) => {
        FriendsService.denyRequest(itemId).then(
            (response) => {
                const items = this.state.incoming.filter(
                    (item) => item.id !== itemId
                );
                this.setState({ incoming: items });
            },
            (error) => {
                console.log("Error in denyRequest: " + error.toString());
            }
        );
    };

    handleCancelRequest = (itemId) => {
        FriendsService.cancelRequest(itemId).then(
            (response) => {
                const items = this.state.sent.filter(
                    (item) => item.id !== itemId
                );
                this.setState({ sent: items });
            },
            (error) => {
                console.log("Error in cancelRequest: " + error.toString());
            }
        );
    }

    render() {
        return (
            <div>
                <AppNavbar />
                <div style={{ margin: "auto", width: "60%" }}>
                    <Container fluid>
                        <Row>
                            <h1 style={{ marginTop: "20px" }}>
                                Incoming friend requests
                            </h1>
                        </Row>
                        <Row>
                            {this.state.incoming.length == 0 ? (
                                "No incoming requests"
                            ) : (
                                <IncomingRequestsList
                                    data={this.state.incoming}
                                    onAcceptReq={this.handleRequestAccept}
                                    onDenyReq={this.handleRequestDeny}
                                />
                            )}
                        </Row>
                        <Row>
                            <h1 style={{ marginTop: "20px" }}>
                                Sent friend requests
                            </h1>
                        </Row>
                        <Row>
                            {this.state.sent.length == 0 ? (
                                "no sent requests"
                            ) : (
                                <SentRequestsList
                                    data={this.state.sent}
                                    onDelete={this.handleCancelRequest}
                                />
                            )}
                        </Row>
                    </Container>
                </div>
            </div>
        );
    }
}

export default FriendRequests;
