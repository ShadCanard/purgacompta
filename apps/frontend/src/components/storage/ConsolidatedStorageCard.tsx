import { Card, CardContent } from "@mui/material";
import { useEffect, useState } from "react";
import StorageSearch from "./StorageSearch";
import StorageContentGrid from "./StorageContentGrid";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getApolloClient } from "@/lib/apolloClient";
import { GET_STORAGE_ITEMS_BY_LOCATION_IDS } from "@/lib/queries";
import { useEffect as useReactEffect } from "react";
import { STORAGE_UPDATED } from "@/lib/subscriptions";
import AddItemToStorage from "./AddItemToStorage";

interface ConsolidatedStorageCardProps {
    selectedCard: string | null;
    storageLocations?: any[];
}

const ConsolidatedStorageCard: React.FC<ConsolidatedStorageCardProps> = ({ selectedCard, storageLocations }) => {

    const [search, setSearch ] = useState("");
    const [searchType, setSearchType] = useState("all");
    const [items, setItems] = useState<any[]>([]);


    // Récupération dynamique des items selon les storageLocations sélectionnés
    const storageLocationIds = (storageLocations && storageLocations.length > 0)
        ? storageLocations.map((loc: any) => loc.id)
        : [];

    const queryClient = useQueryClient();
    const { data: storageItemsData, isLoading: loadingItems } = useQuery({
        queryKey: ['storageItemsGrid'],
        queryFn: async () => {
            const apolloClient = getApolloClient();
            // Si aucune location sélectionnée, on récupère tous les items (en passant un tableau vide)
            const { data } = await apolloClient.query({
                query: GET_STORAGE_ITEMS_BY_LOCATION_IDS,
                variables: { storageLocationIds },
            });
            return (data as any).storageItemsByStorageLocationIds;
        },
        enabled: true
    });

    // Subscription à STORAGE_UPDATED
    useReactEffect(() => {
        const apolloClient = getApolloClient();
        const observable = apolloClient.subscribe({ query: STORAGE_UPDATED });
        const subscription = observable.subscribe({
            next: () => {
                // Rafraîchir les items
                queryClient.invalidateQueries({ queryKey: ['storageItemsGrid'] });
            }
        });
        return () => subscription.unsubscribe();
    }, [storageLocationIds, queryClient]);

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ['storageItemsGrid'] });
    }, [storageLocations]);

    useEffect(() => {
        setSearchType(selectedCard ?? "all");
        if(storageItemsData) {
            let filteredItems = storageItemsData;
            // Filtrage par type de stock
            if(searchType === "lowStock") {
                filteredItems = filteredItems.filter((item: any) => {
                    const quantity = item.quantity ?? 0;
                    const minQuantity = item.item?.minQuantity ?? 0;
                    return minQuantity >= 1 && quantity < minQuantity;
                });
            } else if(searchType === "outOfStock") {
                filteredItems = filteredItems.filter((item: any) => {
                    const quantity = item.quantity ?? 0;
                    const minQuantity = item.item?.minQuantity ?? 0;
                    return minQuantity >= 1 && quantity === 0;
                });
            }
            // Filtrage par recherche texte
            if(search.trim() !== "") {
                filteredItems = filteredItems.filter((item: any) => 
                    (item.item?.name?.toLowerCase().includes(search.toLowerCase()) ||
                    item.name?.toLowerCase().includes(search.toLowerCase())) ||
                    (item.description?.toLowerCase().includes(search.toLowerCase()))
                );
            }
            setItems(filteredItems);
        }
    }, [search, searchType, selectedCard, storageItemsData]);

    return (
        <Card>
            <CardContent>
                <AddItemToStorage />    
                <hr />
                <StorageSearch 
                    search={search} 
                    setSearch={setSearch} 
                    searchType={searchType} 
                    setSearchType={setSearchType} />
                <StorageContentGrid items={items} sx={{ my: 2 }} />
            </CardContent>
        </Card>
    )
};

export default ConsolidatedStorageCard;