import React, { Component } from 'react';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { Button, Container, Alert } from 'reactstrap';

import AuthenticationService from '../services/AuthenticationService';

class Home extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    const user = AuthenticationService.getCurrentUser();

    // login
    if (user && user.access_token) {
      return (
        <div>
          <AppNavbar/>
          <Container fluid>
            <div style={{marginTop:"20px"}}>
              <Alert variant="primary">
                <h2>Main page</h2>
              </Alert>
            </div>
          </Container>
        </div>
      );
    } else { // not login
      this.props.history.push('/');
      window.location.reload();
      return (
        <div>
          <AppNavbar/>
        </div>
      );
    }
  }
}

export default Home;