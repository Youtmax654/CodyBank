import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("token");
if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;