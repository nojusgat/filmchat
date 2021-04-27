import React, { Component } from 'react';
import {
    Card, CardTitle, CardText, CardImg, CardImgOverlay,
    Button, Row, Col
} from 'reactstrap';

import { Link } from 'react-router-dom'

import "../../../css/app.css";

import {AiFillEye} from 'react-icons/ai';

import FavoriteButton from './FavoriteButton';

class MovieCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: []
        }
    }

    componentWillMount() {
        this.setState({
            data: this.props.data
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            data: nextProps.data
        });
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
                            <FavoriteButton movie_id={data.id} favorited={data.added_to_favorites} />
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