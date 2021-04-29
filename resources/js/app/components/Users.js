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
import UserCard from "../child-components/UserCard";

class Users extends Component {
    constructor(props) {
        super(props);

        this.state = {
            usersList: [],
            page: 0,
            total_pages: 0,
            isOpenDrop: false,
            search: "",
            additional: null,
            method: "popular",
            blockName: "Users",
            isLoading: true,
        };
    }

    componentDidMount() {
        if (this.state.usersList.length == 0) {
            this.showUsers();
        }
        // console.log(this.state.currentUser);
    }

    showUsers() {
        FriendsService.getUsers().then(
            (response) => {
                this.setState({ usersList: response.data, isLoading: false });
                // console.log(this.state.usersList);
            },
            (error) => {
                console.log("Error in getUsers: " + error.toString());
            }
        );
    }

    render() {
        return (
            <div>
                <AppNavbar />
                <Container fluid>
                    <Row style={{ marginTop: "10px" }}>
                        <Col sm="12" md={{ size: 8, offset: 2 }}>
                            <h1 style={{ marginTop: "20px" }}>
                                {this.state.blockName}
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
                                    return (
                                        <UserCard data={this.state.usersList} />
                                    );
                                }
                            })()}
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Users;
