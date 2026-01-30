import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApolloClient } from '../apolloClient';
import { GET_STORAGE_BY_ID, GET_STORAGES } from '../queries/storages';
import { CREATE_STORAGE, UPDATE_STORAGE } from '../mutations/storages';

// Hook pour la gestion complète de l'inventaire (stockages)
export function useStoragesInventory() {

  const apolloClient = getApolloClient();
  const queryClient = useQueryClient();

  // Liste des stockages
  const storagesQuery = useQuery({
    queryKey: ['storages'],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GET_STORAGES,
        fetchPolicy: 'network-only',
      });
      return (data as any).storages;
    },
  });

  // Détail d'un stockage par ID
  const getStorageById = (id: string) =>
    useQuery({
      queryKey: ['storage', id],
      queryFn: async () => {
        const { data } = await apolloClient.query({
          query: GET_STORAGE_BY_ID,
          variables: { id },
          fetchPolicy: 'network-only',
        });
        return (data as any).storageById;
      },
      enabled: !!id,
    });

  // Création d'un stockage
  const createStorage = useMutation({
    mutationFn: async (input: any) => {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_STORAGE,
        variables: { input },
      });
      return (data as any).createStorage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storages'] });
    },
  });

  // Mise à jour d'un stockage (ajout d'item)
  const updateStorage = useMutation({
    mutationFn: async (input: any) => {
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_STORAGE,
        variables: { input },
      });
      return (data as any).updateStorage;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['storages'] });
      if (variables?.storageId) {
        queryClient.invalidateQueries({ queryKey: ['storage', variables.storageId] });
      }
    },
  });

  return {
    storagesQuery,
    getStorageById,
    createStorage,
    updateStorage,
  };
}
