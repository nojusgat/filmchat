import axios from "axios";

class FriendsService {
    getUsers = async () => {
        return axios.get("api/auth/users");
    };

    befriend = async (ownId, otherId) => {
        return axios.post("/api/auth/users/friend", {
            by: "befriend",
            ownId: ownId,
            otherId: otherId,
        });
    };
}

export default new FriendsService();
