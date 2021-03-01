import React, { Component } from 'react';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavbarText, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

import { withRouter } from 'react-router-dom';

import AuthenticationService from '../services/AuthenticationService';

class AppNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {isOpen: false};
    this.toggle = this.toggle.bind(this);

    this.state = {
      username: undefined,
      login: false
    };
  }

  componentDidMount() {
    const user = AuthenticationService.getCurrentUser();

    if (user) {
      this.setState({
        login: true,
        username: user.user.firstname + " " + user.user.lastname
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

  render() {
    return <Navbar color="dark" dark expand="md">
      <NavbarBrand tag={Link} to="/home">Filmchat</NavbarBrand>
      <Nav className="mr-auto">
        <NavLink tag={Link} to="/home">Home</NavLink>
      </Nav>
      <NavbarToggler onClick={this.toggle}/>
      <Collapse isOpen={this.state.isOpen} navbar>
        {
          this.state.login ? (
            <Nav className="ml-auto" navbar>
              <NavItem>
                  <NavbarText>
                    Signed in as: <Link to="/profile">{this.state.username}</Link>
                  </NavbarText>
              </NavItem>
              <NavItem>
                <NavLink href="#" onClick={this.signOut}>SignOut</NavLink>
              </NavItem>
            </Nav>                 
          ) : (
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink tag={Link} to="/signin">Login</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/signup">SignUp</NavLink>
              </NavItem>
            </Nav>
          )
        }
      </Collapse>
    </Navbar>;
  }
}

export default withRouter(AppNavbar);