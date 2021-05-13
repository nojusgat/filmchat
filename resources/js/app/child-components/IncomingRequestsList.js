import React, { Component } from "react";
import {
    Button,
    ListGroup,
    ListGroupItem,
    Container,
    Row,
    Col,
} from "reactstrap";
import { Link } from "react-router-dom";
import "../../../css/app.css";
import FriendsService from "../services/FriendsService";

class IncomingRequestsList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
        };
    }

    componentDidMount() {
        if (this.state.data.length == 0) {
            this.setState({
                data: this.props.data,
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            data: nextProps.data,
        });
    }

    // acceptRequest(otherId) {
    //     FriendsService.acceptRequest(otherId).then(
    //         (response) => {
    //             this.setState({
    //                 data: this.props.data.filter((item) => item.id !== otherId),
    //             });
    //         },
    //         (error) => {
    //             console.log("Error in acceptRequest: " + error.toString());
    //         }
    //     );
    // }

    // denyRequest(otherId) {
    //     FriendsService.denyRequest(otherId).then(
    //         (response) => {
    //             this.setState({
    //                 data: this.props.data.filter((item) => item.id !== otherId),
    //             });
    //         },
    //         (error) => {
    //             console.log("Error in denyRequest: " + error.toString());
    //         }
    //     );
    // }

    render() {
        const listItems = this.state.data.map((data) => (
            <ListGroupItem key={data.id}>
                <Container fluid>
                    <Row>
                        <Col>
                            <Link style={{color:"black"}} to={"/user/" + data.id.toString()}>
                                {data.firstname} {data.lastname}
                            </Link>
                        </Col>

                        <Col>
                            <Button
                                color="success"
                                size="sm"
                                onClick={() => {
                                    this.props.onAcceptReq(data.id);
                                }}
                            >
                                Accept
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                color="danger"
                                size="sm"
                                onClick={() => {
                                    this.props.onDenyReq(data.id);
                                }}
                            >
                                Deny
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </ListGroupItem>
        ));
        return (
            <div>
                <ListGroup>{listItems}</ListGroup>
            </div>
        );
    }
}

export default IncomingRequestsList;
