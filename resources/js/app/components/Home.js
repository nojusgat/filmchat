import React, { Component } from 'react';
import AppNavbar from './AppNavbar';
import { Container, Alert, Row, Col } from 'reactstrap';
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button, InputGroup, Input, InputGroupAddon
} from 'reactstrap';

import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Badge } from 'reactstrap';

import {AiOutlineSearch} from 'react-icons/ai';

import AuthenticationService from '../services/AuthenticationService';

import BackendService from '../services/BackendService';

function MovieCard(props) {
  const data = props.data;
  const listItems = data.map((data) =>
    <Col md="6" xl="3" sm="12" className="mb-3" key={data.id.toString()}>
      <Card>
        <CardImg top src={data.poster} alt={data.title+" Poster"} />
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

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      items: [],
      page: 0,
      total_pages: 0,
      catItems: [],
      isOpenDrop: false,
      search: "",
      additional: null,
      method: "popular",
      blockName: "Popular movies"
    };

    this.toggleDropDown = this.toggleDropDown.bind(this);
  }

  testFunction() {
    console.log("test");
  }

  toggleDropDown() {
    this.setState({
      isOpenDrop: !this.state.isOpenDrop
    });
  }

  showPopularMovies = () => {
    console.log("test?");
    this.setState({search: "", method: "popular", blockName: "Popular movies"});
    BackendService.getInfoByPopular(1).then(
      response => {
        this.setState({items: response.data.results, page: response.data.this_page, total_pages: response.data.total_pages});
      },
      error => {
        console.log("Error in getInfoByTitle: " + error.toString());
      }
    );
  }

  componentDidMount() {
    this.showPopularMovies();

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
    BackendService.getInfoByTitle(this.state.search, 1).then(
      response => {
        this.setState({blockName: "Search '"+this.state.search+"':"});
        this.setState({items: response.data.results, page: response.data.this_page, total_pages: response.data.total_pages, method: "search"});
      },
      error => {
        console.log("Error in getInfoByTitle: " + error.toString());
      }
    );
  }

  categoryClickHandler = (event) => {
    let id = event.target.id;
    let name = event.target.name;
    this.setState({additional: id, method: "category", blockName: name+" Category"});
    BackendService.getInfoByGenre(id, 1).then(
      response => {
        this.setState({items: response.data.results, page: response.data.this_page, total_pages: response.data.total_pages});
      },
      error => {
        console.log("Error in getInfoByGenrePage: " + error.toString());
      }
    );
  }

  pageHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({[nam]: val});

    switch(this.state.method) {
      case "category":
        BackendService.getInfoByGenre(this.state.additional, val).then(
          response => {
            this.setState({items: response.data.results, page: response.data.this_page, total_pages: response.data.total_pages});
          },
          error => {
            console.log("Error in getInfoByGenrePage: " + error.toString());
          }
        );
        break;
      case "search":
        BackendService.getInfoByTitle(this.state.search, val).then(
          response => {
            this.setState({items: response.data.results, page: response.data.this_page, total_pages: response.data.total_pages});
          },
          error => {
            console.log("Error in getInfoByTitle: " + error.toString());
          }
        );
        break;
      case "popular":
        BackendService.getInfoByPopular(val).then(
          response => {
            this.setState({items: response.data.results, page: response.data.this_page, total_pages: response.data.total_pages});
          },
          error => {
            console.log("Error in getInfoByGenrePage: " + error.toString());
          }
        );
        break;
      default:
        console.log("error");
        break;
    }
  }

  render() {
    const user = AuthenticationService.getCurrentUser();

    var page_items = [];
    var currentPage = this.state.page;
    var totalPages = this.state.total_pages;
    var firstPageDisabled = false;
    var lastPageDisabled = false;

    if(currentPage == 1)
      var firstPageDisabled = true;

    if(currentPage == totalPages)
      var lastPageDisabled = true;

    var startPage = 0, endPage = 0, showPages = 7;
    if (Number(totalPages) <= Number(showPages)) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = Number(totalPages);
    } else {
      // more than 10 total pages so calculate start and end pages
      if (Number(currentPage) <= (Math.floor(showPages / 2) + 1)) {
        startPage = 1;
        endPage = Number(showPages);
      } else if (Number(currentPage) + (Math.floor(showPages / 2) - 1) >= totalPages) {
        startPage = Number(totalPages) - (showPages - 1);
        endPage = Number(totalPages);
      } else {
        startPage = Number(currentPage) - Math.floor(showPages / 2);
        endPage = Number(currentPage) + Math.floor(showPages / 2);
      }
    }

    for (var i = startPage; i <= endPage; i++) {
      var active_status = false;
      if(i == this.state.page) {
        active_status = true;
      }
      page_items.push(
      <PaginationItem active={active_status}>
        <PaginationLink name="page" value={i} onClick={this.pageHandler}>
          {i}
        </PaginationLink>
      </PaginationItem>
      );
    }

    const cat_items = this.state.catItems.map((data) =>
      <DropdownItem id={data.id} key={data.id.toString()} name={data.name} onClick={this.categoryClickHandler}>{data.name}</DropdownItem>
    );

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
                  {cat_items}
                </DropdownMenu>
              </Dropdown>
            </Col>
            <Col style={{marginTop:"20px"}} md={{ size: 2, offset: 0 }}>
              <Button outline color="info" block onClick={this.showPopularMovies}>Popular movies</Button>
            </Col>
          </Row>
          <Row style={{marginTop:"10px"}}>
            <Col sm="12" md={{ size: 8, offset: 2 }}>
              <h1 style={{marginTop:"20px"}}>{this.state.blockName}</h1>
              <div style={{marginTop:"20px"}}>
                <MovieCard data={this.state.items} />
                <Pagination aria-label="Page navigation example">
                  <PaginationItem disabled={firstPageDisabled}>
                    <PaginationLink name="page" value="1" onClick={this.pageHandler} first />
                  </PaginationItem>
                  {page_items}
                  <PaginationItem disabled={lastPageDisabled}>
                    <PaginationLink name="page" value={totalPages} onClick={this.pageHandler} last />
                  </PaginationItem>
                </Pagination>
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