import axios from "axios";

class AuthenticationService {
  signin = (email, password, remember) => {
      return axios.post("/api/auth/login", {email, password, remember})
        .then(response => {
          if (response.data.access_token) {
            localStorage.setItem("user", JSON.stringify(response.data));
            var tokenexpiration = new Date();
            tokenexpiration.setSeconds(new Date().getSeconds() + parseInt(response.data.expires_in));
            localStorage.setItem('token_expiration_date', tokenexpiration);
          }
          return response.data;
        })
        .catch(err => {
          throw err;
        });
  }

  signOut() {
    localStorage.removeItem("token_expiration_date");
    localStorage.removeItem("user");
  }

  register = async(firstname, lastname, email, password, password_confirmation, gender) => {
    return axios.post("/api/auth/register", {
      firstname,
      lastname,
      email,
      password,
      password_confirmation,
      gender
    });
  }

  verifyEmail = async(verification_code) => {
    return axios.post("/api/auth/complete/emailverify", {
      verification_code
    });
  }

  checkRecoverToken = async(check_token) => {
    return axios.post("/api/auth/complete/lostpassword", {
      check_token
    });
  }

  completeRecoverPassword = async(request_token, password, password_confirmation) => {
    return axios.post("/api/auth/complete/lostpassword", {
      request_token,
      password,
      password_confirmation
    });
  }

  requestRecoverPassword = async(email) => {
    return axios.post("/api/auth/request/lostpassword", {
      email
    });
  }

  getCurrentUser() {
    if(localStorage.getItem('token_expiration_date')) {
      const expire = new Date(localStorage.getItem('token_expiration_date'));
      const now = new Date();
      if(now.getTime() >= expire.getTime()) {
        this.signOut();
        return null;
      }
    }
    return JSON.parse(localStorage.getItem('user'));
  }

  logInGoogle(token){
    return axios.post("/api/auth/google/login", {token}).
    then(response => {
      if (response.data.access_token) {
        localStorage.setItem("user", JSON.stringify(response.data));
        var tokenexpiration = new Date();
        tokenexpiration.setSeconds(new Date().getSeconds() + parseInt(response.data.expires_in));
        localStorage.setItem('token_expiration_date', tokenexpiration);
      }
      return response.data;
    })
    .catch(err => {
      throw err;
    });
  }
}

export default new AuthenticationService();