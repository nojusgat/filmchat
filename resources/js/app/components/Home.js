import React, { Component } from 'react';
import AppNavbar from '../child-components/AppNavbar';
import MovieCard from '../child-components/MovieCard';
import {
    Container,
    Row,
    Col,
    Spinner,
    Button,
    InputGroup,
    Input,
    InputGroupAddon,
    Pagination,
    PaginationItem,
    PaginationLink,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';

import { AiOutlineSearch } from 'react-icons/ai';
import BackendService from '../services/BackendService';

class Home extends Component {

    constructor(props) {
        super(props);

        this.state = this.props.location.state || {
            items: [],
            page: 0,
            total_pages: 0,
            catItems: [],
            isOpenDrop: false,
            search: "",
            additional: null,
            method: "popular",
            blockName: "Popular movies",
            isLoading: true
        };

        this.toggleDropDown = this.toggleDropDown.bind(this);
    }

    toggleDropDown() {
        this.setState({
            isOpenDrop: !this.state.isOpenDrop
        });
    }

    showPopularMovies = () => {
        this.setState({ search: "", method: "popular", blockName: "Popular movies", isLoading: true });
        BackendService.getInfoByPopular(1).then(
            response => {
                this.setState({ items: response.data.results, page: response.data.this_page, total_pages: response.data.total_pages, isLoading: false });
                this.props.history.push({ state: this.state });
            },
            error => {
                console.log("Error in getInfoByTitle: " + error.toString());
            }
        );
    }

    componentDidMount() {
        if (this.state.items.length == 0) {
            this.showPopularMovies();
        }

        if (this.state.catItems.length == 0) {
            BackendService.getCategories().then(
                response => {
                    this.setState({ catItems: response.data });
                },
                error => {
                    console.log("Error in getCategories: " + error.toString());
                }
            );
        }
    }

    changeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
    }

    searchClickHandler = () => {
        this.setState({ method: "search", blockName: "Search '" + this.state.search + "':", isLoading: true });
        BackendService.getInfoByTitle(this.state.search, 1).then(
            response => {
                this.setState({
                    items: response.data.results,
                    page: response.data.this_page,
                    total_pages: response.data.total_pages,
                    isLoading: false
                });
                this.props.history.push({ state: this.state });
            },
            error => {
                console.log("Error in getInfoByTitle: " + error.toString());
            }
        );
    }

    categoryClickHandler = (event) => {
        let id = event.target.id;
        let name = event.target.name;
        this.setState({ additional: id, method: "category", blockName: name + " Category", isLoading: true });
        BackendService.getInfoByGenre(id, 1).then(
            response => {
                this.setState({ items: response.data.results, page: response.data.this_page, total_pages: response.data.total_pages, isLoading: false });
                this.props.history.push({ state: this.state });
            },
            error => {
                console.log("Error in getInfoByGenrePage: " + error.toString());
            }
        );
    }

    pageHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val, isLoading: true });

        window.scrollTo(0, 0);

        switch (this.state.method) {
            case "category":
                BackendService.getInfoByGenre(this.state.additional, val).then(
                    response => {
                        this.setState({ items: response.data.results, page: response.data.this_page, total_pages: response.data.total_pages, isLoading: false });
                        this.props.history.push({ state: this.state });
                    },
                    error => {
                        console.log("Error in getInfoByGenrePage: " + error.toString());
                    }
                );
                break;
            case "search":
                BackendService.getInfoByTitle(this.state.search, val).then(
                    response => {
                        this.setState({ items: response.data.results, page: response.data.this_page, total_pages: response.data.total_pages, isLoading: false });
                        this.props.history.push({ state: this.state });
                    },
                    error => {
                        console.log("Error in getInfoByTitle: " + error.toString());
                    }
                );
                break;
            case "popular":
                BackendService.getInfoByPopular(val).then(
                    response => {
                        this.setState({ items: response.data.results, page: response.data.this_page, total_pages: response.data.total_pages, isLoading: false });
                        this.props.history.push({ state: this.state });
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
        var page_items = [];
        var currentPage = this.state.page;
        var totalPages = this.state.total_pages;
        var firstPageDisabled = false;
        var lastPageDisabled = false;

        if (currentPage == 1)
            var firstPageDisabled = true;

        if (currentPage == totalPages)
            var lastPageDisabled = true;

        var startPage = 0, endPage = 0, showPages = 7;
        if (Number(totalPages) <= Number(showPages)) {
            startPage = 1;
            endPage = Number(totalPages);
        } else {
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
            if (i == this.state.page) {
                active_status = true;
            }
            page_items.push(
                <PaginationItem key={i.toString()} active={active_status}>
                    <PaginationLink name="page" value={i} onClick={this.pageHandler}>
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        const cat_items = this.state.catItems.map((data) =>
            <DropdownItem id={data.id} key={data.id.toString()} name={data.name} onClick={this.categoryClickHandler}>{data.name}</DropdownItem>
        );


        return (
            <div className="backgroundImageHome">
                <AppNavbar />
                <Container className="home" fluid>
                    <Row>
                        <Col style={{ marginTop: "20px" }} md={{ size: 4, offset: 2 }}>
                            <InputGroup>
                                <Input placeholder="Search something..." name="search" onChange={this.changeHandler} />
                                <InputGroupAddon addonType="append">
                                    <Button outline color="info" name="search" onClick={this.searchClickHandler}><AiOutlineSearch name="search" /></Button>
                                </InputGroupAddon>
                            </InputGroup>
                        </Col>
                        <Col style={{ marginTop: "20px" }} md={{ size: 2, offset: 0 }}>
                            <Dropdown isOpen={this.state.isOpenDrop} toggle={this.toggleDropDown}>
                                <DropdownToggle className="profileDropdown" block caret outline color="info">
                                    Categories
                </DropdownToggle>
                                <DropdownMenu>
                                    {cat_items}
                                </DropdownMenu>
                            </Dropdown>
                        </Col>
                        <Col style={{ marginTop: "20px" }} md={{ size: 2, offset: 0 }}>
                            <Button outline color="info" block onClick={this.showPopularMovies}>Popular movies</Button>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "10px" }}>
                        <Col sm="12" md={{ size: 8, offset: 2 }}>
                            <h1 style={{ marginTop: "20px" }}>{this.state.blockName}</h1>
                            {(() => {
                                if (this.state.isLoading) {
                                    return (
                                        <div style={{ marginTop: "20px" }} className="spinner">
                                            <Spinner color="secondary" style={{ width: "100px", height: "100px" }} />
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div style={{ marginTop: "20px" }}>
                                            {this.state.items.length == 0
                                                ? "No items found."
                                                : <MovieCard data={this.state.items} />
                                            }
                                            {totalPages != 0
                                                ? <Pagination aria-label="Page navigation example">
                                                    <PaginationItem disabled={firstPageDisabled}>
                                                        <PaginationLink name="page" value="1" onClick={this.pageHandler} first />
                                                    </PaginationItem>
                                                    {page_items}
                                                    <PaginationItem disabled={lastPageDisabled}>
                                                        <PaginationLink name="page" value={totalPages} onClick={this.pageHandler} last />
                                                    </PaginationItem>
                                                </Pagination>
                                                : ""
                                            }
                                        </div>
                                    )
                                }
                            })()}
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Home;
