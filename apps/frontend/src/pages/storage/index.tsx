import { MainLayout } from "@/components";
import ConsolidatedStorageCard from "@/components/storage/ConsolidatedStorageCard";
import StorageStats from "@/components/storage/StorageStats";
import { Box, Typography, Autocomplete, TextField, Chip } from "@mui/material";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getApolloClient } from "@/lib/apolloClient";
import { GET_STORAGE_LOCATIONS } from "@/lib/queries";

const StoragePage : React.FC = () => {

    const [selectedCard, setSelectedCard] = useState<string|null>(null);
    const [selectedLocations, setSelectedLocations] = useState<any[]>([]);
    const queryClient = useQueryClient();

    // Récupération des StorageLocations depuis l'API
    const { data: storageLocationsData, isLoading: loadingLocations } = useQuery({
        queryKey: ['storageLocations'],
        queryFn: async () => {
            const apolloClient = getApolloClient();
            const { data } = await apolloClient.query({
                query: GET_STORAGE_LOCATIONS,
            });
            return (data as any).storageLocations;
        },
    });

    const handleChangeLocations = (_ : any, value : any) => {
        setSelectedLocations(value);
        queryClient.invalidateQueries({ queryKey: ['storageItemsGrid'] });
    }

  return (
    <MainLayout>
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Stockages
                </Typography>
            </Box>
            <Box sx={{ mb: 2 }} display="flex" alignItems="center">
                <StorageStats setSelectedCard={setSelectedCard} />
            </Box>
            <Box sx={{ mb: 2 }}>
                <Autocomplete
                    multiple
                    options={storageLocationsData || []}
                    getOptionLabel={(option) => option.name}
                    value={selectedLocations}
                    onChange={handleChangeLocations}
                    loading={loadingLocations}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip label={option.name} {...getTagProps({ index })} key={option.id} />
                        ))
                    }
                    renderInput={(params) => (
                        <TextField {...params} variant="outlined" label="Emplacements" placeholder="Sélectionner..." />
                    )}
                />
            </Box>
            <ConsolidatedStorageCard selectedCard={selectedCard} storageLocations={selectedLocations || []} />
        </Box>
    </MainLayout>
    )
};

export default StoragePage;