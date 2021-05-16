import React, { Component } from "react";
import AppNavbar from "../child-components/AppNavbar";
import {
    Button,
    Container,
    Row,
    Col,
    Spinner,
    Pagination,
    PaginationItem,
    PaginationLink,
    InputGroup,
} from "reactstrap";
import FriendsService from "../services/FriendsService";
import AuthenticationService from '../services/AuthenticationService';
import FriendCard from "../child-components/FriendCard";

class Friends extends Component {
    constructor(props) {
        super(props);

        this.state = {
            friendsList: [],
            page: 0,
            total_pages: 0,
            blockName: "Friends",
            isLoading: true
        };
    }

    componentDidMount() {
        if (this.state.friendsList.length == 0) {
            this.showFriends();
        }
        const user = AuthenticationService.getCurrentUser().user;
        this.listen(user.id);
    }

    componentWillUnmount() {
        const user = AuthenticationService.getCurrentUser();
        if (user) {
            window.Echo.leave('user-channel.' + user.user.id);
        }
    }

    showFriends() {
        FriendsService.getFriends().then(
            (response) => {
                this.setState({ friendsList: response.data, isLoading: false });
            },
            (error) => {
                console.log("Error in getFriends: " + error.toString());
            }
        );
    }

    listen(userId) {
        window.Echo.private('user-channel.' + userId).listen('Unfriended', () => {
            this.showFriends();
        });
    }

    render() {
        return (
            <div className="myFriends">
                <AppNavbar />
                <Container fluid>
                    <Row style={{ marginTop: "10px" }}>
                        <Col sm="12" md={{ size: 8, offset: 2 }}>
                            <h1 style={{ marginTop: "20px" }}>
                                {this.state.blockName} ({this.state.friendsList.length})
                            </h1>
                            {(() => {
                                if (this.state.isLoading) {
                                    return (
                                        <div
                                            style={{ marginTop: "20px" }}
                                            className="spinner"
                                        >
                                            <Spinner
                                                color="secondary"
                                                style={{
                                                    width: "100px",
                                                    height: "100px",
                                                }}
                                            />
                                        </div>
                                    );
                                } else {
                                    const listUsers = this.state.friendsList.map(function (data) {
                                        return (
                                            <Col md="6" xl="3" sm="12" className="mb-3" key={data.id.toString()}>
                                                <FriendCard data={data} />
                                            </Col>
                                        );
                                    });

                                    if(this.state.friendsList.length > 0) {
                                        return (
                                            <Row className="mb-2">{listUsers}</Row>
                                        );
                                    } else {
                                        return (
                                            <Row className="mb-2" style={{paddingBottom: "20vh"}}>You don't have any friends.</Row>
                                        );
                                    }
                                }
                            })()}
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Friends;
