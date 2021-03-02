import React, { Component } from 'react';
import AppNavbar from './AppNavbar';
import {  } from 'react-router-dom';
import { Container, Form, Alert, FormGroup, Input, Row, Col, InputGroup, InputGroupAddon, InputGroupText, Button } from "reactstrap";

import AuthenticationService from '../services/AuthenticationService';

import { RiLockPasswordLine } from 'react-icons/ri';

class ForgotPasswordComplete extends Component {

  constructor(props) {
    super(props);

    this.state = {
      error: "",
      success: "",
      password: "",
      password_confirmation: "",
      valid: false,
      checked: false
    };
  }

  componentDidMount() {
    const { match: { params } } = this.props;

    AuthenticationService.checkRecoverToken(params.reset_id).then(
      response => {
        if(response.data.valid) {
          this.setState({valid: true, checked: true});
        } else {
          this.setState({valid: false, checked: true});
        }
      });
  }

  changeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({[nam]: val});
  }

  doVerify = async (event) => {
    event.preventDefault();

    const { match: { params } } = this.props;

    AuthenticationService
        .completeRecoverPassword(params.reset_id, this.state.password, this.state.password_confirmation)
      .then(
        response => {
          if(response.data.success) {
            this.setState({success: response.data.message, error: ""});
          } else {
            this.setState({error: response.data.error, success: ""});
          }
        },
        error => {
          var errors = "Unkown error";

          if(error.response.data) {
            var errorsArray = [];
            errors = JSON.parse(error.response.data);
            
            for (var i in errors) {
              errorsArray.push(errors[i][0]);
            }
            errors = errorsArray.join(' ');
          }
          
          this.setState({
            success: "",
            error: errors
          });
        }
    );
  }

  render() {
    if(this.state.valid && this.state.checked) {
      return ( 
        <div>
          <AppNavbar/>
          <Container fluid>
            <Row style={{marginTop:"20px"}}>
            <Col sm="12" md={{ size: 3, offset: 4 }}>
              <Form onSubmit={this.doVerify}>
                <h3 className="h3 mb-3 font-weight-normal text-center">Password reset</h3>
                <p className="mb-4">Please enter a password to complete the password reset.</p>
                {
                  this.state.error && (
                    <Alert color="danger" className="mt-3">
                      {this.state.error}
                    </Alert>
                  )
                }
                {
                  this.state.success && (
                    <Alert color="success" className="mt-3">
                      {this.state.success}
                    </Alert>
                  )
                }
                <FormGroup>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText><RiLockPasswordLine /></InputGroupText>
                    </InputGroupAddon>
                    <Input type="password"
                    name="password" id="password"
                    value={this.state.email}
                    placeholder="Please enter your new password"
                    autoComplete="password"
                    onChange={this.changeHandler} />
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText><RiLockPasswordLine /></InputGroupText>
                    </InputGroupAddon>
                    <Input type="password"
                    name="password_confirmation" id="password_confirmation"
                    value={this.state.email}
                    placeholder="Please confirm your new password"
                    autoComplete="password"
                    onChange={this.changeHandler} />
                  </InputGroup>
                </FormGroup>

                <Button type="submit" color="primary" size="lg" block >
                  Reset password
                </Button>
              </Form>
              </Col>
            </Row>
          </Container>
        </div>);
      } else if (!this.state.valid && this.state.checked) {
        this.props.history.push('/');
        return (
          <div>
          </div>
        );
      } else {
        return (
          <div>
          </div>
        );
      }
  }
}

export default ForgotPasswordComplete;