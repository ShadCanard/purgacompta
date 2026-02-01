import { Error, Warning } from "@mui/icons-material";
import { Box, BoxProps, Typography } from "@mui/material";
import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid';
import { useMutation } from '@tanstack/react-query';
import { getApolloClient } from '@/lib/apolloClient';
import { UPDATE_STORAGE_ITEM } from '@/lib/mutations/storages';

interface StorageContentGridProps extends BoxProps {
    items: any[];
}

const StorageContentGrid: React.FC<StorageContentGridProps> = ({ items, ...props }) => {
    const apolloClient = getApolloClient();
    const apiRef = useGridApiRef();

    const updateQuantityMutation = useMutation({
        mutationFn: async ({ storageId, itemId, quantity }: { storageId: string, itemId: string, quantity: number }) => {
            const { data } = await apolloClient.mutate({
                mutation: UPDATE_STORAGE_ITEM,
                variables: { input: { storageId, itemId, quantity } },
            });
            return (data as any)?.updateStorageItem;
        },
    });
    
    const columns: GridColDef[] = [
        {
            field: 'storageName',
            headerName: 'Stockage',
            minWidth: 140,
            flex: 1,
            renderCell: (params: any) => {
                const storageName = `${params.row.storage.storageLocation.name} > ${params.row.storage.name}`;
                return <Typography>{storageName || '—'}</Typography>;
            }
        },
        {
            field: 'name',
            headerName: 'Nom',
            flex: 1,
            minWidth: 120,
            renderCell: (params: any) => {
                const item = params.row.item || params.row;
                const quantity = params.row.quantity ?? 0;
                // minQuantity peut être sur item ou sur la row (pour compatibilité)
                const minQuantity = (typeof item.minQuantity === 'number' ? item.minQuantity : params.row.minQuantity) ?? 0;
                // Error: quantité = 0 et minQuantity >= 1
                if (minQuantity >= 1 && quantity === 0) {
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Error color="error" fontSize="small" />
                            <Typography>{item.name}</Typography>
                        </Box>
                    );
                }
                // Warning: quantité < minQuantity mais ≠ 0, minQuantity >= 1
                if (minQuantity >= 1 && quantity < minQuantity && quantity !== 0) {
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Warning color="warning" fontSize="small" />
                            <Typography>{item.name}</Typography>
                        </Box>
                    );
                }
                // Cas normal
                return <Typography>{item.name}</Typography>;
            },
        },
        { field: 'quantity', 
            headerName: 'Quantité', 
            width: 110, 
            editable: true,
        },
        { field: 'unitWeight', headerName: 'Poids unitaire', width: 120, 
            renderCell: (params: any) => {
                return `${params.row.item.weight} kg`;
            },
        },
        { field: 'totalWeight', headerName: 'Poids total', width: 130,
            renderCell: (params: any) => {
                return `${params.row.item.weight * params.row.quantity} kg`;
            },
        },
    ];

    // Déclenche la mutation lors de l'édition de la quantité
    const handleProcessRowUpdate = async (newRow: any, oldRow: any) => {
        if(oldRow.quantity !== Number.parseInt(newRow.quantity)) {
            await updateQuantityMutation.mutateAsync({
                storageId: newRow.storage.id,
                itemId: newRow.item.id,
                quantity: Number.parseInt(newRow.quantity),
            });
            // Force la sortie du mode édition pour la ligne
            if (apiRef.current) {
                apiRef.current.getRow(newRow.id).isEditing = false;
            }
        }
        return { ...newRow };
    };

    return (
        <Box {...props} sx={{ height: 400, width: '100%', ...props.sx }}>
            <DataGrid
                apiRef={apiRef}
                rows={items}
                columns={columns}
                pageSizeOptions={[10, 25, 50]}
                initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                disableRowSelectionOnClick
                autoHeight
                processRowUpdate={handleProcessRowUpdate}
                sx={{
                    '& .MuiDataGrid-cell': {
                        display: 'flex',
                        alignItems: 'center',
                    },
                }}
            />
        </Box>
    );
}

export default StorageContentGrid;