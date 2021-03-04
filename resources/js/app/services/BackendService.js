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
  getInfoById = async(id) => {
    return axios.post("/api/auth/movie/show", {
      by: "id",
      param: id
    });
  }

  getInfoByTitle = async(title) => {
    return axios.post("/api/auth/movie/show", {
      by: "title",
      param: title
    });
  }
}

export default new BackendService();