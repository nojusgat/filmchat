import React, { Component } from 'react';
import AppNavbar from './AppNavbar';
import { useParams } from 'react-router-dom';
import { Form, Button, Container } from 'reactstrap';

import AuthenticationService from '../services/AuthenticationService';

class EmailVerify extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  doVerify = async (event) => {
    event.preventDefault();

    const { match: { params } } = this.props;

    AuthenticationService
        .verifyEmail(params.verify_id)
      .then(
        () => {
          console.log("Test, success?");
        },
        error => {
          console.log("Error");
        }
    );
  }

  render() {
    const user = AuthenticationService.getCurrentUser();

    // login
    if (!user) {
      return (
        <div>
          <AppNavbar/>
          <Container fluid>
          <Form  onSubmit={this.doVerify}>
            <Button color="primary">Verify email</Button>{' '}
          </Form>
          </Container>
        </div>
      );
    }
  }
}

export default EmailVerify;