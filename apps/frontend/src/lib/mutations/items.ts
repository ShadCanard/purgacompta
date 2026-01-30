import { gql } from "@apollo/client";

export const CREATE_ITEM = gql`
	mutation CreateItem($input: CreateItemInput!) {
		createItem(input: $input) {
			id
			name
			weight
			sellable
			weapon
		}
	}
`;

export const UPDATE_ITEM = gql`
	mutation UpdateItem($input: UpdateItemInput!) {
		updateItem(input: $input) {
			id
			name
			weight
			sellable
			weapon
		}
	}
`;

export const DELETE_ITEM = gql`
	mutation DeleteItem($id: ID!) {
		deleteItem(id: $id)
	}
`;
