import React, { Component } from 'react';
import AppNavbar from './AppNavbar';
import { Container, Form, Alert, FormGroup, Input, Row, Col, InputGroup, InputGroupAddon, InputGroupText, Button } from "reactstrap";
import AuthenticationService from "../services/AuthenticationService";

import '../../App.css';
import { Link } from 'react-router-dom';

import { RiLockPasswordLine } from 'react-icons/ri';
import { HiOutlineMail } from 'react-icons/hi';

import GoogleLogin from 'react-google-login';

class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      remember: false,
      error: ""
    };
  }

  changeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({[nam]: val});
  }

  toggleRememberValue = () => {
    const value = !this.state.remember;
    this.setState({remember: value});
  }

  responseGoogle = (response) => {
    if(response.error) {
      this.setState({error: response.details != null ? response.details : response.error});
    } else if (response.tokenId) {
      AuthenticationService.logInGoogle(response.tokenId).then(
          () => {
            this.props.history.push('/home');
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
    console.log(response);
  }

  doLogin = async (event) => {
    event.preventDefault();

    AuthenticationService
        .signin(this.state.email, 
                this.state.password,
                this.state.remember)
      .then(
        () => {
          this.props.history.push('/home');
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
            <Form  onSubmit={this.doLogin}>
            <h3 className="h3 mb-3 font-weight-normal text-center">Login</h3>
              {
                this.state.error && (
                  <Alert color="danger" className="mt-3">
                    {this.state.error}
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

              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText><RiLockPasswordLine /></InputGroupText>
                  </InputGroupAddon>
                  <Input type="password" 
                    name="password" id="password"
                    value={this.state.password}
                    placeholder="Your password"
                    autoComplete="password"
                    onChange={this.changeHandler}
                  />
                </InputGroup>
              </FormGroup>

              <React.StrictMode>
                <div className="mb-3">
                  Remember passsword? <input type="checkbox" name="rememberPassword" value={this.state.remember} onChange={this.toggleRememberValue} />
                </div>
              </React.StrictMode>

              <Button type="submit" color="primary" size="lg" block>
                Log in
              </Button>

              <div className="mt-3 text-center">
                <b>No account?</b>
              </div>

              <div className="text-center">
                <Row xs="2">
                  <Col>
                    <Link to="/signup">
                      Sign up
                    </Link>
                  </Col>
                  <Col>                 
                    <Link to="/forgotpassword">
                      Forgot password?
                    </Link>
                  </Col>
                </Row>

                <GoogleLogin
                  clientId="309423572945-fteqc77rsn47h579ng6e2dcahi0vusis.apps.googleusercontent.com"
                  buttonText="Login using Google"
                  onSuccess={this.responseGoogle}
                  onFailure={this.responseGoogle}
                  cookiePolicy={'single_host_origin'}
                />
              </div>
            </Form>
            </Col>
          </Row>
        </Container>
      </div>);
  }
}

export default Login;