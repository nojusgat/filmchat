import React, { Component } from 'react';
import AppNavbar from '../child-components/AppNavbar';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import { Form, Alert, CustomInput, FormGroup, Input, Label, Row, Col } from "reactstrap";
import { useState } from 'react';
import { Collapse, CardBody, Card } from 'reactstrap';

import AuthenticationService from '../services/AuthenticationService';
import BackendService from '../services/BackendService';
import { cssNumber } from 'jquery';
import MovieCard from '../child-components/MovieCard';

class Profile extends Component {

    constructor(props) {
        super(props);
        this.onEntered = this.onEntered.bind(this);
        this.onExited = this.onExited.bind(this);
        this.toggle = this.toggle.bind(this);

        this.state = {
            aboutTextToggle: true,
            collapse: false,
            status: 'closed',
            alert: [],
            name: '',
            surname: '',
            email: '',
            gender: '',
            about: ''
        };
    }
    componentDidMount() {
        const user = AuthenticationService.getCurrentUser();
        this.setState({
            name: user.user.firstname,
            surname: user.user.lastname,
            email: user.user.email,
            gender: user.user.gender,
            about: user.user.about == null ? "Nothing here. Press to edit..." : user.user.about,
            favorites: []
        });


        BackendService.getInfosByIds(user.user.favorites).then(
            (response) => {
                this.setState({ favorites: response.data })
            },
            (error) => {
                console.log("Error getting movie info: " + error.toString());
            }
        )
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

    changeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
        console.log(this.state.name);
    }

    changeAvatarHandler = (event) => {
        this.setState({ alert: [...this.state.alert, { message: "Uploading avatar...", type: 3 }] }, () => { window.setTimeout(() => { this.state.alert.shift(); this.setState({ alert: this.state.alert }) }, 2000) });
        const photo = event.target.files[0];
        let formData = new FormData();
        formData.append('avatar', photo);
        BackendService.changeAvatar(formData).then(
            (response) => {
                var currentStorage = JSON.parse(localStorage.getItem('user'));
                currentStorage.user = response.data.updated_info;
                localStorage.setItem("user", JSON.stringify(currentStorage));
                this.setState({ alert: [...this.state.alert, { message: response.data.message, type: response.data.success ? 1 : 2 }] }, () => { window.setTimeout(() => { this.state.alert.shift(); this.setState({ alert: this.state.alert }) }, 2000) });
            },
            error => {
                console.log(error);
            }
        );
    }

    ProfileInfoChange = async (event) => {
        event.preventDefault();

        BackendService
            .setUserInfo(this.state.name,
                this.state.surname,
                this.state.gender)
            .then(
                (response) => {
                    var currentStorage = JSON.parse(localStorage.getItem('user'));
                    currentStorage.user = response.data.updated_info;
                    localStorage.setItem("user", JSON.stringify(currentStorage));
                    if (response.data.error) {
                        this.setState({ alert: [...this.state.alert, { message: response.data.error.error, type: 3 }] }, () => { window.setTimeout(() => { this.state.alert.shift(); this.setState({ alert: this.state.alert }) }, 2000) });
                    } else {
                        Object.keys(response.data).forEach((key) => {
                            if (key != "updated_info") {
                                this.setState({ alert: [...this.state.alert, { message: response.data[key].message, type: response.data[key].success ? 1 : 2 }] }, () => { window.setTimeout(() => { this.state.alert.shift(); this.setState({ alert: this.state.alert }) }, 2000) });
                            }
                        });
                    }
                },
                error => {
                    var errors = "Unkown error";

                    if (error.response.data) {
                        errors = JSON.parse(error.response.data);
                        Object.keys(errors).forEach((key) => {
                            this.setState({ alert: [...this.state.alert, { message: errors[key], type: 2 }] }, () => { window.setTimeout(() => { this.state.alert.shift(); this.setState({ alert: this.state.alert }) }, 2000) });
                        });
                    } else {
                        this.setState({ alert: [...this.state.alert, { message: errors, type: 2 }] }, () => { window.setTimeout(() => { this.state.alert.shift(); this.setState({ alert: this.state.alert }) }, 2000) });
                    }
                }
            );
    }

    handleInputHeightChange(e) {
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`;
    }

    render() {
        let alert = "";

        Object.keys(this.state.alert).forEach(element => {
            alert = (
                <div>
                    {alert}
                    {this.state.alert[element].type == 1 ?
                        <Alert color="success" className="mt-3">
                            {this.state.alert[element].message}
                        </Alert>
                        : this.state.alert[element].type == 2 ?
                            <Alert color="danger" className="mt-3">
                                {this.state.alert[element].message}
                            </Alert>
                            : this.state.alert[element].type == 3 ?
                                <Alert color="info" className="mt-3">
                                    {this.state.alert[element].message}
                                </Alert>
                                : ""}
                </div>
            );
        });

    return (
      <div className="backgroundImage">
        <AppNavbar />
        <Container fluid className="profile">
          {alert}
          <Row style={{marginTop:"30px"}}>
          {/* <img src="https://knowpathology.com.au/app/uploads/2018/07/Happy-Test-Screen-01-825x510.png" alt="Avatar" class="avatar"></img> */}
              <Col sm md={{ offset: 2 }}>
                <FormGroup>
                  <Label for="avatar">Upload your avatar</Label>
                  <CustomInput type="file" id="avatar" name="avatar" accept="image/*" onChange={this.changeAvatarHandler} />
                </FormGroup>
              </Col>

              <Col sm="12" md={{ size: 2, offset: 0 }}>
                <Form  onSubmit={this.doLogin}>
                  <FormGroup>
                    <Label for="Name">Name</Label>
                    <Input
                      value={this.state.name}
                      onChange={this.changeHandler} name="name"
                    />
                    <Label for="Surname">Surname</Label>
                    <Input
                      value={this.state.surname}
                      onChange={this.changeHandler} name="surname"
                    />
                    <Label for="Email">Email</Label>
                    <Input disabled
                      value={this.state.email}
                      onChange={this.changeHandler} name="email"
                    />
                    <Label for="gender">Gender</Label>
                    <div>
                    <CustomInput className="profileCheckBox" onChange={this.changeHandler} type="radio" value="Male" id="Male" name="gender" label="Male"  checked={this.state.gender == "Male"}/>
                    <CustomInput className="profileCheckBox" onChange={this.changeHandler} type="radio" value="Female" id="Female" name="gender" label="Female" checked={this.state.gender == "Female"} />
                    <CustomInput className="profileCheckBox" onChange={this.changeHandler} type="radio" value="Other" id="Other" name="gender" label="Other" checked={this.state.gender == "Other"} />
                    </div>
                  </FormGroup>
                </Form>
                </Col>
                <Col><Button onClick={this.ProfileInfoChange} type="submit" variant="primary" >
                 Edit profile</Button>
                </Col>
              </Row>
                    <Row style={{ marginTop: "30px" }}>
                        <Col sm="12" md={{ size: 8, offset: 2 }}><Button className='title' onClick={this.toggle} color="primary" style={{ marginBottom: '1rem' }}>About me</Button>
                            <Collapse isOpen={this.state.collapse} onExited={this.onExited} onEntered={this.onEntered}>
                                <Card>
                                    <CardBody>
                                        {this.state.aboutTextToggle ? (
                                            <div>
                                                <p onClick={() => {
                                                    this.setState({ aboutTextToggle: false });
                                                }}>
                                                    {(this.state.about + "").split("\n").map(function (item, index) {
                                                        return (
                                                            <span key={index}>
                                                                {item}
                                                                <br />
                                                            </span>
                                                        )
                                                    })}
                                                </p>
                                            </div>
                                        ) : (
                                            <Input
                                                id="aboutInput"
                                                type="textarea"
                                                style={{ border: "none", padding: "0", height: "500px" }}
                                                value={this.state.about != "Nothing here. Press to edit..." ? this.state.about : ""}
                                                autoFocus
                                                onChange={(event) => {
                                                    this.handleInputHeightChange(event);
                                                    this.setState({ about: event.target.value });
                                                }}
                                                onFocus={(event) => {
                                                    this.handleInputHeightChange(event);
                                                }}
                                                onKeyDown={(event) => {
                                                    if (event.key === 'Enter' && !event.shiftKey || event.key === 'Escape') {
                                                        this.setState({ aboutTextToggle: true });
                                                        event.preventDefault();
                                                        event.stopPropagation();
                                                        BackendService
                                                            .setUserAbout(this.state.about)
                                                            .then(
                                                                (response) => {
                                                                    var currentStorage = JSON.parse(localStorage.getItem('user'));
                                                                    currentStorage.user = response.data.updated_info;
                                                                    localStorage.setItem("user", JSON.stringify(currentStorage));
                                                                },
                                                                error => {
                                                                    console.log(error);
                                                                }
                                                            );
                                                    }
                                                }}
                                                onBlur={(event) => {
                                                    this.setState({ aboutTextToggle: true });
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    BackendService
                                                        .setUserAbout(this.state.about)
                                                        .then(
                                                            (response) => {
                                                                var currentStorage = JSON.parse(localStorage.getItem('user'));
                                                                currentStorage.user = response.data.updated_info;
                                                                localStorage.setItem("user", JSON.stringify(currentStorage));
                                                            },
                                                            error => {
                                                                console.log(error);
                                                            }
                                                        );
                                                }}
                                            />
                                        )}
                                    </CardBody>
                                </Card>
                            </Collapse>
                        </Col>
                    </Row>

                    <Col sm="12" md={{ size: 8, offset: 2 }}>
                        <Row style={{ marginTop: "30px" }}>
                            <Col></Col>
                        </Row>
                        {this.state.favorites != null && this.state.favorites.length > 0 ?
                            <MovieCard data={this.state.favorites} />
                            : ""}

                        <Row style={{ marginTop: "30px" }}>
                            <Col></Col>
                        </Row>
                    </Col>
                </Container>
            </div>
        );
    }
}



export default Profile;

