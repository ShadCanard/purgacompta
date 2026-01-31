import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApolloClient } from '../apolloClient';
import { CREATE_VEHICLE_TRANSACTION, UPDATE_VEHICLE_TRANSACTION, DELETE_VEHICLE_TRANSACTION } from '../mutations/transactions';
import { GET_VEHICLE_TRANSACTION_BY_ID, GET_VEHICLE_TRANSACTION } from '../queries/transactions';

const apolloClient = getApolloClient();

export function useVehicleTransactions() {
  return useQuery({
    queryKey: ['vehicleTransactions'],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GET_VEHICLE_TRANSACTION,
        fetchPolicy: 'network-only',
      });
      return (data as any).vehicleTransactions;
    },
  });
}

export function useVehicleTransaction(id: string) {
  return useQuery({
    queryKey: ['vehicleTransaction', id],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GET_VEHICLE_TRANSACTION_BY_ID,
        variables: { id },
      });
      return (data as any).vehicleTransaction;
    },
    enabled: !!id,
  });
}

export function useCreateVehicleTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: any) => {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_VEHICLE_TRANSACTION,
        variables: { input },
      });
      return (data as any).createVehicleTransaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicleTransactions'] });
    },
  });
}

export function useUpdateVehicleTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: any }) => {
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_VEHICLE_TRANSACTION,
        variables: { id, input },
      });
      return (data as any).updateVehicleTransaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicleTransactions'] });
    },
  });
}

export function useDeleteVehicleTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apolloClient.mutate({
        mutation: DELETE_VEHICLE_TRANSACTION,
        variables: { id },
      });
      return (data as any).deleteVehicleTransaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicleTransactions'] });
    },
  });
}
