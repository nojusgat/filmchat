import React, { Component } from 'react';
import AppNavbar from './AppNavbar';
import {Container, Form, Alert, FormGroup, Input, Row, Col, NavLink, InputGroup, InputGroupAddon, InputGroupText, Button, Nav, NavItem, TabContent, TabPane } from "reactstrap";
import { TabContainer } from 'react-bootstrap';
import classnames from 'classnames';
import { Link, withRouter, NavLink as RRNavLink } from 'react-router-dom';
import './style.css';
import logoFilmchat from '../../logo_l.png';

class About extends Component{

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
          activeTab: '1'
        };
      }

      toggle(tab) {
        if (this.state.activeTab !== tab) {
          this.setState({ activeTab: tab });
        }
      }

    render(){
        return(
            <div>
                <AppNavbar/>
                    <Container className="aboutUs">
                        <h1>About us</h1>
                    <Nav tabs style={{}}>
                        <NavItem>
                            <NavLink
                            className={classnames({ active: this.state.activeTab === '1' })}
                            onClick={() => { this.toggle('1'); }}>
                            About this website
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                            className={classnames({ active: this.state.activeTab === '2' })}
                            onClick={() => { this.toggle('2'); }}>
                            About developers
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                            className={classnames({ active: this.state.activeTab === '3' })}
                            onClick={() => { this.toggle('3'); }}>
                            FAQ
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                            className={classnames({ active: this.state.activeTab === '4' })}
                            onClick={() => { this.toggle('4'); }}>
                            Credits
                            </NavLink>
                        </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                            { this.state.activeTab == 1 ? <div>
                                <Row style={{marginTop:"20px"}}>
                                    <Col sm="12" md={{ size: 5}}>
                                        <h3>A website to find people</h3>
                                        <p>
                                            Filmchat is a website created by 5 students
                                            from <a href="https://en.ktu.edu/" style={{color: 'inherit'}}>Kaunas University of technology</a>.
                                            Filmchat website will let you find other people with similar
                                            movie taste, add them as friends and chat about you favourite movies or TV series.
                                            You can like movies and by that you will find people that
                                            also liked those movies or TV series.
                                            Moreover, here you can create and edit your profile, choose your picture, edit your dicription.
                                            This website is only for learning purposes, no money will be made out of it.
                                        </p>
                                    </Col>
                                </Row>
                                </div> : null }
                        </TabPane>
                        <TabPane tabId="2">
                            { this.state.activeTab == 2 ? <div>
                                <Row style={{marginTop:"20px"}}>
                                    <Col sm="12" md={{ size: 5}}>
                                        <h3>Our awesome developer squad:</h3>
                                        <b>Justinas Runevičius</b>
                                        <p>Front-end development</p>
                                        <b>Nojus Gataveckas</b>
                                        <p>Back-end development</p>
                                        <b>Adomas Grauželis</b>
                                        <p>Front-end development</p>
                                        <b>Domantas Stakionis</b>
                                        <p>Full-stack development</p>
                                        <b>Jokubas Kvederaitis</b>
                                        <p>Front-end development</p>
                                    </Col>
                                </Row>
                                </div> : null }
                        </TabPane>
                        <TabPane tabId="3">
                            { this.state.activeTab == 3 ? <div>
                                <Row style={{marginTop:"20px"}}>
                                    <Col sm="12" md={{ size: 5}}>
                                        <h3>Frequently asked questions (FAQ)</h3>
                                        <h5>How to change my email?</h5>
                                        <p>Go to your <Link to="/profile" style={{color: 'inherit'}}>profile</Link> and click "Change email"</p>
                                        <h5>How to change my password?</h5>
                                        <p>Log out and click "forgot password" and an email should arrive shortly</p>
                                        <h5>How can we ask more questions?</h5>
                                        <p>Email us at staff@filmchat.com</p>
                                        <h5>What framework was used to create this website?</h5>
                                        <p>We used <a href="https://reactjs.org/" style={{color: 'inherit'}}>ReactJS</a> for front-end development and <a href="https://laravel.com/" style={{color: 'inherit'}}>Laravel</a> for back-end development</p>
                                        <h5>What programming languages were used?</h5>
                                        <p>We used JavaScript for front-end development and PhP for back-end development</p>
                                        <h5>Where can we find all the documentation?</h5>
                                        <p>You can find all documentation <a href="https://github.com/nojusgat/filmchat" style={{color: 'inherit'}}>here</a></p>
                                    </Col>
                                </Row>
                                </div> : null }
                        </TabPane>
                        <TabPane tabId="4">
                            { this.state.activeTab == 4 ? <div>
                                <Row style={{marginTop:"20px"}}>
                                    <Col sm="12" md={{ size: 5}}>
                                        <h3>Credits</h3>
                                        <h5>TheMovieDB</h5>
                                        <p>As per TheMovieDB terms of use, every application that uses TheMovieDB data or images is required to properly attribute TMDb as the source. More information about TheMovieDB <a href="https://www.themoviedb.org/">here</a></p>
                                        <img className="tmdbLogo" src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg" alt = "TheMovieDB logo"></img>
                                    </Col>
                                </Row>
                                </div> : null }
                        </TabPane>
                        </TabContent>
                    </Container>
            </div>
        );
    }
}
export default About;
