import axios from "axios";
import Cookies from "js-cookie";

export type AccountType = "CHECKING" | "SAVINGS";

export type Account = {
  id: string;
  name: string;
  balance: number;
  is_active: boolean;
  is_primary: boolean;
};

export async function getAccounts() {
  const token = Cookies.get("token");
  if (!token) throw new Error("No token");

  const res = await axios.get("/api/accounts", {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

type AccountCreateBody = {
  name: string;
  type: AccountType;
};
export async function addAccount(body: AccountCreateBody) {
  const token = Cookies.get("token");
  if (!token) throw new Error("No token");

  const res = await axios.post("/api/accounts", body, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return res.data;
}