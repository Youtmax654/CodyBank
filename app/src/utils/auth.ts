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

export async function checkPassword(body: { password: string }) {
  const token = Cookies.get("token");
  if (!token) return false;

  const userRes = await axios.get("/api/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const user = userRes.data;

  try {
    const res = await axios.post(`/api/login`, {
      email: user.email,
      password: body.password,
    });
    return res.status === 200;
  } catch (error) {
    return false;
  }
}