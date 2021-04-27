import axios from "axios";

class FriendsService {
    befriend = async (otherId) => {
        return axios.post("/api/auth/users/friend", {
            by: "befriend",
            otherId: otherId,
        });
    };

    acceptRequest = async (otherId) => {
        return axios.post("/api/auth/users/friend", {
            by: "accept",
            otherId: otherId,
        });
    };

    denyRequest = async (otherId) => {
        return axios.post("/api/auth/users/friend", {
            by: "deny",
            otherId: otherId,
        });
    };

    cancelRequest = async (otherId) => {
        return axios.post("/api/auth/users/friend", {
            by: "cancel",
            otherId: otherId,
        });
    };

    getUsers = async () => {
        return axios.get("api/auth/users");
    };

    getIncomingRequests = async () => {
        return axios.get("/api/auth/users/requests");
    };

    getSentRequests = async () => {
        return axios.get("/api/auth/users/sentrequests");
    };
}

export default new FriendsService();
