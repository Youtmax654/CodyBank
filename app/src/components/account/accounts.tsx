import { getAccounts } from "@/utils/accounts";
import { Account } from "@/utils/accounts";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import AddAccount from "./addAccount/addAccount";
import DeleteAccount from "./deleteAccount/deleteAccount";

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [ibanMap, setIbanMap] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const account = await getAccounts();
        console.log("Comptes récupérés :", account);
        if (!account || account.length === 0) {
          throw new Error("Aucun compte trouvé");
        }
  
        setAccounts(account); // Garde tous les comptes, pas besoin de filtrer
  
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

  const handleAccountDeleted = (accountIdToRemove: string) => {
    // Remove the deleted account from the accounts list
    setAccounts(prevAccounts =>
      prevAccounts ? prevAccounts.filter(account => account.id !== accountIdToRemove) : null
    );
  };

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
          accounts.filter((account) => account.is_active).map((account) => (
            <div key={account.id} className="w-1/3 h-1/3">
              <div className="border-solid border-2 border-black w-full h-1/3 m-auto p-5">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row justify-between">
                    <p className="font-bold">
                      {account.name ? `${account.name}` : "Chargement..."}
                    </p>
                    {!account.is_primary ? (
                      <DeleteAccount
                        accountId={account.id}
                        onAccountDeleted={() => handleAccountDeleted(account.id)}
                      />
                    ) : (
                      <></>
                    )}
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
