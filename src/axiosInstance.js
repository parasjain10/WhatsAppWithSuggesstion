import axios from "axios";

const apiKey = "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";

const axiosInstance = axios.create({
  baseURL: "https://api.openai.com/v1/chat/completions",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
  },
});

export default axiosInstance;
