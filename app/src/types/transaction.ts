export interface Transaction {
  id: string;
  amount: number;
  created_at: string;
  type: "DEPOSIT" | "TRANSFER";
  status: "PENDING" | "CONFIRMED" | "CANCELED";
  source_account_id?: string;
  destination_account_id: string;
}
