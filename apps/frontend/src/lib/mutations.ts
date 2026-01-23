import { gql } from "@apollo/client";

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

export const UPDATE_GROUP_IS_ACTIVE = gql`
    mutation UpdateGroupIsActive($id: ID!, $isActive: Boolean!) {
        updateGroupIsActive(input: { id: $id, isActive: $isActive }) {
        id
        isActive
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

export const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($input: UpdateUserRoleInput!) {
    updateUserRole(input: $input) {
      id
      discordId
      username
      avatar
      role
    }
  }
`;

export const UPDATE_USER_NAME = gql`
  mutation UpdateUserName($input: UpdateUserNameInput!) {
    updateUserName(input: $input) {
      id
      discordId
      username
      name
      avatar
      role
    }
  }
`;