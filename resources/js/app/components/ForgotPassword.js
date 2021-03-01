import React, { Component } from 'react';
import AppNavbar from './AppNavbar';
import { Container, Form, Alert, FormGroup, Input, Row, Col, InputGroup, InputGroupAddon, InputGroupText, Button } from "reactstrap";
import AuthenticationService from "../services/AuthenticationService";

import '../../App.css';

import { HiOutlineMail } from 'react-icons/hi';

class ForgotPassword extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
          email: "",
          error: "",
          success: ""
        };
    }

    changeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    }

    doLogin = async (event) => {
        event.preventDefault();
    
        AuthenticationService
            .requestRecoverPassword(this.state.email)
          .then(
            response => {
              if(response.data.success) {
                this.setState({success: response.data.message, error: ""});
              } else {
                this.setState({error: response.data.error, success: ""});
              }
            },
            error => {
              if(error.response.data && error.response.data.error) {
                this.setState({error: error.response.data.error, success: ""});
              } else {
                this.setState({error: "No account with matching email", success: ""});
              }
            }
        );
    }

    render() {
        return ( 
          <div>
            <AppNavbar/>
            <Container fluid>
              <Row style={{marginTop:"20px"}}>
              <Col sm="12" md={{ size: 3, offset: 4 }}>
                <Form  onSubmit={this.doLogin}>
                  <h3 className="h3 mb-3 font-weight-normal text-center">Password reset</h3>
                  <p className="mb-4">Provide a valid email address to reset your account's password.</p>
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
                        <InputGroupText><HiOutlineMail /></InputGroupText>
                      </InputGroupAddon>
                      <Input type="text"
                      name="email" id="email"
                      value={this.state.email}
                      placeholder="Your e-mail address"
                      autoComplete="email"
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
    }
}
export default ForgotPassword