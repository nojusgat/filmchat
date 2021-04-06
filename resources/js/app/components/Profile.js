import React, { Component } from 'react';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import { Form, Alert,CustomInput, FormGroup, Input, Label, Row, Col } from "reactstrap";
import { useState } from 'react';
import { Collapse, CardBody, Card } from 'reactstrap';

import AuthenticationService from '../services/AuthenticationService';
import BackendService from '../services/BackendService';


class Profile extends Component {
  
  constructor(props) {
    super(props);
    this.onEntered = this.onEntered.bind(this);
    this.onExited = this.onExited.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = { collapse: false, status: 'closed' };
  }
  componentDidMount() {
    const user = AuthenticationService.getCurrentUser();
    this.setState({name: user.user.firstname, surname: user.user.lastname, email: user.user.email, gender: user.user.gender,
    about: "tes tes tes Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson crednesciunt sapiente ea proident."});
  }

  onEntered() {
    this.setState({ status: '' });
  }

  onExited() {
    this.setState({ status: '' });
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  changeHandler = (event) =>{
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({[nam]: val});
    console.log(this.state.name);
  }

  ProfileInfoChange = async (event) => {
    event.preventDefault();

    BackendService
        .setUserInfo(this.state.name, 
                this.state.surname,
                this.state.gender)
      .then(
        (response) => {
          console.log(response);
          var test = JSON.parse(localStorage.getItem('user'));
          test.user = response.data.updated_info;
          localStorage.setItem("user", JSON.stringify(test));
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
    const user = AuthenticationService.getCurrentUser();
    const test = "selected";

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <Row style={{marginTop:"30px"}}>
          {/* <img src="https://knowpathology.com.au/app/uploads/2018/07/Happy-Test-Screen-01-825x510.png" alt="Avatar" class="avatar"></img> */}
              <Col style={{marginLeft:"350px"}}>

              </Col>

              <Col sm="12" md={{ size: 2, offset: 0 }}>
                <Form  onSubmit={this.doLogin}>
                  <FormGroup>
                    <Label for="Name"><strong>Name</strong></Label>
                    <Input
                      value={this.state.name}
                      onChange={this.changeHandler} name="name"
                    />
                    <Label for="Surname"><strong>Surname</strong></Label>
                    <Input
                      value={this.state.surname}
                      onChange={this.changeHandler} name="surname"
                    />
                    <Label for="Email"><strong>Email</strong></Label>
                    <Input disabled
                      value={this.state.email}
                      onChange={this.changeHandler} name="email" 
                    />
                    <Label for="gender">Gender</Label>
                    <div>
                    <CustomInput onChange={this.changeHandler} type="radio" value="Male" id="Male" name="gender" label="Male"  checked={this.state.gender == "Male"}/>
                    <CustomInput onChange={this.changeHandler} type="radio" value="Female" id="Female" name="gender" label="Female" checked={this.state.gender == "Female"} />
                    <CustomInput onChange={this.changeHandler} type="radio" value="Other" id="Other" name="gender" label="Other" checked={this.state.gender == "Other"} />
                    </div>
                  </FormGroup>

                  <CustomInput onChange={this.changeHandler} type="radio" value="Male" id="Male" name="gender" label="Male"  checked={this.state.gender == "Male"}/>
                  <CustomInput onChange={this.changeHandler} type="radio" value="Female" id="Female" name="gender" label="Female" checked={this.state.gender == "Female"} />
                  <CustomInput onChange={this.changeHandler} type="radio" value="Other" id="Other" name="gender" label="Other" checked={this.state.gender == "Other"} />
                </Form>
                </Col>
                <Col><Button onClick={this.ProfileInfoChange} type="submit" variant="primary" >
                 Edit profile</Button>
                </Col>
              </Row>
              
              <Row style={{marginTop:"30px"}}>
              <Col sm="12" md={{ size: 7, offset: 0 }}><center><Button className='title' onClick={this.toggle} color="primary" style={{ marginBottom: '1rem' }}>About me</Button></center>
              </Col>
              <Row style={{marginTop:"30px"}}>
              <Col style={{marginLeft:"500px", marginRight:"600px"}}>
                <Collapse isOpen={this.state.collapse} onExited={this.onExited} onEntered={this.onEntered}>
                <Card>
                  <CardBody>
                  {this.state.about}
                  </CardBody>
                </Card>
              </Collapse></Col>
              </Row>
              </Row>
              <div style={{marginLeft:"500px",marginRight:"200px"}}>
              <Row style={{marginTop:"30px"}}>
              <Col></Col>
              </Row>
              <Row style={{marginTop:"30px"}}> 
              <Col>Hello world</Col>
              <Col>Hello world</Col>
              <Col>Hello world</Col>
              </Row>
              
              <Row style={{marginTop:"30px"}}>
              <Col></Col>
              </Row>
              </div>
        </Container>
      </div>
    );
  }
}



export default Profile;

