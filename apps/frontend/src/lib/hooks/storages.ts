import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApolloClient } from '../apolloClient';
import { GET_STORAGE_BY_ID, GET_STORAGES } from '../queries/storages';
import { CREATE_STORAGE, UPDATE_STORAGE } from '../mutations/storages';
import { gql } from '@apollo/client';

const GET_STORAGE_LOCATIONS = gql`
  query GetStorageLocations {
    storageLocations {
      id
      name
      createdAt
      updatedAt
      storages { id name }
    }
  }
`;

const GET_STORAGE_LOCATION_BY_ID = gql`
  query GetStorageLocationById($id: ID!) {
    storageLocationById(id: $id) {
      id
      name
      createdAt
      updatedAt
      storages { id name }
    }
  }
`;

const CREATE_STORAGE_LOCATION = gql`
  mutation CreateStorageLocation($input: CreateStorageLocationInput!) {
    createStorageLocation(input: $input) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_STORAGE_LOCATION = gql`
  mutation UpdateStorageLocation($id: ID!, $input: CreateStorageLocationInput!) {
    updateStorageLocation(id: $id, input: $input) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

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

  // Liste des emplacements de stockage
  const storageLocationsQuery = useQuery({
    queryKey: ['storageLocations'],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GET_STORAGE_LOCATIONS,
        fetchPolicy: 'network-only',
      });
      return (data as any).storageLocations;
    },
  });

  // Détail d'un emplacement de stockage par ID
  const getStorageLocationById = (id: string) =>
    useQuery({
      queryKey: ['storageLocation', id],
      queryFn: async () => {
        const { data } = await apolloClient.query({
          query: GET_STORAGE_LOCATION_BY_ID,
          variables: { id },
          fetchPolicy: 'network-only',
        });
        return (data as any).storageLocationById;
      },
      enabled: !!id,
    });

  // Création d'un emplacement de stockage
  const createStorageLocation = useMutation({
    mutationFn: async (input: any) => {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_STORAGE_LOCATION,
        variables: { input },
      });
      return (data as any).createStorageLocation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storageLocations'] });
    },
  });

  // Mise à jour d'un emplacement de stockage
  const updateStorageLocation = useMutation({
    mutationFn: async ({ id, input }: { id: string; input: any }) => {
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_STORAGE_LOCATION,
        variables: { id, input },
      });
      return (data as any).updateStorageLocation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storageLocations'] });
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
