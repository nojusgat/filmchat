import React, { Component } from 'react';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import { Form, Alert, FormGroup, Input, Label, Row, Col } from "reactstrap";
import { useState } from 'react';
import { Collapse, CardBody, Card } from 'reactstrap';

import AuthenticationService from '../services/AuthenticationService';

class Profile extends Component {
  
  constructor(props) {
    super(props);
    this.onEntered = this.onEntered.bind(this);
    this.onExited = this.onExited.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = { collapse: false, status: 'closed' };
  }

  componentDidMount() {
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

  

  render() {
    const user = AuthenticationService.getCurrentUser();
    

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <Row style={{marginTop:"30px"}}>
          {/* <img src="https://knowpathology.com.au/app/uploads/2018/07/Happy-Test-Screen-01-825x510.png" alt="Avatar" class="avatar"></img> */}
              <Col></Col>
              <Col sm="12" md={{ size: 2, offset: 0 }}>
              
              
                <Form  onSubmit={this.doLogin}>
                  <FormGroup>
                    <Label for="Name"><strong>Name</strong></Label>
                    <Input autoFocus 
                      value={user.user.firstname}
                      // onChange={this.changeHandler}
                    />
                    <Label for="Surname"><strong>Surname</strong></Label>
                    <Input autoFocus 
                      value={user.user.lastname}
                      // onChange={this.changeHandler}
                    />
                    <Label for="Email"><strong>Email</strong></Label>
                    <Input disabled autoFocus 
                      value={user.user.email}
                      // onChange={this.changeHandler}
                    />
                  </FormGroup>

                </Form>
                </Col>
                <Col><Button type="submit" variant="primary" >
                 Edit profile</Button>
                </Col>
              </Row>
              <Row style={{marginTop:"30px"}}>
              <Col sm="12" md={{ size: 7, offset: 0 }}><center><Button className='title' onClick={this.toggle} color="primary" style={{ marginBottom: '1rem' }}>About me</Button></center>
              </Col>
              <Row style={{marginTop:"30px"}}>
              <Col>
                <Collapse isOpen={this.state.collapse} onExited={this.onExited} onEntered={this.onEntered}>
                <Card>
                  <CardBody>
                  Anim pariatur cliche reprehenderit,
                  enim eiusmod high life accusamus terry richardson ad squid. Nihil
                  anim keffiyeh helvetica, craft beer labore wes anderson cred
                  nesciunt sapiente ea proident.
                  </CardBody>
                </Card>
              </Collapse></Col>
              </Row>
              </Row>
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
        </Container>
      </div>
    );
  }
}



export default Profile;