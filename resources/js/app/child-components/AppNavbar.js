import React, { Component } from 'react';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavbarText, NavItem, Container, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Badge } from 'reactstrap';
import { Link, withRouter, NavLink as RRNavLink } from 'react-router-dom';

import AuthenticationService from '../services/AuthenticationService';
import FriendsService from "../services/FriendsService";

import logoFilmchat from '../../logo_l.png';
import noAvatar from '../../no-avatar.png';

import { store } from 'react-notifications-component';

import 'animate.css';

class AppNavbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            isOpenDrop: false,
            username: undefined,
            avatar: undefined,
            login: false,
            friendReqCount: 0
        };

        this.toggle = this.toggle.bind(this);
        this.toggleDropDown = this.toggleDropDown.bind(this);
    }

    componentDidMount() {
        const user = AuthenticationService.getCurrentUser();

        if (user) {
            this.setState({
                login: true,
                username: user.user.firstname + " " + user.user.lastname,
                avatar: user.user.avatar
            });

            this.getFriendRequestCount();
            this.listen(user.user.id);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const user = AuthenticationService.getCurrentUser();

        if (user && (prevState.avatar != user.user.avatar || prevState.username != (user.user.firstname + " " + user.user.lastname))) {
            this.setState({
                login: true,
                username: user.user.firstname + " " + user.user.lastname,
                avatar: user.user.avatar
            });
        }
    }

    componentWillUnmount() {
        const user = AuthenticationService.getCurrentUser();
        if (user) {
            window.Echo.leave('user-channel.' + user.user.id);
        }
    }

    signOut = () => {
        AuthenticationService.signOut();
        this.props.history.push('/');
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    toggleDropDown() {
        this.setState({
            isOpenDrop: !this.state.isOpenDrop
        });
    }

    async getFriendRequestCount() {
        FriendsService.getIncomingRequestsCount().then(
            response => {
                this.setState({ friendReqCount: response.data });
            },
            error => {
                console.log("Error in getIncomingRequestsCount: " + error.toString());
            }
        );
    }

    listen(userId) {
        window.Echo.private('user-channel.' + userId).listen('FriendRequestCountChanged', () => {
            this.getFriendRequestCount();
        }).listen('FriendRequestSent', (e) => {
            store.addNotification({
                message: `${e.otherUser.firstname} ${e.otherUser.lastname} has sent you a friend request!`,
                type: "default",
                insert: "bottom",
                container: "bottom-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                    duration: 5000,
                    onScreen: true
                }
            });
        }).listen('MessageSent', (e) => {
            if (this.props.match.params.id != e.message.sender_id) {
                store.addNotification({
                    title: `${e.other.firstname} ${e.other.lastname} has sent you a message!`,
                    message: `"${e.message.body}"`,
                    type: "success",
                    insert: "bottom",
                    container: "bottom-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                        duration: 5000,
                        onScreen: true
                    }
                });
            }
        });
    }

    render() {
        return <Navbar color="dark" dark expand="md" className="sticky-top">
            <Container className="py-4">
                <NavbarBrand tag={Link} to="/home"><img src={logoFilmchat} /></NavbarBrand>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav className="mr-auto" navbar>
                        <NavLink tag={RRNavLink} to="/home" activeClassName="active">Home</NavLink>
                        <NavLink tag={RRNavLink} to="/users" activeClassName="active">Find friends</NavLink>
                        <NavLink tag={RRNavLink} to="/about" activeClassName="active">About us</NavLink>
                    </Nav>
                    {
                        this.state.login ? (
                            <Nav className="ml-auto" navbar>
                                <Dropdown nav isOpen={this.state.isOpenDrop} toggle={this.toggleDropDown}>
                                    <DropdownToggle nav caret>
                                        <div className="rect-img-container nav-avatar">
                                            <img src={"/storage/images/avatars/" + this.state.avatar} className="rect-img rounded-circle" style={{ borderRadius: "50%" }} />
                                        </div>
                                        <span className="ml-1" style={{ marginLeft: "-15px" }}>{this.state.username} {this.state.friendReqCount === 0 ? " " : <Badge color="info" pill>{this.state.friendReqCount}</Badge>}</span>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem header>Actions</DropdownItem>
                                        <DropdownItem tag={Link} to="/profile">My Profile</DropdownItem>
                                        <DropdownItem tag={Link} to="/friends">My Friends</DropdownItem>
                                        <DropdownItem tag={Link} to="/requests">Friend Requests {this.state.friendReqCount === 0 ? " " : <Badge color="info" pill>{this.state.friendReqCount}</Badge>}</DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem href="#" onClick={this.signOut}>Log Out</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </Nav>
                        ) : (
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <NavLink tag={RRNavLink} to="/signin" activeClassName="active">Login</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={RRNavLink} to="/signup" activeClassName="active">Register</NavLink>
                                </NavItem>
                            </Nav>
                        )
                    }
                </Collapse>
            </Container>
        </Navbar>;
    }
}

export default withRouter(AppNavbar);
