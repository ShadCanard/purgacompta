import { GET_ITEMS } from "@/lib/queries/items";
import { useApolloClient } from "@apollo/client/react";
import { Box, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useQueryClient, useQuery } from "@tanstack/react-query";

interface StorageSearchProps {
    search: string;
    setSearch: (value: string) => void;
    searchType: string;
    setSearchType: (value: string) => void;
}

const StorageSearch : React.FC<StorageSearchProps> = ({ search, setSearch, searchType, setSearchType }) => {

    const queryClient = useQueryClient();
    const apolloClient = useApolloClient();

    const {data : itemsList, isLoading : loadingItems} = useQuery({
        queryKey: ['items'],
        queryFn: async () => {
            const { data } = await apolloClient.query({
                query: GET_ITEMS,
            });
            return (data as any).items;
        }
    });

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                                sx={{ flexGrow: 1 }}
                                placeholder="Rechercher..."
                                aria-label="Recherche objet"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                        />
            <Box>
                <ToggleButtonGroup
                    value={searchType}
                    exclusive
                    onChange={(e, value) => { setSearchType(value)}}
                    aria-label="Filtrer les items"
                >
                    <ToggleButton
                        sx={{ ml: 2, verticalAlign: 'center' }}
                        value="all"
                    >
                        Tous les items
                    </ToggleButton>
                    <ToggleButton
                        sx={{ ml: 2, verticalAlign: 'center' }}
                        value="lowStock"
                    >
                        Stock bas
                    </ToggleButton>
                    <ToggleButton
                        sx={{ ml: 2, verticalAlign: 'center' }}
                        value="outOfStock"
                    >
                        Rupture de stock
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
        </Box>
    )
};

export default StorageSearch;