import React, { Component } from 'react';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavbarText, NavItem, Container, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link, withRouter, NavLink as RRNavLink } from 'react-router-dom';

import AuthenticationService from '../services/AuthenticationService';

import logoFilmchat from '../../logo_l.png';
import noAvatar from '../../no-avatar.png';

class AppNavbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      isOpenDrop: false,
      username: undefined,
      avatar: undefined,
      login: false
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

  render() {
    return <Navbar color="dark" dark expand="md" className="sticky-top">
      <Container className="py-4">
      <NavbarBrand tag={Link} to="/home"><img src={logoFilmchat} /></NavbarBrand>
      <NavbarToggler onClick={this.toggle}/>
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
                  <img src={"/storage/images/avatars/"+this.state.avatar} width="40" height="40" className="rounded-circle" style={{ position: "absolute", marginTop: "-8px" }} />
                  <span className="ml-5">{this.state.username}</span>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem header>Actions</DropdownItem>
                  <DropdownItem tag={Link} to="/profile">My Profile</DropdownItem>
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
