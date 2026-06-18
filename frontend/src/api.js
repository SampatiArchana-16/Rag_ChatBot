import axios from "axios";

const API = axios.create({
  baseURL: "https://rag-chatbot-y5t0.onrender.com",
});

export default API;