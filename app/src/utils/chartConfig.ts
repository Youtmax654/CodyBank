type Transaction = {
  id: string;
  amount: number;
  created_at: Date;
  type: string;
  status: string;
  source_account_id: string | null;
  destination_account_id: string | null;
};

export type FinancialData = {
  revenue: number;
  expenses: number;
  balance: number;
};

export const months = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Jun",
  "Jul",
  "Aoû",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

export const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top" as const },
    title: { display: false },
  },
  scales: {
    y: { beginAtZero: true },
  },
};

export const convertTransactionsToFinancialData = (
  transactions: Transaction[]
) => {
  const monthSet = new Set<number>();

  transactions.forEach((transaction) => {
    const month = new Date(transaction.created_at).getMonth();
    monthSet.add(month);
  });

  const financialData: {
    revenue: number;
    expenses: number;
    balance: number;
  }[] = Array.from({ length: monthSet.size }, () => ({
    revenue: 0,
    expenses: 0,
    balance: 0,
  }));

  transactions.forEach((transaction) => {
    const month = new Date(transaction.created_at).getMonth();
    if (month < financialData.length) {
      // Check if month index is valid
      switch (transaction.type) {
        case "DEPOSIT":
          financialData[month].revenue += transaction.amount;
          financialData[month].balance += transaction.amount;
          console.log("deposit", month, financialData[month]);
          break;
        case "TRANSFER":
          financialData[month].expenses += transaction.amount;
          financialData[month].balance -= transaction.amount;
          console.log("withdrawal", month, financialData[month]);
          break;
      }
    }
  });

  return financialData;
};
