import React, { Component } from 'react';
import AppNavbar from './AppNavbar';
import {  } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'reactstrap';

import AuthenticationService from '../services/AuthenticationService';

class EmailVerify extends Component {

  constructor(props) {
    super(props);

    this.state = {
      error: ""
    };
  }

  componentDidMount() {
  }

  doVerify = async (event) => {
    event.preventDefault();

    const { match: { params } } = this.props;

    AuthenticationService
        .verifyEmail(params.verify_id)
      .then(
        response => {
          if(response.data.success) {
            this.props.history.push('/signin');
          } else {
            this.setState({error: response.data.error});
          }
        },
        error => {
          this.setState({error: error.response.data});
        }
    );
  }

  render() {
      return (
        <div>
          <AppNavbar/>
          <Container fluid>
          <Form  onSubmit={this.doVerify}>
            <Row style={{marginTop:"20px"}}>
              <Col sm="12" md={{ size: 3, offset: 4 }}>
                <Button color="primary" block>Verify email</Button>
              </Col>
            </Row>
            {
                  this.state.error && (
                    <Row style={{marginTop:"20px"}}>
                      <Col sm="12" md={{ size: 3, offset: 4 }}>
                        <Alert color="danger">
                          {this.state.error}
                        </Alert>
                      </Col>
                    </Row>
                  )
                }
          </Form>
          </Container>
        </div>
      );
  }
}

export default EmailVerify;