import React, { Component } from "react";
import {
    Container,
    Row,
    Col,
    Pagination,
    PaginationItem,
    PaginationLink
} from "reactstrap";

class Paginate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pager: {}
        };
    }

    getPager() {
        var totalPages = this.props.totalPages;
        var currentPage = this.props.currentPage;
        var startPage, endPage;

        if (totalPages <= 10) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }

        var pages = [...Array((endPage + 1) - startPage).keys()].map(i => startPage + i);
        return {
            currentPage: currentPage,
            startPage: startPage,
            endPage: endPage,
            pages: pages
        };
    }

    render() {
        var pager = this.getPager();
        if (!pager.pages || pager.pages.length <= 1) {
            return null;
        }

        return (
            <Pagination aria-label="Page navigation example">
                <PaginationItem
                    disabled={
                        this.props
                            .currentPage ==
                            1
                            ? true
                            : false
                    }
                >
                    <PaginationLink
                        name="page"
                        onClick={() => this.props.setPage(1)}
                        first
                    />
                </PaginationItem>
                <PaginationItem
                    disabled={
                        this.props
                            .currentPage ==
                            1
                            ? true
                            : false
                    }
                >
                    <PaginationLink
                        name="page"
                        onClick={() => this.props.setPage(this.props.currentPage - 1)}
                        previous
                    />
                </PaginationItem>
                {pager.pages.map((page, index) =>
                    <PaginationItem key={index} active={pager.currentPage === page ? true : false}>
                        <PaginationLink onClick={() => this.props.setPage(page)}>{page}</PaginationLink>
                    </PaginationItem>
                )}
                <PaginationItem
                    disabled={
                        this.props
                            .currentPage ==
                            this.props
                                .totalPages
                            ? true
                            : false
                    }
                >
                    <PaginationLink
                        name="page"
                        value="1"
                        onClick={() => this.props.setPage(this.props.currentPage + 1)}
                        next
                    />
                </PaginationItem>
                <PaginationItem
                    disabled={
                        this.props
                            .currentPage ==
                            this.props
                                .totalPages
                            ? true
                            : false
                    }
                >
                    <PaginationLink
                        name="page"
                        onClick={() => this.props.setPage(this.props.totalPages)}
                        last
                    />
                </PaginationItem>
            </Pagination>
        );
    }
}

export default Paginate;
