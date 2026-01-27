
import apolloClient from "@/lib/apolloClient";
import { GET_TRANSACTIONS_BY_ENTITY, GET_TRANSACTIONS, GET_CONTACTS_OR_GROUPS_TRANSACTION } from "@/lib/queries";
import { Typography, Box, Autocomplete, Paper, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import HistoryCard from "./HistoryCard";
import { useState } from "react";

// Composant pour afficher l'historique des transactions d'une entité (groupe/contact) ou toutes si aucun filtre
const HistoryTransactions: React.FC<{ entityId?: string }> = ({ entityId }) => {
  const [groupOrContact, setGroupOrContact] = useState<any>(null); // pour Entrante
  const { data: contactsOrGroups = { groups: [], contactsWithoutGroup: [] } } = useQuery({
    queryKey: ['contactsOrGroupsTransaction'],
    queryFn: async () => {
      const result = await apolloClient.query({ query: GET_CONTACTS_OR_GROUPS_TRANSACTION });
      return (result.data as any);
    },
  });
  const { data, isLoading, error } = useQuery({
    queryKey: entityId ? ["transactionsByEntity", entityId] : ["transactionsAll"],
    queryFn: async () => {
      if (entityId) {
        const result = await apolloClient.query({ query: GET_TRANSACTIONS_BY_ENTITY, variables: { entityId } });
        return (result.data as any).transactionsByEntity;
      } else {
        const result = await apolloClient.query({ query: GET_TRANSACTIONS });
        return (result.data as any).transactions;
      }
    },
    enabled: entityId === undefined || !!entityId,
  });

  return (
  <Paper sx={{ p: 3, minHeight: 300 }}>
          <Typography variant="h6" gutterBottom>Historique des transactions</Typography>
          <Box sx={{ mb: 2 }}>
            <Autocomplete
              options={[
                ...contactsOrGroups.groups,
                ...[...contactsOrGroups.contactsWithoutGroup].sort((a, b) => a.name.localeCompare(b.name))
              ]}
              getOptionLabel={option => option?.name || ''}
              value={groupOrContact}
              onChange={(_, v) => setGroupOrContact(v)}
              renderInput={params => <TextField {...params} label="Filtrer par groupe ou contact" fullWidth />}
              sx={{ minWidth: 220 }}
            />
          </Box>
        {isLoading && <Typography>Chargement...</Typography>}
        {error && <Typography color="error">Erreur lors du chargement de l'historique.</Typography>}
        {(!data || data.length === 0) && (
          <Box display="flex" alignItems="center" justifyContent="center" minHeight={200}>
            <Typography align="center" color="text.secondary">Aucune transaction trouvée.</Typography>
          </Box>
        )}
        {!isLoading && !error && data && data.length > 0 && (
          <Box>
            {data.map((transaction: any) => (
              <HistoryCard key={transaction.id} transaction={transaction} />
            ))}
          </Box>
        )}
    </Paper>
  )
  
};

export default HistoryTransactions;

