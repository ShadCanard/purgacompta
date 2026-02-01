import { gql } from "@apollo/client";

export const UPDATE_STORAGE_ITEM = gql`
  mutation UpdateStorageItem($input: UpdateStorageItemInput!) {
    updateStorageItem(input: $input) {
      id
      quantity
      minQuantity
      item {
        id
        name
        weight
        weapon
      }
      storage {
        id
        name
      }
    }
  }
`;

// Stockages
export const CREATE_STORAGE = gql`
  mutation CreateStorage($input: CreateStorageInput!) {
    createStorage(input: $input) {
      id
      name
      type
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
      name
      type
      maxWeight
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_STORAGE_CONTENT = gql`
    mutation UpdateStorageContent($input: UpdateStorageContentInput!) {
        updateStorageContent(input: $input) {
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


export const CREATE_STORAGE_LOCATION = gql`
  mutation CreateStorageLocation($input: CreateStorageLocationInput!) {
    createStorageLocation(input: $input) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_STORAGE_LOCATION = gql`
  mutation UpdateStorageLocation($id: ID!, $input: CreateStorageLocationInput!) {
    updateStorageLocation(id: $id, input: $input) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;