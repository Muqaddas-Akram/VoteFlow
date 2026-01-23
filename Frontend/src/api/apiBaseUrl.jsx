import axios from 'axios';
const baseURL = 'http://localhost:8000';
const AppInstance = axios.create({
    baseURL, 
});
AppInstance.interceptors.request.use(
    async (req) => {
        const token = localStorage.getItem("_token");
        req.headers["accept"] = "application/json";
        if (token) {
           req.headers.accessToken = token;
        }
        console.log("Request headers:", req.headers.accessToken);
        return req;
    },
    (error) => {
        console.log("Error axios interceptor", error);
        throw error;
    }
);
AppInstance.interceptors.response.use(
    (response) => {
      console.log("Response of axios : ", response);
      return response;
    },
    (error) => {
      console.log("Error axios interceptor", error.response);
      throw error;
    }
  );
export default AppInstance;
