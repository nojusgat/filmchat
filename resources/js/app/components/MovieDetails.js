import React, { Component } from "react";
import AppNavbar from "./AppNavbar";
import { Link, useParams, withRouter } from "react-router-dom";

class MovieDetails extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <AppNavbar />
                <h1>ID: {this.props.match.params.id}</h1>
            </div>
        );
    }
}

export default withRouter(MovieDetails);
