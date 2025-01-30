import axios from "axios";

export async function getTransactionsByAccountId(accountId: string) {
  const res = await axios.get(`/api/transactions`, {
    params: {
      account_id: accountId,
    },
    // headers: {
    //   Authorization: `Bearer ${token}`,
    // },
  });

  return res.data;
}
