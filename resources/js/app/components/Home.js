import React, { Component } from 'react';
import AppNavbar from './AppNavbar';
import { Container, Alert, Row, Col } from 'reactstrap';
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button
} from 'reactstrap';

import AuthenticationService from '../services/AuthenticationService';

import BackendService from '../services/BackendService';

function MovieCard(props) {
  const data = props.data;
  const listItems = data.map((data) =>
    <Col md="6" xl="3" sm="12" className="mb-3" key={data.id.toString()}>
      <Card>
        <CardImg top src={data.poster} alt="poster" />
        <CardBody>
          <CardTitle tag="h5">{data.title}</CardTitle>
          <Button>Button</Button>
        </CardBody>
      </Card>
    </Col>
  );
  return (
    <Row className="mb-2">{listItems}</Row>
  );
}

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      items: []
    };
  }

  componentDidMount() {
    BackendService.getInfoByTitle("mummy").then(
      response => {
        this.setState({items: response.data});
      },
      error => {
        console.log("Error in getInfoByTitle: " + error.toString());
      }
    );
  }

  render() {
    const user = AuthenticationService.getCurrentUser();

    // login
    if (user && user.access_token) {
      return (
        <div>
          <AppNavbar/>
          <Container fluid>
          <Row style={{marginTop:"20px"}}>
            <Col sm="12" md={{ size: 8, offset: 2 }}>
              <div style={{marginTop:"20px"}}>
                <MovieCard data={this.state.items} />
              </div>
            </Col>
          </Row>
          </Container>
        </div>
      );
    } else { // not login
      this.props.history.push('/');
      window.location.reload();
      return (
        <div>
          <AppNavbar/>
        </div>
      );
    }
  }
}

export default Home;