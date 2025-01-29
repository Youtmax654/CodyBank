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

const generateFinancialData = () => {
  return Array.from({ length: 12 }, () => ({
    revenue: Math.floor(Math.random() * 9000 + 1000),
    expenses: Math.floor(Math.random() * 8000 + 500),
    balance: Math.floor(Math.random() * 10000 + 2000),
  }));
};

export const financialData = generateFinancialData();
