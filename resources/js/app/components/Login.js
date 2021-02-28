import React, { Component } from 'react';
import AppNavbar from './AppNavbar';
import { Container } from 'reactstrap';
import { Form, Alert, FormGroup, Input, Label, Row, Col } from "reactstrap";
import {Button} from 'react-bootstrap';
import AuthenticationService from "../services/AuthenticationService";

import '../../App.css';
import { Link } from 'react-router-dom';



class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      error: ""
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
        .signin(this.state.email, 
                  this.state.password)
      .then(
        () => {
          this.props.history.push('/profile');
        },
        error => {
          if(error.response.data && error.response.data.error) {
            this.setState({error: error.response.data.error});
          } else {
            this.setState({error: "Can not signin successfully! Please check email/password again"});
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
            <center>
            <h2>Login</h2>
            </center>
            <Form  onSubmit={this.doLogin}>
              <FormGroup>
                <Label for="email"><strong>Email</strong></Label>
                <Input autoFocus 
                  type="text"
                  name="email" id="email"
                  value={this.state.email}
                  placeholder="Enter Email"
                  autoComplete="email"
                  onChange={this.changeHandler}
                />
              </FormGroup>

              <FormGroup>
                <Label for="password"><strong>Password</strong></Label>
                <Input type="password" 
                  name="password" id="password"
                  value={this.state.password}
                  placeholder="Enter Password"
                  autoComplete="password"
                  onChange={this.changeHandler}
                />
              </FormGroup>

              <React.StrictMode>
            <div>
                <b>Remember passsword </b>
                <input type = "checkbox" name = "rememberPassword"/>
            </div>
              </React.StrictMode>

              <Button type="submit" variant="primary" size="lg" block >
                Log in
              </Button>

              <div>
                <center>
                <b>
                  No account?
                </b>
                </center>
              </div>

        <div>
          <Container>
            <Row xs="4">
              <Col>

            </Col>
            <Col>
                  <Link to="/signup">
                    Sign up
                  </Link>
            </Col>
            <Col xs={5}>                  
                  <Link to="/forgotpassword">
                    Forgot password?
                  </Link>
            </Col>
          </Row>
        </Container>
      </div>
              {/* <div>
                <center>
                <b>
                  Or sign up using
                </b>
                </center>
              </div> */}

              {
                this.state.error && (
                  <Alert color="danger">
                    {this.state.error}
                  </Alert>
                )
              }
            </Form>
            </Col>
          </Row>
        </Container>
      </div>);
  }
}

export default Login;