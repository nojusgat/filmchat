import React, { Component } from "react";
import AppNavbar from "../child-components/AppNavbar";
import {
    Button,
    Container,
    Row,
    Col,
    InputGroup,
    InputGroupAddon,
    Input,
    Spinner,
} from "reactstrap";

import { AiOutlineSend } from "react-icons/ai";

import ChatService from "../services/ChatService";

class Chat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: JSON.parse(localStorage.user).user,
            recipientId: this.props.match.params.id,
            recipient: [],
            allMessages: [],
            message: "",
            isChatLoading: true,
        };

        this.changeHandler.bind(this);
        this.keyDownHandler.bind(this);
        this.sendHandler.bind(this);
    }

    componentDidMount() {
        this.getMessages();
        this.listen(this.state.user.id);
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView();
    };

    getMessages() {
        ChatService.getMessages(this.state.recipientId).then(
            (response) => {
                this.setState(
                    {
                        allMessages: response.data.messages,
                        isChatLoading: false,
                        recipient: response.data.recipient,
                    },
                    () => {
                        this.scrollToBottom();
                    }
                );
            },
            (error) => {
                console.log("Error in getMessages: " + error.toString());
            }
        );
    }

    getLatestMessage() {
        ChatService.getLatestMessage(this.state.recipientId).then(
            (response) => {
                // this.setState({});
                console.log(response.data);
            },
            (error) => {
                console.log("Error in getLatestMessage: " + error.toString());
            }
        );
    }

    sendMessage() {
        ChatService.sendMessage(
            this.state.recipientId,
            this.state.message
        ).then(
            (response) => {},
            (error) => {
                console.log("Error in sendMessage: " + error.toString());
            }
        );
    }

    changeHandler = (e) => {
        this.setState({ message: e.target.value });
    };

    keyDownHandler = (e) => {
        if (e.key === "Enter") {
            this.sendHandler();
        }
    };

    sendHandler = () => {
        this.setState({ message: "" });
        if (this.state.message) {
            this.sendMessage();
            this.setState(
                {
                    allMessages: [
                        ...this.state.allMessages,
                        ...[
                            {
                                sender: {
                                    firstname: this.state.user.firstname,
                                    lastname: this.state.user.lastname,
                                },
                                updated_at: new Date().toLocaleString(),
                                body: this.state.message,
                            },
                        ],
                    ],
                },
                () => {
                    this.scrollToBottom();
                }
            );
        }
    };

    messageTime = (date) => {
        const hours = Intl.NumberFormat("default", {
            minimumIntegerDigits: 2,
        }).format(date.getHours());
        const minutes = Intl.NumberFormat("default", {
            minimumIntegerDigits: 2,
        }).format(date.getMinutes());
        return `${hours}:${minutes}`;
    };

    messageDate = (date) => {
        var now = new Date();
        if (date.getDay() === now.getDay()) {
            return "Today";
        } else if (date.getDay() === now.getDay() - 1) {
            return "Yesterday";
        } else {
            const month = Intl.DateTimeFormat("default", {
                month: "long",
            }).format(date);
            return `${month} ${date.getDay()}`;
        }
    };

    listen(userId) {
        window.Echo.private("user-channel." + userId).listen(
            "MessageSent",
            (e) => {
                this.setState(
                    {
                        allMessages: [
                            ...this.state.allMessages,
                            ...[
                                {
                                    sender: e.other,
                                    updated_at: e.message.updated_at,
                                    body: e.message.body,
                                },
                            ],
                        ],
                    },
                    () => {
                        this.scrollToBottom();
                    }
                );
            }
        );
    }

    render() {
        const id = this.state.user.id;
        const displayMessages = this.state.allMessages.map((data, index) => {
            const date = new Date(data.updated_at);
            if (data.sender_id === id || data.sender.id === undefined) {
                return (
                    <div key={index} className="sent-message">
                        <div className="sent-body">
                            <p>{data.body}</p>
                            <span className="message-footer">
                                {this.messageTime(date)} |{" "}
                                {this.messageDate(date)}
                            </span>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div key={index} className="received-message">
                        <div className="received-image-container rect-img-container">
                            <img
                                className="received-image rect-img"
                                src={
                                    "/storage/images/avatars/" +
                                    data.sender.avatar
                                }
                                alt={
                                    data.sender.firstname +
                                    " " +
                                    data.sender.lastname
                                }
                            />
                        </div>
                        <div className="received-body">
                            <p>{data.body}</p>
                            <span className="message-footer">
                                {this.messageTime(date)} |{" "}
                                {this.messageDate(date)}
                            </span>
                        </div>
                    </div>
                );
            }
        });
        // Main return
        return (
            <div>
                <AppNavbar />
                <Container className="message-container">
                    {(() => {
                        if (this.state.isChatLoading) {
                            return (
                                <div
                                    style={{ marginTop: "20px" }}
                                    className="spinner"
                                >
                                    <Spinner
                                        color="secondary"
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                        }}
                                    />
                                </div>
                            );
                        } else {
                            return (
                                <Row>
                                    <Col xs="4" className="latest-main">
                                        <Row>
                                            <h4>latest chats</h4>
                                        </Row>
                                        <Row className="latest-chats">
                                            <div className="latest-chat">
                                                <p>asdasd</p>
                                            </div>
                                            <div className="latest-chat">
                                                <p>asdasd</p>
                                            </div>
                                            <div className="latest-chat">
                                                <p>asdasd</p>
                                            </div>
                                        </Row>
                                    </Col>
                                    <Col xs="8" className="messages-main">
                                        <div className="messages-main-header">
                                            <div
                                                className="received-image-container rect-img-container"
                                                style={{
                                                    verticalAlign: "middle",
                                                    position: "relative",
                                                    right: "5px",
                                                }}
                                            >
                                                <img
                                                    className="received-image rect-img"
                                                    src={
                                                        "/storage/images/avatars/" +
                                                        this.state.recipient
                                                            .avatar
                                                    }
                                                    alt={
                                                        this.state.recipient
                                                            .firstname +
                                                        " " +
                                                        this.state.recipient
                                                            .lastname
                                                    }
                                                />
                                            </div>
                                            <p className="messages-main-header-p">
                                                {this.state.recipient.firstname}{" "}
                                                {this.state.recipient.lastname}
                                            </p>
                                        </div>
                                        <div className="messages">
                                            {displayMessages}
                                            <div
                                                ref={(el) => {
                                                    this.messagesEnd = el;
                                                }}
                                            ></div>
                                        </div>
                                        <Row className="message-input">
                                            <InputGroup>
                                                <Input
                                                    placeholder="Type a message..."
                                                    value={this.state.message}
                                                    onChange={
                                                        this.changeHandler
                                                    }
                                                    onKeyDown={
                                                        this.keyDownHandler
                                                    }
                                                ></Input>
                                                <InputGroupAddon>
                                                    <Button
                                                        outline
                                                        onClick={
                                                            this.sendHandler
                                                        }
                                                    >
                                                        <AiOutlineSend />
                                                    </Button>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </Row>
                                    </Col>
                                </Row>
                            );
                        }
                    })()}
                </Container>
            </div>
        );
    }
}

export default Chat;
