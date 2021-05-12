import axios from "axios";

class FriendsService {
    befriend = async (otherId) => {
        return axios.post("/api/auth/users/friend", {
            by: "befriend",
            otherId: otherId,
        });
    };

    unfriend = async (otherId) => {
        return axios.post("/api/auth/users/friend", {
            by: "unfriend",
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

    isFriendsWith = async (otherId) => {
        return axios.post("/api/auth/users/friend", {
            by: "isFriend",
            otherId: otherId
        });
    }

    getUsers = async (page, perPage) => {
        return axios.post("api/auth/get/users", {
            page: page,
            perPage: perPage
        });
    };

    getUser = async (id) => {
        return axios.post("/api/auth/get/user", {
            id: id
        });
    };

    searchUsers = async (page, perPage, search) => {
        return axios.post("api/auth/search/users", {
            page: page,
            perPage: perPage,
            search: search
        });
    };

    getFriends = async () => {
        return axios.get("/api/auth/get/friends");
    };

    getIncomingRequests = async () => {
        return axios.get("/api/auth/get/requests");
    };

    getIncomingRequestsCount = async () => {
        return await axios.get("/api/auth/get/requestscount");
    }

    getSentRequests = async () => {
        return axios.get("/api/auth/get/sentrequests");
    };

    getUsersCount = async () => {
        return axios.get("/api/auth/get/userscount");
    }
}

export default new FriendsService();
