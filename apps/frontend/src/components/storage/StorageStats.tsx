import React from 'react';
import { Stack } from '@mui/material';
import StatCard from '../layout/StatCard';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { Error, Warning } from '@mui/icons-material';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect as useReactEffect } from 'react';
import { STORAGE_UPDATED } from '@/lib/subscriptions';
import { getApolloClient } from '@/lib/apolloClient';
import { useQuery } from "@tanstack/react-query";
import { GET_STORAGE_ITEMS_BY_LOCATION_IDS } from "@/lib/queries";

export interface StorageStatsProps {
    setSelectedCard: (card: string | null) => void;
}


const StorageStats: React.FC<StorageStatsProps> = ({ setSelectedCard }) => {


  // Récupération des StorageItems (tous, car tableau vide)
  const queryClient = useQueryClient();
  const { data: storageItems = [], isLoading } = useQuery({
    queryKey: ['storageItems'],
    queryFn: async () => {
      const apolloClient = getApolloClient();
      const { data } = await apolloClient.query({
        query: GET_STORAGE_ITEMS_BY_LOCATION_IDS,
        variables: { storageLocationIds: [] },
      });
      return (data as any).storageItemsByStorageLocationIds;
    },
  });

  // Subscription à STORAGE_UPDATED pour rafraîchir les items
  useReactEffect(() => {
    const apolloClient = getApolloClient();
    const observable = apolloClient.subscribe({ query: STORAGE_UPDATED });
    const subscription = observable.subscribe({
      next: () => {
        queryClient.invalidateQueries({ queryKey: ['storageItems'] });
      }
    });
    return () => subscription.unsubscribe();
  }, [queryClient]);

  // Calculs dynamiques à partir des données storageItems
  const totalWeight = storageItems.reduce((acc: number, item: any) => {
    const qty = item.quantity ?? 0;
    const w = item.item?.weight ?? 0;
    return acc + qty * w;
  }, 0);

  // Stock bas = quantité < minQuantity (minQuantity >= 1)
  const lowStockItems = storageItems.filter((item: any) => {
    const quantity = item.quantity ?? 0;
    const minQuantity = item.minQuantity ?? 0;
    return (minQuantity >= 1 && quantity < minQuantity) && quantity !== 0;
  }).length;

  // Rupture = quantité === 0 (minQuantity >= 1)
  const outOfStockItems = storageItems.filter((item: any) => {
    const quantity = item.quantity ?? 0;
    const minQuantity = item.minQuantity ?? 0;
    return minQuantity >= 1 && quantity === 0;
  }).length;

  return (
    <Stack direction="row" spacing={2}>
      <StatCard
        title="Poids total"
        value={totalWeight.toLocaleString('fr-FR', { maximumFractionDigits: 2 }) + ' kg'}
        icon={<Inventory2Icon />}
        color="#10d4d4"
        onClick={() => setSelectedCard(null)}
        cursor= 'pointer'
      />
      <StatCard
        title="Articles avec stock bas"
        value={lowStockItems.toString()}
        icon={<Warning />}
        color="#ff9800"
        onClick={() => setSelectedCard("lowStock")}
        cursor= 'pointer'
      />
      <StatCard
            title="Articles en rupture de stock"
            value={outOfStockItems.toString()}
            icon={<Error />}
            color="#bf0000"
            onClick={() => setSelectedCard("outOfStock")}
            cursor= 'pointer'
      />
    </Stack>
  );
};

export default StorageStats;
