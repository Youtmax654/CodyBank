import { getAccount } from "@/utils/account";
import { Account } from "@/utils/accounts";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton } from "@mui/material";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import AddAccount from "./addAccount/addAccount";

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [ibanMap, setIbanMap] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const account = await getAccount();
        if (!account || account.length === 0) {
          throw new Error("Aucun compte trouvé");
        }
        setAccounts(account);

        const savedIbans = JSON.parse(localStorage.getItem("ibanMap") || "{}");

        const newIbanMap = { ...savedIbans };
        account.forEach((acc: Account) => {
          if (!newIbanMap[acc.id]) {
            newIbanMap[acc.id] = generateIban();
          }
        });

        localStorage.setItem("ibanMap", JSON.stringify(newIbanMap));
        setIbanMap(newIbanMap);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAccount();
  }, []);

  const generateIban = () => {
    const randomNumbers = Array.from({ length: 24 }, () =>
      Math.floor(Math.random() * 10)
    ).join("");
    return `FR${randomNumbers}`;
  };

  const totalBalance =
    accounts?.reduce((acc, account) => acc + account.balance, 0) || 0;

  return (
    <>
      <div className="flex flex-row justify-between p-10">
        <div>
          <h1 className="text-5xl font-bold">Mes Comptes</h1>
          <p className="text-gray-400">
            Total des actifs : {totalBalance.toLocaleString()} €
          </p>
        </div>
        <div>
          <AddAccount setAccounts={setAccounts} />
        </div>
      </div>
      <div className="flex flex-wrap gap-8 justify-center">
        {accounts &&
          accounts.length > 0 &&
          accounts.map((account) => (
            <div key={account.id} className="w-1/3 h-1/3">
              <div className="border-solid border-2 border-black w-full h-1/3 m-auto p-5">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row justify-between">
                    <p className="font-bold">
                      {account.name ? `${account.name}` : "Chargement..."}
                    </p>
                    <IconButton>
                      <MoreVertIcon color="action" />
                    </IconButton>
                  </div>
                  <div className="flex flex-row justify-between">
                    <p>{account ? `${account?.balance} €` : "Chargement..."}</p>
                    <p>{ibanMap[account.id] || "Chargement..."}</p>
                  </div>
                  <div className="flex flex-row gap-4">
                    <Link to="/transactions">Transactions</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
