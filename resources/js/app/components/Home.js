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
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';

import { AiOutlineSearch } from 'react-icons/ai';
import BackendService from '../services/BackendService';

import Paginate from "../child-components/Paginate";

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

    showMovies = (page) => {
        switch (this.state.method) {
            case "popular":
                BackendService.getInfoByPopular(page).then(
                    response => {
                        this.setState({ items: response.data.results, page: response.data.this_page, total_pages: response.data.total_pages, isLoading: false }, this.props.history.push({ state: this.state }));
                    },
                    error => {
                        console.log("Error in getInfoByGenrePage: " + error.toString());
                    }
                );
                break;
            case "search":
                BackendService.getInfoByTitle(this.state.search, page).then(
                    response => {
                        this.setState({ items: response.data.results, page: response.data.this_page, total_pages: response.data.total_pages, isLoading: false }, this.props.history.push({ state: this.state }));
                    },
                    error => {
                        console.log("Error in getInfoByTitle: " + error.toString());
                    }
                );
                break;
            case "category":
                BackendService.getInfoByGenre(this.state.additional, page).then(
                    response => {
                        this.setState({ items: response.data.results, page: response.data.this_page, total_pages: response.data.total_pages, isLoading: false }, this.props.history.push({ state: this.state }));
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

    render() {

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
                                            {this.state.tota_pages != 0
                                                ?
                                                <Paginate
                                                    setPage={this.showMovies}
                                                    totalPages={this.state.total_pages}
                                                    currentPage={this.state.page}
                                                    perPage={this.state.perPage}
                                                />
                                                : ""
                                            }
                                            {this.state.items.length == 0
                                                ? "No items found."
                                                : <MovieCard data={this.state.items} />
                                            }
                                            {this.state.tota_pages != 0
                                                ?
                                                <Paginate
                                                    setPage={this.showMovies}
                                                    totalPages={this.state.total_pages}
                                                    currentPage={this.state.page}
                                                    perPage={this.state.perPage}
                                                />
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
