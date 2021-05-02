import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import AppNavbar from "../child-components/AppNavbar";
import {
    Button,
    Container,
    Row,
    Col,
    Spinner,
    InputGroup,
    InputGroupAddon,
    Input,
} from "reactstrap";
import FriendsService from "../services/FriendsService";
import UserCard from "../child-components/UserCard";
import Paginate from "../child-components/Paginate";
import { AiOutlineSearch } from "react-icons/ai";

class Users extends Component {
    constructor(props) {
        super(props);

        this.state = this.props.location.state || {
            usersList: [],
            currentPage: 1,
            totalPages: 0,
            perPage: 20,
            blockName: "Users:",
            isLoading: true,
            search: "",
            method: "all",
        };

        this.showUsers.bind(this);
    }

    componentDidMount() {
        if (this.state.usersList.length == 0) {
            this.showUsers(this.state.currentPage);
        }
    }

    showUsers = (page) => {
        this.setState({ isLoading: true });
        console.log(this.state.method);
        switch (this.state.method) {
            case "all":
                FriendsService.getUsers(page, this.state.perPage).then(
                    (response) => {
                        this.setState({
                            usersList: response.data.users,
                            isLoading: false,
                            currentPage: page,
                            totalPages: response.data.count,
                        });
                        this.props.history.push({ state: this.state });
                    },
                    (error) => {
                        console.log("Error in getUsers: " + error.toString());
                    }
                );
                break;
            case "search":
                FriendsService.searchUsers(
                    page,
                    this.state.perPage,
                    this.state.search
                ).then(
                    (response) => {
                        this.setState({
                            usersList: response.data.users,
                            isLoading: false,
                            currentPage: page,
                            totalPages: response.data.count,
                        });
                        this.props.history.push({ state: this.state });
                    },
                    (error) => {
                        console.log(
                            "Error in searchUsers: " + error.toString()
                        );
                    }
                );
                break;
            default:
                break;
        }
    };

    changeHandler = (e) => {
        this.setState({ search: e.target.value });
    };

    searchHandler = () => {
        if (this.state.search === "") {
            this.setState(
                {
                    method: "all",
                    blockName: "Users:",
                    isLoading: true,
                },
                () => {
                    this.showUsers(1);
                }
            );
        } else {
            this.setState(
                {
                    method: "search",
                    blockName: 'Searching "' + this.state.search + '":',
                    isLoading: true,
                },
                () => {
                    this.showUsers(1);
                }
            );
        }
    };

    render() {
        return (
            <div>
                <AppNavbar />
                <Container fluid>
                    <Row>
                        <Col
                            style={{ marginTop: "20px" }}
                            md={{ size: 4, offset: 2 }}
                        >
                            <InputGroup>
                                <Input
                                    placeholder="Search users..."
                                    defaultValue={this.state.search}
                                    name="search"
                                    onChange={this.changeHandler}
                                />
                                <InputGroupAddon addonType="append">
                                    <Button
                                        outline
                                        color="info"
                                        name="search"
                                        onClick={this.searchHandler}
                                    >
                                        <AiOutlineSearch name="search" />
                                    </Button>
                                </InputGroupAddon>
                            </InputGroup>
                        </Col>
                    </Row>
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
                                    const listUsers = this.state.usersList.map(
                                        function (data) {
                                            return (
                                                <Col
                                                    md="6"
                                                    xl="3"
                                                    sm="12"
                                                    className="mb-3"
                                                    key={data.id.toString()}
                                                >
                                                    <UserCard data={data} />
                                                </Col>
                                            );
                                        }
                                    );

                                    return (
                                        <div style={{ marginTop: "20px" }}>
                                            <Row>
                                                <Paginate
                                                    setPage={this.showUsers}
                                                    totalPages={
                                                        this.state.totalPages
                                                    }
                                                    currentPage={
                                                        this.state.currentPage
                                                    }
                                                    perPage={this.state.perPage}
                                                />
                                            </Row>
                                            <Row className="mb-2">
                                                {this.state.usersList.length ==
                                                0
                                                    ? "Users not found."
                                                    : listUsers}
                                            </Row>
                                            <Row>
                                                <Paginate
                                                    setPage={this.showUsers}
                                                    totalPages={
                                                        this.state.totalPages
                                                    }
                                                    currentPage={
                                                        this.state.currentPage
                                                    }
                                                    perPage={this.state.perPage}
                                                />
                                            </Row>
                                        </div>
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

export default withRouter(Users);
