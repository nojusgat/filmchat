import React, { Component } from 'react';
import {
    Card, CardTitle, CardText, CardImg, CardImgOverlay,
    Button, Row, Col
} from 'reactstrap';

import { Link } from 'react-router-dom'

import "../../../css/app.css";

import {AiFillEye, AiOutlineTeam} from 'react-icons/ai';
import FriendsService from '../services/FriendsService';

class UserCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            id: props.id
        }
    }

    sendFriendRequest(ownId, otherId) {
        FriendsService.befriend(ownId, otherId).then(
            response => {

            },
            error => {
                console.log("Error in befriend: " + error.toString());
            }
        );
    }

    render() {
        const listItems = this.state.data.map(function(data) {
            if(this.state.id != data.id) {
                return (
                    <Col md="6" xl="3" sm="12" className="mb-3" key={data.id.toString()}>
                    <Card inverse>
                        <CardImg width="100%" src={"/storage/images/avatars/" + data.avatar} alt={data.firstname + " " + data.lastname} />
                        <CardImgOverlay className="d-flex">
                            <div className="align-self-center mx-auto">
                                <CardTitle tag="h5">{data.firstname} {data.lastname}</CardTitle>
                                <CardText className="description">{data.about}</CardText>
                                <CardText>
                                    <Link to={'/user/' + data.id.toString()}>
                                        <Button><AiFillEye /> View profile</Button>
                                    </Link>
                                        <Button onClick={() => {this.sendFriendRequest(this.state.id, data.id)}} ><AiOutlineTeam/> Add to friends</Button>
                                </CardText>
                            </div>
                        </CardImgOverlay>
                    </Card>
                    </Col>
                );
            }
        }.bind(this)
        );
        console.log(this.state.data);
        return (
            <Row className="mb-2">{listItems}</Row>
        );
    }
}

export default UserCard;
