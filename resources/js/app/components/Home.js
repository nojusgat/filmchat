import React, { Component } from 'react';
import AppNavbar from './AppNavbar';
import { Container, Alert, Row, Col } from 'reactstrap';

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
          <Row style={{marginTop:"20px"}}>
            <Col sm="12" md={{ size: 8, offset: 2 }}>
              <div style={{marginTop:"20px"}}>
                <Alert variant="primary">
                  <h2>Main page</h2>
                </Alert>
              </div>
            </Col>
          </Row>
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