import axios from "axios";

class ChatService {
    sendMessage = async (recipientId, message) => {
        return axios.post("/api/auth/messages/send", {
            recipientId: recipientId,
            message: message
        });
    }

    getMessages = async (recipientId) => {
        return axios.post("/api/auth/messages/get", {
            recipientId: recipientId
        });
    }
}

export default new ChatService();
