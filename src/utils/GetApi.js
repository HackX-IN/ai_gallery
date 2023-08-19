import axios from "axios";

const BASE_URL = "Your_Server/generate-message";

const getBardApi = (userMsg) => axios.get(BASE_URL + "?ques=" + userMsg);

export default {
  getBardApi,
};
