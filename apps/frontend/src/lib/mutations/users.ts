import { gql } from "@apollo/client";

export const UPDATE_DISCORD_USER = gql`
	mutation RefreshUserFromDiscord($discordId: String!) {
		refreshUserFromDiscord(discordId: $discordId) {
			id
			username
			avatar
			email
		}
	}
`;

export const UPDATE_USER = gql`
	mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
		updateUser(id: $id, input: $input) {
			id
			discordId
			username
			email
			avatar
			role
			createdAt
			updatedAt
			data {
			  firstName
			  lastName
			  alias
			  balance
			  maxBalance
			  isOnline
			  manageTablet
			  tabletUsername
			  phone
			}
		}
	}
`;
