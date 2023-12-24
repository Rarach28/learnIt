import axios from "axios";

const axiosInstance = axios.create({
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem("jwt_token");
    if (authToken) {
      config.headers.authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Check the response status and remove JWT token if necessary
    console.log("Response:", response.data);
    if (response.data && response.data.status == 401) {
      localStorage.removeItem("jwt_token");
      window.location.href = "/auth/login";
    }
    if (response.data && response.data.status == 403) {
      window.location.href = "/auth/login";
      return;
    }
    if (response.data.data.redirect) {
      console.log("REDIRECTING TO:", "/" + response.data.data.redirect);
      window.location.href = "/" + response.data.data.redirect;
      return;
    }

    return response.data.data;
  },
  (error) => {
    // Handle errors here if needed
    console.error("Axios response error:", error);
    return Promise.reject(error);
  }
);

const axi_url = "https://wellick.cz:4050"; //"http://localhost:4050/";

axiosInstance.getSets = function () {
  return this.get(axi_url + "api/sets"); // replace with your API endpoint
};

axiosInstance.getSetByNumber = function (setNumber) {
  return this.get(axi_url + "api/sets/" + setNumber); // replace with your API endpoint
};

export { axiosInstance as axios, axi_url };
