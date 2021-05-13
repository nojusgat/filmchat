import React, { Component } from 'react';
import AppNavbar from '../child-components/AppNavbar';
import { Container, Button, Form, FormGroup, Input, Label, Row, Col, CustomInput, FormFeedback, Alert, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";

import Authentication from '../services/AuthenticationService'

import { FiUser, FiUsers } from 'react-icons/fi'
import { RiLockPasswordLine } from 'react-icons/ri';
import { HiOutlineMail } from 'react-icons/hi';

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
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      password_confirmation: "",
      gender: "",
      message: "",
      successful: false,
      validForm: true,
      errors: {
        firstname: '',
        lastname: '',
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
      case 'firstname':
        errors.firstname = 
          value.length < 5
            ? 'First name must be 5 characters long!'
            : '';
        break;
      case 'lastname':
        errors.lastname = 
          value.length < 5
            ? 'Last name must be 5 characters long!'
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
        this.state.firstname,
        this.state.lastname,
        this.state.email,
        this.state.password,
        this.state.password_confirmation,
        this.state.gender
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
    const errors = this.state.errors;

    let alert = "";

    if(this.state.message){
      if(this.state.successful){
        alert = (
                  <Alert color="success" className="mt-3">
                    {this.state.message}
                  </Alert>
                );
      }else{
        alert = (
                  <Alert color="danger" className="mt-3">
                    {this.state.message}
                  </Alert>
                );
      }
    }

    return ( 
      <div className="startBackgroundImage">
        <AppNavbar/>
        <Container fluid>
          <Row style={{marginTop:"20px"}}>
            <Col sm="12" md={{ size: 3, offset: 4 }}>
            <Form onSubmit={this.signUp}>
              <h3 style={{color:'black'}} className="h3 mb-3 font-weight-normal text-center">Register</h3>
              <p style={{color:'black'}} className="mb-4">This site is only for registered users. Please register below to use the site.</p>
              {
                  !this.state.validForm && (
                    <Alert key="validForm" color="danger" className="mt-3">
                      Please check the inputs again!
                    </Alert>
                  )
              }

              {alert}
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText><FiUser /></InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="text" 
                    placeholder="Provide your firstname"
                    name="firstname" id="firstname"
                    value={this.state.firstname}
                    autoComplete="firstname"
                    onChange={this.changeHandler}
                    invalid={errors.firstname ? true : null}
                  />
                  {
                    errors.firstname && ( 
                      <FormFeedback invalid>{errors.firstname}</FormFeedback>
                      )
                  }
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText><FiUsers /></InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="text" 
                    placeholder="Provide your lastname"
                    name="lastname" id="lastname"
                    value={this.state.lastname}
                    autoComplete="lastname"
                    onChange={this.changeHandler}
                    invalid={errors.lastname ? true : null}
                  />
                  {
                    errors.lastname && ( 
                      <FormFeedback invalid>{errors.lastname}</FormFeedback>
                      )
                  }
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText><HiOutlineMail /></InputGroupText>
                  </InputGroupAddon>
                  <Input required
                    type="text" 
                    placeholder="Provide a valid e-mail address"
                    name="email" id="email"
                    value={this.state.email}
                    autoComplete="email"
                    onChange={this.changeHandler}
                    invalid={errors.email ? true : null}
                  />
                  {
                    errors.email && ( 
                      <FormFeedback invalid>{errors.email}</FormFeedback>
                      )
                  }
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText><RiLockPasswordLine /></InputGroupText>
                  </InputGroupAddon>
                  <Input required 
                    type="password" 
                    placeholder="Choose your password"
                    name="password" id="password"
                    value={this.state.password}
                    autoComplete="password"
                    onChange={this.changeHandler}
                    invalid={errors.password ? true : null}
                  />
                  {
                    errors.password && ( 
                      <FormFeedback invalid>{errors.password}</FormFeedback>
                      )
                  }
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText><RiLockPasswordLine /></InputGroupText>
                  </InputGroupAddon>
                  <Input required 
                    type="password" 
                    placeholder="Confirm your password"
                    name="password_confirmation" id="password_confirmation"
                    value={this.state.password_confirmation}
                    autoComplete="password"
                    onChange={this.changeHandler}
                    invalid={errors.password_confirmation ? true : null}
                  />
                  {
                    errors.password_confirmation && ( 
                      <FormFeedback invalid>{errors.password_confirmation}</FormFeedback>
                      )
                  }
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <Label style={{color:'black'}} for="gender">Gender</Label>
                <div style={{color:'black'}}>
                  <CustomInput onChange={this.changeHandler} type="radio" value="Male" id="Male" name="gender" label="Male" />
                  <CustomInput onChange={this.changeHandler} type="radio" value="Female" id="Female" name="gender" label="Female" />
                  <CustomInput onChange={this.changeHandler} type="radio" value="Other" id="Other" name="gender" label="Other" />
                </div>
              </FormGroup>

              <Button style={{borderRadius:'25px'}} color="success" type="submit" size="lg" block>
                Create account
              </Button>
            </Form>
            </Col>
          </Row>
        </Container>
      </div>);
  }
}

export default SignUp;