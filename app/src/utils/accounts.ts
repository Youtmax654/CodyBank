import axios from "axios";
import Cookies from "js-cookie";

export type Account = {
  id: string;
  name: string;
  balance: number;
};

export async function getAccounts() {
  const token = Cookies.get("token");
  if (!token) throw new Error("No token");

  const res = await axios.get("/api/accounts", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}
