import axios from "axios";

class AuthenticationService {
  signin = (email, password) => {
      return axios.post("/api/auth/login", {email, password})
        .then(response => {
          if (response.data.access_token) {
            localStorage.setItem("user", JSON.stringify(response.data));
          }
          return response.data;
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
  }

  signOut() {
    localStorage.removeItem("user");
  }

  register = async(username, email, password, password_confirmation) => {
    return axios.post("/api/auth/register", {
      username,
      email,
      password,
      password_confirmation
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthenticationService();