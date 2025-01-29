import { chartOptions, financialData, months } from "@/utils/chartConfig";
import { Line } from "react-chartjs-2";

export default function ExpensesChart() {
  const expensesData = {
    labels: months,
    datasets: [
      {
        label: "Dépenses (€)",
        data: financialData.map((d) => d.expenses),
        borderColor: "#ef4444",
        backgroundColor: "#ef444480",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      <h2 className="text-xl font-semibold mb-4">Sorties</h2>
      <div className="h-64">
        <Line data={expensesData} options={chartOptions} />
      </div>
    </div>
  );
}
