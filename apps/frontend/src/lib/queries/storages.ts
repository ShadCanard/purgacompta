import { gql } from "@apollo/client";

// Stockages
export const GET_STORAGES = gql`
  query Storages {
    storages {
      id
      name
      type
      location
      maxWeight
      createdAt
      updatedAt
      items {
        id
        quantity
        item {
          id
          name
          weight
          weapon
        }
      }
    }
  }
`;

export const GET_STORAGE_BY_ID = gql`
  query StorageById($id: ID!) {
    storageById(id: $id) {
      id
      name
      type
      location
      maxWeight
      createdAt
      updatedAt
      items {
        id
        quantity
        item {
          id
          name
          weight
          weapon
        }
      }
    }
  }
`;
