import BalanceChart from "@/components/dashboard/BalanceChart";
import CashFlowChart from "@/components/dashboard/CashFlowChart";
import ExpensesChart from "@/components/dashboard/ExpensesChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import { Account, getAccounts } from "@/utils/accounts";
import {
  convertTransactionsToFinancialData,
  FinancialData,
} from "@/utils/chartConfig";
import { getTransactionsByAccountId } from "@/utils/transactions";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountId, setAccountId] = useState("");
  const [financialData, setFinancialData] = useState<FinancialData[]>([]);

  useEffect(() => {
    getAccounts().then((accounts) => {
      if (accounts.length > 0) {
        setAccounts(accounts);
        setAccountId(accounts[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (accountId) {
      getTransactionsByAccountId(accountId).then((transactions) => {
        setFinancialData(convertTransactionsToFinancialData(transactions));
      });
    }
  }, [accountId]);

  const handleChange = (event: SelectChangeEvent) => {
    setAccountId(event.target.value);
  };

  return (
    <div className="flex flex-col h-screen p-4 gap-6 flex-1 overflow-y-auto">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>
      <Select value={accountId} onChange={handleChange} className="w-fit">
        {accounts.map((account) => (
          <MenuItem key={account.id} value={account.id}>
            {account.name}
          </MenuItem>
        ))}
      </Select>
      <div className="flex flex-row gap-6 w-full">
        <BalanceChart financialData={financialData} />
        <RevenueChart financialData={financialData} />
        <ExpensesChart financialData={financialData} />
      </div>
      <CashFlowChart financialData={financialData} />
    </div>
  );
}
