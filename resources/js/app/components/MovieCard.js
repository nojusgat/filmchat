import React, { Component } from 'react';
import {
    Card, CardTitle, CardText, CardImg, CardImgOverlay,
    Button, Row, Col
} from 'reactstrap';

import { Link } from 'react-router-dom'

import "../../../css/app.css";

import {AiFillEye} from 'react-icons/ai';

class MovieCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.data
        }
    }

    render() {
        const listItems = this.state.data.map((data) =>
            <Col md="6" xl="3" sm="12" className="mb-3" key={data.id.toString()}>
            <Card inverse>
                <CardImg width="100%" src={data.poster} alt={data.title + " poster"} />
                <CardImgOverlay className="d-flex">
                    <div className="align-self-center mx-auto">
                        <CardTitle tag="h5">{data.title}{data.release != null ? <small> {data.release}</small> : "" }</CardTitle>
                        <CardText className="description">{data.overview}</CardText>
                        <CardText>
                            <Link to={'/movie/' + data.id.toString()}>
                                <Button><AiFillEye /> View details</Button>
                            </Link>
                        </CardText>
                    </div>
                </CardImgOverlay>
            </Card>

            </Col>
        );
        return (
            <Row className="mb-2">{listItems}</Row>
        );
    }
}

export default MovieCard;