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

  setUserInfo = async(first, last, gender) => {
    return axios.post("/api/auth/change/details", {
      firstname: first,
      lastname: last,
      gender: gender
    });
  }

  getInfoByPopular = async(page) => {
    return axios.post("/api/auth/movie/show", {
      by: "category",
      page: page
    });
  }

  getInfoByGenre = async(cat, page) => {
    return axios.post("/api/auth/movie/show", {
      by: "category",
      param: cat,
      page: page
    });
  }

  getInfoByTitle = async(title, page) => {
    return axios.post("/api/auth/movie/show", {
      by: "title",
      param: title,
      page: page
    });
  }

  getCategories = async() => {
    return axios.get("/api/auth/movie/genres");
  }
}

export default new BackendService();