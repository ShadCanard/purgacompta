import { gql } from "@apollo/client";

// Stockages
export const CREATE_STORAGE = gql`
	mutation CreateStorage($input: CreateStorageInput!) {
		createStorage(input: $input) {
			id
			name
			type
			location
			maxWeight
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_STORAGE = gql`
	mutation UpdateStorage($input: UpdateStorageInput!) {
		updateStorage(input: $input) {
			id
			quantity
			storage {
				id
				name
			}
			item {
				id
				name
				weapon
			}
		}
	}
`;

export const UPDATE_CONTACTS_MASS = gql`
	mutation UpdateContactsMass($ids: [ID!]!, $groupId: ID!) {
		updateContactsMass(ids: $ids, groupId: $groupId) {
			id
			name
			phone
			group { id name }
		}
	}
`;

export const DELETE_CONTACTS_MASS = gql`
	mutation DeleteContactsMass($ids: [ID!]!) {
		deleteContactsMass(ids: $ids)
	}
`;

export const UPDATE_USER = gql`
	mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
		updateUser(id: $id, input: $input) {
			id
			discordId
			username
			name
			email
			avatar
			isOnline
			balance
			maxBalance
			role
			createdAt
			updatedAt
			phone
			data
		}
	}
`;

export const SET_VEHICLE_USER = gql`
	mutation setVehicleUser($input: SetVehicleUserInput!) {
		setVehicleUser(input: $input) {
			id
			found
			vehicle { id name front back }
			user { id name username discordId }
		}
	}
`;

export const DELETE_VEHICLE_USER = gql`
	mutation DeleteVehicleUser($id: ID!) {
		deleteVehicleUser(id: $id)
	}
`;
export const DELETE_TRANSACTION = gql`
	mutation DeleteTransaction($id: ID!) {
		deleteTransaction(id: $id)
	}
`;
export const CREATE_TRANSACTION = gql`
	mutation CreateTransaction($input: CreateTransactionInput!) {
		createTransaction(input: $input) {
			id
			sourceGroup { id name }
			targetGroup { id name }
			targetContact { id name }
			blanchimentPercent
			amountToBring
			blanchimentAmount
			totalFinal
			createdAt
			lines {
				id
				item { id name }
				quantity
				unitPrice
			}
		}
	}
`;

export const UPDATE_ITEM_PRICE = gql`
	mutation UpdateItemPrice($input: UpdateItemPriceInput!) {
		updateItemPrice(input: $input) {
			id
			price
			item { id name }
			group { id name }
			createdAt
			updatedAt
			onSell
			buying
		}
	}
`;

export const CREATE_ITEM_PRICE = gql`
	mutation CreateItemPrice($input: CreateItemPriceInput!) {
		createItemPrice(input: $input) {
			id
			price
			item { id name }
			group { id name }
			createdAt
			updatedAt
		}
	}
`;

export const DELETE_ITEM_PRICE = gql`
	mutation DeleteItemPrice($id: ID!) {
		deleteItemPrice(id: $id)
	}
`;

export const IMPORT_CONTACTS = gql`
		mutation ImportContacts($input: [ImportContactInput!]!) {
			importContacts(input: $input) {
				id
				name
				phone
				createdAt
				updatedAt
			}
		}
`;
export const CREATE_CONTACT = gql`
	mutation CreateContact($input: CreateContactInput!) {
		createContact(input: $input) {
			id
			name
			phone
			group { id name }
		}
	}
`;

export const UPDATE_CONTACT = gql`
	mutation UpdateContact($input: UpdateContactInput!) {
		updateContact(input: $input) {
			id
			name
			phone
			group { id name }
		}
	}
`;

export const UPDATE_GROUP_IS_ACTIVE = gql`
		mutation UpdateGroupIsActive($id: ID!, $isActive: Boolean!) {
				updateGroupIsActive(input: { id: $id, isActive: $isActive }) {
				id
				isActive
				}
		}
`;

export const CREATE_GROUP = gql`
	mutation CreateGroup($name: String!, $tag: String, $description: String, $isActive: Boolean, $color1: String, $color2: String) {
		createGroup(name: $name, tag: $tag, description: $description, isActive: $isActive, color1: $color1, color2: $color2) {
			id
			name
			tag
			description
			isActive
			color1
			color2
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_GROUP = gql`
	mutation UpdateGroup($id: ID!, $name: String, $tag: String, $description: String, $isActive: Boolean, $color1: String, $color2: String) {
		updateGroup(input: { id: $id, name: $name, tag: $tag, description: $description, isActive: $isActive, color1: $color1, color2: $color2 }) {
			id
			name
			tag
			description
			isActive
			updatedAt
			color1
			color2
		}
	}
`;

export const DELETE_GROUP = gql`
		mutation DeleteGroup($id: ID!) {
			deleteGroup(id: $id)
		}
`;

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





export const CREATE_VEHICLE = gql`
	mutation CreateVehicle($input: CreateVehicleInput!) {
		createVehicle(input: $input) {
			id
			name
			front
			back
		}
	}
`;

export const UPDATE_VEHICLE = gql`
	mutation UpdateVehicle($input: UpdateVehicleInput!) {
		updateVehicle(input: $input) {
			id
			name
			front
			back
		}
	}
`;

export const DELETE_VEHICLE = gql`
	mutation DeleteVehicle($id: ID!) {
		deleteVehicle(id: $id)
	}
`;

export const UPDATE_DISCORD_USER = gql`
	mutation RefreshUserFromDiscord($discordId: String!) {
		refreshUserFromDiscord(discordId: $discordId) {
			id
			username
			avatar
			email
			name
		}
	}
`;

export const DELETE_CONTACT = gql`
	mutation DeleteContact($id: ID!) {
	deleteContact(id: $id)
	}
`;