import axiosStatic from 'axios';

/** @description Important! Vue only imports environment variables with a leading VUE_APP_ */
const axios = axiosStatic.create({
    baseURL: process.env.VUE_APP_API_URL,
    timeout: process.env.VUE_APP_TIMEOUT,
});

export default axios;
