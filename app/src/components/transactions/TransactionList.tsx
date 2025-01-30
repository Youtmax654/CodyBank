import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Transaction } from "@/types/transaction";
import { Account } from "@/types/account";
import useUser from "@/hooks/useUser";
import axiosInstance from "@/utils/axios";
import axios from 'axios';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

interface TransactionListProps {
  accounts: Account[];
}

export default function TransactionList({ accounts }: TransactionListProps) {
  const user = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>(accounts[0]?.id || "");
  const [transactionType, setTransactionType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'));
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);

  const fetchTransactions = useCallback(async () => {
    if (!user || !selectedAccount) {
      console.log("No user or account found, skipping fetch");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosInstance.get("/transactions", {
        params: { account_id: selectedAccount }
      });
      
      const transactionsArray = Array.isArray(response.data) ? response.data : [];
      setTransactions(transactionsArray);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.detail || "Erreur lors de la récupération des transactions";
        setError(errorMessage);
      } else {
        setError("Erreur lors de la récupération des transactions");
      }
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [selectedAccount, user]);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, fetchTransactions]);

  const handleAccountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAccount(event.target.value);
  };

  const handleTransactionTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTransactionType(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event.target.value);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = parseISO(transaction.created_at);
    const monthStart = startOfMonth(parseISO(selectedMonth + '-01'));
    const monthEnd = endOfMonth(parseISO(selectedMonth + '-01'));

    // Filter by month
    if (!isWithinInterval(transactionDate, { start: monthStart, end: monthEnd })) {
      return false;
    }

    // Filter by transaction type
    if (transactionType !== "all") {
      if (transactionType === "recettes" && transaction.source_account_id) {
        return false;
      }
      if (transactionType === "depenses" && !transaction.source_account_id) {
        return false;
      }
    }

    // Filter by search query (amount)
    if (searchQuery) {
      const amount = transaction.amount.toString();
      return amount.includes(searchQuery);
    }

    return true;
  });

  const handleDownloadStatement = () => {
    // Générer un fichier CSV des transactions
    const selectedMonthFormatted = format(parseISO(selectedMonth + '-01'), 'MMMM yyyy', { locale: fr });
    
    // Préparer les en-têtes du CSV
    const headers = [
      'Date', 
      'Type', 
      'Statut', 
      'Montant', 
      'Compte de destination', 
      'Compte source'
    ];

    // Convertir les transactions filtrées en lignes CSV
    const csvLines = filteredTransactions.map(transaction => {
      // Vérifier et fournir des valeurs par défaut
      const safeTransaction = {
        created_at: transaction.created_at || '',
        type: transaction.type || 'N/A',
        status: transaction.status || 'N/A',
        amount: transaction.amount !== undefined ? transaction.amount : 0,
        destination_account_id: transaction.destination_account_id || 'N/A',
        source_account_id: transaction.source_account_id || ''
      };

      return [
        format(parseISO(safeTransaction.created_at), 'dd/MM/yyyy'),
        safeTransaction.type,
        safeTransaction.status,
        (safeTransaction.source_account_id ? '-' : '+') + safeTransaction.amount.toFixed(2),
        getAccountName(safeTransaction.destination_account_id),
        safeTransaction.source_account_id ? getAccountName(safeTransaction.source_account_id) : 'N/A'
      ];
    });

    // Créer le contenu CSV
    const csvContent = [
      headers.join(','),
      ...csvLines.map(line => line.map(cell => 
        // Échapper les virgules et les guillemets, et gérer les undefined
        `"${(cell ?? '').toString().replace(/"/g, '""')}"`
      ).join(','))
    ].join('\n');

    // Créer un Blob et télécharger
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `Relevé_${selectedMonthFormatted}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCloseDownloadDialog = () => {
    setDownloadDialogOpen(false);
  };

  const getTransactionColor = (transaction: Transaction) => {
    if (!transaction.source_account_id) return "success"; // Recette
    return "error"; // Dépense
  };

  const formatDate = (date: string) => {
    return format(parseISO(date), 'dd MMMM yyyy', { locale: fr });
  };

  const getAccountName = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    return account?.name || accountId;
  };

  // Générer la liste des mois pour le sélecteur
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(new Date().getFullYear(), i, 1);
    return format(date, 'yyyy-MM');
  });

  return (
    <Box>
      <Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Compte</InputLabel>
            <Select value={selectedAccount} onChange={handleAccountChange} label="Compte">
              {accounts.map((account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.name || account.id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Type de transaction</InputLabel>
            <Select
              value={transactionType}
              onChange={handleTransactionTypeChange}
              label="Type de transaction"
            >
              <MenuItem value="all">Toutes les transactions</MenuItem>
              <MenuItem value="recettes">Recettes</MenuItem>
              <MenuItem value="depenses">Dépenses</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Rechercher par montant"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ minWidth: 200 }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Mois</InputLabel>
            <Select
              value={selectedMonth}
              onChange={handleMonthChange}
              label="Mois"
            >
              {monthOptions.map((month) => (
                <MenuItem key={month} value={month}>
                  {format(parseISO(month + '-01'), 'MMMM yyyy', { locale: fr })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<FileDownloadIcon />}
            onClick={() => setDownloadDialogOpen(true)}
          >
            Télécharger le relevé
          </Button>
        </Box>
      </Box>

      {loading && (
        <Typography variant="body1" color="text.secondary" align="center">
          Chargement des transactions...
        </Typography>
      )}

      {error && (
        <Typography variant="body1" color="error" align="center">
          {error}
        </Typography>
      )}

      <Box sx={{ mt: 2 }}>
        {!loading && !error && filteredTransactions.length === 0 && (
          <Typography variant="body1" color="text.secondary" align="center">
            Aucune transaction trouvée
          </Typography>
        )}

        {filteredTransactions.map((transaction) => (
          <Card key={transaction.id} sx={{ mb: 2 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6">
                    {formatDate(transaction.created_at)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Chip
                    label={transaction.type}
                    color={getTransactionColor(transaction)}
                    variant="outlined"
                  />
                  {transaction.status === "PENDING" && (
                    <Chip
                      label="En cours"
                      color="warning"
                      variant="outlined"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Grid>
                <Grid item xs={12} sm={4} sx={{ textAlign: "right" }}>
                  <Typography variant="h6" color={transaction.source_account_id ? "error" : "success"}>
                    {transaction.source_account_id ? "-" : "+"}
                    {transaction.amount.toFixed(2)} €
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Compte : {getAccountName(transaction.destination_account_id)}
                  </Typography>
                  {transaction.source_account_id && (
                    <Typography variant="body2" color="text.secondary">
                      Depuis : {getAccountName(transaction.source_account_id)}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Dialog open={downloadDialogOpen} onClose={handleCloseDownloadDialog}>
        <DialogTitle>Télécharger le relevé</DialogTitle>
        <DialogContent>
          <Typography>
            Voulez-vous télécharger le relevé pour {format(parseISO(selectedMonth + '-01'), 'MMMM yyyy', { locale: fr })} ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDownloadDialog} color="primary">
            Annuler
          </Button>
          <Button onClick={handleDownloadStatement} color="primary" autoFocus>
            Télécharger
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
