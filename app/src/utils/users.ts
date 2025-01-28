import axios from "axios";
import Cookies from "js-cookie";

export async function getUser() {
  const token = Cookies.get("token");
  if (!token) throw new Error("No token");

  const res = await axios.get("/api/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}
