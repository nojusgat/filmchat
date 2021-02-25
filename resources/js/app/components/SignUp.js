import React, { Component } from 'react';
import AppNavbar from './AppNavbar';
import { Container } from 'reactstrap';
import { Button, Form, FormGroup, Input, Label, Row, Col } from "reactstrap";
import { Alert } from "react-bootstrap"

import Authentication from '../services/AuthenticationService'

const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach(
    (val) => val.length > 0 && (valid = false)
  );
  return valid;
}

class SignUp extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
      message: "",
      successful: false,
      validForm: true,
      errors: {
        username: '',
        email: '',
        password: '',
        password_confirmation: ''
      }
    };
  }

  changeHandler = (event) => {
    const { name, value } = event.target;
    const { password } = this.state;
  
    let errors = this.state.errors;

    switch (name) {
      case 'username':
        errors.username = 
          value.length < 5
            ? 'Username must be 5 characters long!'
            : '';
        break;
      case 'email': 
        errors.email = 
          validEmailRegex.test(value)
            ? ''
            : 'Email is not valid!';
        break;
      case 'password': 
        this.setState({password: value});
        errors.password = 
          value.length < 8
            ? 'Password must be 8 characters long!'
            : '';
        break;
      case 'password_confirmation':
        errors.password_confirmation = 
          value.length < 8
            ? 'Password must be 8 characters long!'
            : (password != value
            ? 'Passwords must match'
            : '');
        break;
      default:
        break;
    }
  
    this.setState({errors, [name]: value}, ()=> {
        console.log(errors)
    })  
  }

  signUp = (e) => {
    e.preventDefault();
    const valid = validateForm(this.state.errors);
    this.setState({validForm: valid});
    if(valid){
      Authentication.register(
        this.state.username,
        this.state.email,
        this.state.password,
        this.state.password_confirmation
      ).then(
        response => {
          this.setState({
            message: response.data.message,
            successful: true
          });
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
            successful: false,
            message: errors
          });
        }
      );  
    }
  }

  render() {
    const title = <h2>Register User</h2>;
    const errors = this.state.errors;

    let alert = "";

    if(this.state.message){
      if(this.state.successful){
        alert = (
                  <Alert variant="success">
                    {this.state.message}
                  </Alert>
                );
      }else{
        alert = (
                  <Alert variant="danger">
                    {this.state.message}
                  </Alert>
                );
      }
    }

    return ( 
      <div>
        <AppNavbar/>
        <Container fluid>
          <Row style={{marginTop:"20px"}}>
          <Col sm="12" md={{ size: 4, offset: 4 }}>
          {title}
            <Form onSubmit={this.signUp}>
              <FormGroup controlId="forUsername">
                <Label for="username">Username</Label>
                <Input
                  type="text" 
                  placeholder="Enter UserName"
                  name="username" id="username"
                  value={this.state.username}
                  autoComplete="username"
                  onChange={this.changeHandler}
                />
                {
                  errors.username && ( 
                      <Alert variant="danger">
                        {errors.username}
                      </Alert>
                    )
                }
              </FormGroup>

              <FormGroup controlId="formEmail">
                <Label for="email">Email</Label>
                <Input required
                  type="text" 
                  placeholder="Enter Email"
                  name="email" id="email"
                  value={this.state.email}
                  autoComplete="email"
                  onChange={this.changeHandler}
                />
                {
                  errors.email && ( 
                      <Alert variant="danger">
                        {errors.email}
                      </Alert>
                    )
                }
              </FormGroup>

              <FormGroup controlId="formPassword">
                <Label for="password">Password</Label>
                <Input required 
                  type="password" 
                  placeholder="Enter Password"
                  name="password" id="password"
                  value={this.state.password}
                  autoComplete="password"
                  onChange={this.changeHandler}
                />
                {
                  errors.password && ( 
                      <Alert key="errorspassword" variant="danger">
                        {errors.password}
                      </Alert>
                    )
                }
              </FormGroup>

              <FormGroup controlId="formPasswordConfirmation">
                <Label for="password_confirmation">Password confirmation</Label>
                <Input required 
                  type="password" 
                  placeholder="Enter Password Again"
                  name="password_confirmation" id="password_confirmation"
                  value={this.state.password_confirmation}
                  autoComplete="password_confirmation"
                  onChange={this.changeHandler}
                />
                {
                  errors.password_confirmation && ( 
                      <Alert key="errorspassword_confirmation" variant="danger">
                        {errors.password_confirmation}
                      </Alert>
                    )
                }
              </FormGroup>

              <Button variant="primary" type="submit">
                Create
              </Button>
              {
                !this.state.validForm && (
                  <Alert key="validForm" variant="danger">
                    Please check the inputs again!
                  </Alert>
                )
              }

              {alert}
            </Form>
            </Col>
          </Row>
        </Container>
      </div>);
  }
}

export default SignUp;