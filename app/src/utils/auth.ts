import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

type LoginUserBody = {
  email: string;
  password: string;
};
export async function login(body: LoginUserBody) {
  const res = await axios.post("/api/login", body);

  return res.data;
}

type RegisterUserBody = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};
export async function register(body: RegisterUserBody) {
  const res = await axios.post("/api/register", body);

  return res.data;
}

type UserToken = {
  user_id?: string;
};
export function isAuthenticated() {
  const token = Cookies.get("token");
  if (!token) return false;
  const decoded = jwtDecode<UserToken>(token);
  return !!decoded.user_id;
}

export function logout() {
  Cookies.remove("token");
  localStorage.clear(); // Optionnel : effacer tout le localStorage
}
