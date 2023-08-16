import axios from "axios";

const BASE_URL = "http://192.168.1.7:3000/generate-message"; //Replace with System PC IP address

const getBardApi = (userMsg) => axios.get(BASE_URL + "?ques=" + userMsg);

export default {
  getBardApi,
};
