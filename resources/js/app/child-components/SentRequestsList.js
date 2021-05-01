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

class SentRequestsList extends Component {
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

    render() {
        const listItems = this.state.data.map((data) => (
            <ListGroupItem key={data.id}>
                <Container fluid>
                    <Row>
                        <Col>
                            <Link to={"/user/" + data.id.toString()}>
                                {data.firstname} {data.lastname}
                            </Link>
                        </Col>
                        <Col>
                            <Button
                                color="danger"
                                size="sm"
                                onClick={() => {
                                    this.props.onDelete(data.id);
                                }}
                            >
                                Cancel
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

export default SentRequestsList;
