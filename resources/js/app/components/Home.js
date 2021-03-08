import React, { Component } from 'react';
import AppNavbar from './AppNavbar';
import { Container, Alert, Row, Col } from 'reactstrap';
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button, InputGroup, Input, InputGroupAddon
} from 'reactstrap';

import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Badge } from 'reactstrap';

import {AiOutlineSearch} from 'react-icons/ai';

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
          <Button>View details</Button>
        </CardBody>
      </Card>
    </Col>
  );
  return (
    <Row className="mb-2">{listItems}</Row>
  );
}

function CategoryItem(props) {
  const data = props.data;
  const listItems = data.map((data) =>
    <DropdownItem id={data.id} key={data.id.toString()}>{data.name}</DropdownItem>
  );
  return listItems;
}

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      items: [],
      catItems: [],
      isOpenDrop: false,
      search: "",
      blockName: "Random movies"
    };

    this.toggleDropDown = this.toggleDropDown.bind(this);
  }

  toggleDropDown() {
    this.setState({
      isOpenDrop: !this.state.isOpenDrop
    });
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

    BackendService.getCategories().then(
      response => {
        this.setState({catItems: response.data});
      },
      error => {
        console.log("Error in getCategories: " + error.toString());
      }
    );
  }

  changeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({[nam]: val});
  }

  searchClickHandler = () => {
    BackendService.getInfoByTitle(this.state.search).then(
      response => {
        this.setState({blockName: "Search '"+this.state.search+"':"});
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
          <Row>
            <Col style={{marginTop:"20px"}} md={{ size: 4, offset: 2 }}>
              <InputGroup>
                <Input placeholder="Search something..." name="search" onChange={this.changeHandler} />
                <InputGroupAddon addonType="append">
                  <Button outline color="info" name="search" onClick={this.searchClickHandler}><AiOutlineSearch name="search" /></Button>
                </InputGroupAddon>
              </InputGroup>
            </Col>
            <Col style={{marginTop:"20px"}} md={{ size: 2, offset: 0 }}>
              <Dropdown isOpen={this.state.isOpenDrop} toggle={this.toggleDropDown}>
                <DropdownToggle block caret outline color="info">
                  Categories
                </DropdownToggle>
                <DropdownMenu>
                  <CategoryItem data={this.state.catItems} />
                </DropdownMenu>
              </Dropdown>
            </Col>
            <Col style={{marginTop:"20px"}} md={{ size: 2, offset: 0 }}>
              <Button outline color="info" block>All Movies</Button>
            </Col>
          </Row>
          <Row style={{marginTop:"10px"}}>
            <Col sm="12" md={{ size: 8, offset: 2 }}>
              <h1 style={{marginTop:"20px"}}>{this.state.blockName}</h1>
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