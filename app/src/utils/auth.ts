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

type UpdatePasswordBody = {
  old_password: string;
  new_password: string;
  confirm_password: string;
};
export async function changePassword(body: UpdatePasswordBody) {
  const token = Cookies.get("token");
  if (!token) return false;

  if (body.new_password !== body.confirm_password) {
    throw new Error("Passwords do not match");
  }

  const res = await axios.put(`/api/password`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

type UpdateProfileBody = {
  first_name: string;
  last_name: string;
  email: string;
};
export async function updateProfile(body: UpdateProfileBody) {
  const token = Cookies.get("token");
  if (!token) return false;

  const res = await axios.put(`/api/me`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}
