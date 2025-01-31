import AddBeneficiaryModal from "@/components/beneficiaries/AddBeneficiaryModal";
import useUser from "@/hooks/useUser";
import { Account } from "@/types/account";
import axiosInstance from "@/utils/axios";
import AddIcon from "@mui/icons-material/Add";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";

export const Route = createFileRoute("/_authenticated/transfer")({
  component: TransferPage,
});

function TransferPage() {
  const user = useUser();
  const [transferType, setTransferType] = useState<
    "internal" | "external" | "beneficiary"
  >("internal");
  const [sourceAccountIban, setSourceAccountIban] = useState<string>("");
  const [destinationAccountIban, setDestinationAccountIban] =
    useState<string>("");
  const [selectedBeneficiary, setSelectedBeneficiary] =
    useState<Beneficiary | null>(null);
  const [destinationIban, setDestinationIban] = useState<string>("");
  const [destinationName, setDestinationName] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [isAddBeneficiaryModalOpen, setIsAddBeneficiaryModalOpen] =
    useState(false);

  // Récupérer les comptes de l'utilisateur
  const { data: accounts, isLoading: isLoadingAccounts } = useQuery<Account[]>({
    queryKey: ["accounts", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const response = await axiosInstance.get("/accounts");
      return response.data;
    },
    enabled: !!user,
  });

  // Récupérer les bénéficiaires de l'utilisateur
  const { data: beneficiaries, isLoading: isLoadingBeneficiaries } = useQuery<
    Beneficiary[]
  >({
    queryKey: ["beneficiaries", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const response = await axiosInstance.get("/beneficiaries");
      return response.data;
    },
    enabled: !!user,
  });

  // Mutation pour supprimer un bénéficiaire
  const deleteBeneficiaryMutation = useMutation({
    mutationFn: async (beneficiaryId: string) => {
      const response = await axiosInstance.delete(
        `/beneficiaries/${beneficiaryId}`
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Bénéficiaire supprimé avec succès");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Erreur lors de la suppression du bénéficiaire";
      toast.error(errorMessage);
    },
  });

  // Mutation pour effectuer le virement
  const transferMutation = useMutation({
    mutationFn: async (transferData: {
      source_account_iban: string;
      destination_account_iban?: string;
      name?: string;
      amount: number;
    }) => {
      try {
        const response = await axiosInstance.post("/send", transferData);
        return response.data;
      } catch (error: any) {
        console.error("Transfer error:", error.response?.data);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Virement effectué avec succès !");

      // Réinitialiser les champs
      setSourceAccountIban("");
      setDestinationAccountIban("");
      setSelectedBeneficiary(null);
      setDestinationIban("");
      setDestinationName("");
      setAmount("");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Erreur lors du virement";
      toast.error(errorMessage);
      console.error("Transfer mutation error:", error);
    },
  });

  const handleAddBeneficiary = () => {
    setIsAddBeneficiaryModalOpen(true);
  };

  const handleTransfer = () => {
    if (!sourceAccountIban) {
      toast.error("Veuillez sélectionner un compte source");
      return;
    }

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      toast.error("Montant invalide");
      return;
    }

    // Trouver le compte source pour vérifier le solde
    const sourceAccount = accounts?.find(
      (acc) => acc.iban === sourceAccountIban
    );
    if (!sourceAccount) {
      toast.error("Compte source introuvable");
      return;
    }

    if (transferAmount > sourceAccount.balance) {
      toast.error(
        `Solde insuffisant. Votre solde actuel est de ${sourceAccount.balance.toFixed(2)} €`
      );
      return;
    }

    // Validation spécifique selon le type de destination
    switch (transferType) {
      case "internal":
        if (!destinationAccountIban) {
          toast.error("Veuillez sélectionner un compte destination");
          return;
        }
        break;
      case "beneficiary":
        if (!selectedBeneficiary) {
          toast.error("Veuillez sélectionner un bénéficiaire");
          return;
        }
        break;
      case "external":
        if (!destinationIban) {
          toast.error("Veuillez saisir un IBAN");
          return;
        }
        if (!destinationName) {
          toast.error("Veuillez saisir un nom de bénéficiaire");
          return;
        }
        break;
    }

    // Effectuer le virement
    transferMutation.mutate({
      source_account_iban: sourceAccountIban,
      destination_account_iban:
        transferType === "internal"
          ? destinationAccountIban
          : transferType === "beneficiary"
            ? selectedBeneficiary?.iban
            : destinationIban,
      amount: transferAmount,
    });
  };

  const handleDeleteBeneficiary = (beneficiaryId: string) => {
    deleteBeneficiaryMutation.mutate(beneficiaryId);
  };

  // Trouver le solde du compte source sélectionné
  const selectedSourceAccount = accounts?.find(
    (acc) => acc.id === sourceAccountIban
  );

  if (isLoadingAccounts || isLoadingBeneficiaries) {
    return <Typography>Chargement...</Typography>;
  }

  if (!accounts || accounts.length === 0) {
    return <Typography>Aucun compte disponible</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          <CompareArrowsIcon sx={{ mr: 2, verticalAlign: "middle" }} />
          Effectuer un virement
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Type de virement</InputLabel>
                <Select
                  value={transferType}
                  label="Type de virement"
                  onChange={(e) => {
                    setTransferType(
                      e.target.value as "internal" | "external" | "beneficiary"
                    );
                    // Réinitialiser les champs
                    setDestinationAccountIban("");
                    setSelectedBeneficiary(null);
                    setDestinationIban("");
                    setDestinationName("");
                  }}
                >
                  <MenuItem value="internal">Virement interne</MenuItem>
                  <MenuItem value="external">Virement externe (IBAN)</MenuItem>
                  <MenuItem value="beneficiary">Mes bénéficiaires</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Compte source</InputLabel>
                <Select
                  value={sourceAccountIban}
                  label="Compte source"
                  onChange={(e) => setSourceAccountIban(e.target.value)}
                >
                  {accounts.map((account) => (
                    <MenuItem key={account.id} value={account.iban}>
                      {account.name} - Solde: {account.balance.toFixed(2)} €
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedSourceAccount && (
                <Typography variant="body2" color="text.secondary">
                  Solde actuel : {selectedSourceAccount.balance.toFixed(2)} €
                </Typography>
              )}

              {transferType === "internal" && (
                <FormControl fullWidth>
                  <InputLabel>Compte destination</InputLabel>
                  <Select
                    value={destinationAccountIban}
                    label="Compte destination"
                    onChange={(e) => setDestinationAccountIban(e.target.value)}
                  >
                    {accounts.map((account) => (
                      <MenuItem
                        key={account.id}
                        value={account.id}
                        disabled={account.id === sourceAccountIban}
                      >
                        {account.name} - Solde: {account.balance.toFixed(2)} €
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {transferType === "external" && (
                <>
                  <TextField
                    fullWidth
                    label="IBAN"
                    value={destinationIban}
                    onChange={(e) => setDestinationIban(e.target.value)}
                    placeholder="FR76 1234 5678 9012 3456 7890 189"
                    helperText="Saisissez l'IBAN complet du bénéficiaire"
                  />
                  <TextField
                    fullWidth
                    label="Nom du bénéficiaire"
                    value={destinationName}
                    onChange={(e) => setDestinationName(e.target.value)}
                    placeholder="Nom complet ou nom de l'entreprise"
                  />
                </>
              )}

              {transferType === "beneficiary" && (
                <Box>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddBeneficiary}
                    sx={{ mb: 2 }}
                  >
                    Ajouter un bénéficiaire
                  </Button>
                  {beneficiaries && beneficiaries.length > 0 ? (
                    beneficiaries.map((beneficiary) => (
                      <Card
                        key={beneficiary.id}
                        sx={{
                          mb: 2,
                          backgroundColor:
                            selectedBeneficiary?.id === beneficiary.id
                              ? "primary.light"
                              : "background.paper",
                        }}
                      >
                        <CardContent
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box>
                            <Typography variant="body1" fontWeight="bold">
                              {beneficiary.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Compte : {beneficiary.iban}
                            </Typography>
                          </Box>
                          <Box>
                            <Tooltip title="Sélectionner ce bénéficiaire">
                              <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                onClick={() =>
                                  setSelectedBeneficiary(beneficiary)
                                }
                                sx={{ mr: 1 }}
                              >
                                <SendIcon />
                              </Button>
                            </Tooltip>
                            <Tooltip title="Supprimer le bénéficiaire">
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() =>
                                  handleDeleteBeneficiary(beneficiary.id)
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Aucun bénéficiaire enregistré
                    </Typography>
                  )}
                </Box>
              )}

              <TextField
                fullWidth
                label="Montant"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                InputProps={{
                  endAdornment: <Typography variant="body2">€</Typography>,
                }}
                inputProps={{
                  min: 0,
                  step: 0.01,
                }}
              />

              <Button
                variant="contained"
                color="primary"
                onClick={handleTransfer}
                fullWidth
                disabled={
                  transferMutation.isPending ||
                  !sourceAccountIban ||
                  !amount ||
                  parseFloat(amount) <= 0 ||
                  (transferType === "internal" && !destinationAccountIban) ||
                  (transferType === "external" &&
                    (!destinationIban || !destinationName)) ||
                  (transferType === "beneficiary" && !selectedBeneficiary) ||
                  (selectedSourceAccount &&
                    parseFloat(amount) > selectedSourceAccount.balance)
                }
              >
                {transferMutation.isPending
                  ? "Virement en cours..."
                  : "Effectuer le virement"}
              </Button>
            </Box>
          </Grid>

          {/* Section des bénéficiaires */}
          {transferType === "beneficiary" && (
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Mes bénéficiaires
              </Typography>
              {beneficiaries && beneficiaries.length > 0 ? (
                beneficiaries.map((beneficiary) => (
                  <Card key={beneficiary.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="body1" fontWeight="bold">
                        {beneficiary.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Compte : {beneficiary.iban}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Aucun bénéficiaire enregistré
                </Typography>
              )}
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Modal d'ajout de bénéficiaire */}
      <AddBeneficiaryModal
        open={isAddBeneficiaryModalOpen}
        onClose={() => setIsAddBeneficiaryModalOpen(false)}
      />
    </Container>
  );
}
