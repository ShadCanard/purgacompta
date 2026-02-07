import { getApolloClient } from '@/lib/apolloClient';
import { GET_MEMBERS, GET_USER_BY_ID } from '@/lib/queries/users';
import { User } from '@purgacompta/common/types/user';
import { useQuery } from '@tanstack/react-query';

// Hook pour récupérer la liste des membres (users)
export function useMembersList() {
	return useQuery<User[]>({
		queryKey: ['members-list'],
		queryFn: async () => {
			const apolloClient = getApolloClient();
			const { data } = await apolloClient.query({ query: GET_MEMBERS });
			return (data as any).users || [];
		},
	});
}

// Hook pour récupérer un utilisateur par son id
export function useUserById(userId: string | undefined) {
	return useQuery<User | null>({
		queryKey: ['user-by-id', userId],
		enabled: !!userId,
		queryFn: async () => {
			if (!userId) return null;
			const apolloClient = getApolloClient();
			const { data } = await apolloClient.query({
				query: GET_USER_BY_ID,
				variables: { id: userId },
				fetchPolicy: 'network-only',
			});
			const user = (data as any).userById as User | null;
			if (!user) return null;
			let safeUser = { ...user };
			if (typeof safeUser.data === 'string') {
				try {
					safeUser.data = JSON.parse(safeUser.data);
				} catch {
					safeUser.data = {};
				}
			} else if (typeof safeUser.data !== 'object') {
				safeUser.data = {};
			}
			return safeUser;
		},
		refetchOnWindowFocus: false,
	});
}
