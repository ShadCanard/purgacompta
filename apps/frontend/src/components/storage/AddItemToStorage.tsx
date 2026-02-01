import { getApolloClient } from '@/lib/apolloClient';
import { GET_STORAGE_LOCATIONS } from '@/lib/queries';
import { GET_ITEMS } from '@/lib/queries/items';
import { GET_STORAGE_LOCATION_BY_ID } from '@/lib/queries/storages';
import { Add } from '@mui/icons-material';
import { Box, Autocomplete, TextField, Button } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { UPDATE_STORAGE_ITEM } from '@/lib/mutations/storages';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';

const AddItemToStorage : React.FC = () => {

    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedStorage, setSelectedStorage] = useState<any | null>(null);
    const [minQuantity, setMinQuantity] = useState<number | null>(null);

    const apolloClient = getApolloClient();
    const queryClient = useQueryClient();

    const { data: itemsList, isLoading: loadingItems } = useQuery({
        queryKey: ['items'],
        queryFn: async () => {
            const { data } = await apolloClient.query({
                query: GET_ITEMS,
            });
            return (data as any).items;
        }
    });

    const { data: storageLocationsList, isLoading: loadingStorageLocations } = useQuery({
        queryKey: ['storageLocations'],
        queryFn: async () => {
            const { data } = await apolloClient.query({
                query: GET_STORAGE_LOCATIONS,
            });
            return (data as any).storageLocations;
        }
    });

    // Construction d'une liste de tous les storages avec la StorageLocation comme catégorie
    const allStorages: any[] = [];
    if (storageLocationsList) {
        storageLocationsList.forEach((location: any) => {
            (location.storages || []).forEach((storage: any) => {
                allStorages.push({
                    ...storage,
                    storageLocationName: location.name
                });
            });
        });
    }

    const mutation = useMutation({
        mutationFn: async (input: any) => {
            const apolloClient = getApolloClient();
            const { data } = await apolloClient.mutate({
                mutation: UPDATE_STORAGE_ITEM,
                variables: { input },
            });
            return (data as any).updateStorageItem;
        },
    });

    const handleSubmitNewStorageItem = () => {
        if (!selectedItem || !selectedStorage || !minQuantity) return;
        mutation.mutate({
            storageId: selectedStorage.id,
            itemId: selectedItem.id,
            quantity: 0,
            minQuantity: minQuantity,
        });
    }


    // Récupérer les items déjà présents dans le stockage sélectionné
    const { data: storageItems = [], isLoading: loadingStorageItems } = useQuery({
        queryKey: ['storageItems', selectedStorage?.id],
        queryFn: async () => {
            if (!selectedStorage?.id) return [];
            // On suppose qu'il existe une query pour récupérer les items d'un storage
            const { data } = await apolloClient.query({
                query: GET_STORAGE_LOCATION_BY_ID,
                variables: { id: selectedStorage.id },
            });
            // On récupère tous les items de tous les storages de la StorageLocation
            // mais ici on ne prend que le storage sélectionné
            const storage = (data as any).storageLocationById?.storages?.find((s: any) => s.id === selectedStorage.id);
            return storage?.items || [];
        },
        enabled: !!selectedStorage?.id
    });

    // Filtrer les items proposés : retirer ceux déjà présents dans le storage sélectionné
    const filteredItems = React.useMemo(() => {
        if (!selectedStorage || !itemsList) return itemsList || [];
        const presentItemIds = new Set(storageItems.map((si: any) => si.item?.id));
        return itemsList.filter((item: any) => !presentItemIds.has(item.id));
    }, [itemsList, storageItems, selectedStorage]);

    return (
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
            <Autocomplete
                options={filteredItems}
                getOptionLabel={(option: any) => option.name || ''}
                loading={loadingItems || loadingStorageItems}
                sx={{ flexGrow: 1 }}
                onChange={(_, value) => setSelectedItem(value)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder="Item"
                        label="Item"
                        aria-label="Item"
                    />
                )}
            />
            <Autocomplete
                options={allStorages}
                groupBy={(option: any) => option.storageLocationName}
                getOptionLabel={(option: any) => option.name || ''}
                loading={loadingStorageLocations}
                sx={{ flexGrow: 1 }}
                onChange={(_, value) => setSelectedStorage(value)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder="Stockage"
                        label="Stockage"
                        aria-label="Stockage"
                    />
                )}
            />
            <TextField
                type="text"
                inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                    maxLength: 8
                }}
                sx={{ width: 120 }}
                placeholder="Qté min."
                label="Qté min."
                aria-label="Quantité minimale"
                onChange={(event) => setMinQuantity(Number.parseInt(event.target.value))}
                onInput={e => {
                    // Empêche la saisie de caractères non numériques et de décimales
                    const input = e.target as HTMLInputElement;
                    input.value = input.value.replace(/[^\d]/g, '');
                }}
            />
            <Button 
                startIcon={<Add />} 
                variant="contained" 
                sx={{ ml: 1, alignSelf: 'center' }}
                onClick={handleSubmitNewStorageItem}>
                    Ajouter
            </Button>
            
        </Box>
    );
}

export default AddItemToStorage;