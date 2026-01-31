import { gql } from "@apollo/client";

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



export const CREATE_VEHICLE_TRANSACTION = gql`
  mutation CreateVehicleTransaction($input: VehicleTransactionInput!) {
    createVehicleTransaction(input: $input) {
      id
      vehicleUserId
      targetId
      rewardAmount
      isMoney
      isDirtyMoney
      itemId
      createdAt
    }
  }
`;

export const UPDATE_VEHICLE_TRANSACTION = gql`
  mutation UpdateVehicleTransaction($id: ID!, $input: VehicleTransactionInput!) {
    updateVehicleTransaction(id: $id, input: $input) {
      id
      vehicleId
      targetId
      rewardAmount
      isMoney
      isDirtyMoney
      itemId
      createdAt
    }
  }
`;

export const DELETE_VEHICLE_TRANSACTION = gql`
  mutation DeleteVehicleTransaction($id: ID!) {
    deleteVehicleTransaction(id: $id)
  }
`;
