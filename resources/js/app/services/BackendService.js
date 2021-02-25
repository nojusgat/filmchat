import axios from 'axios';

// Add a request interceptor
axios.interceptors.request.use( config => {
  const user = JSON.parse(localStorage.getItem('user'));

  if(user && user.access_token){
    const token = 'Bearer ' + user.access_token;
    config.headers.Authorization =  token;
  }

  return config;
});

class BackendService {
  /*async getUserBoard() {
    return await axios.get("/api/test/user");
  }*/
}

export default new BackendService();