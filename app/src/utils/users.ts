import axiosInstance from "./axios";
import Cookies from "js-cookie";

export async function getUser() {
  const token = Cookies.get("token");
  if (!token) throw new Error("No token");

  const res = await axiosInstance.get("/me");
  return res.data;
}
