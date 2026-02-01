export const GET_STORAGE_ITEMS_BY_LOCATION_IDS = gql`
  query StorageItemsByStorageLocationIds($storageLocationIds: [ID!]!) {
    storageItemsByStorageLocationIds(storageLocationIds: $storageLocationIds) {
      id
      quantity
      minQuantity
      storage {
        id
        name
        storageLocation {
          name
        }
        storageLocation {
          name
        }
      }
      item {
        id
        name
        weight
      }
    }
  }
`;
import { gql } from "@apollo/client";

export const GET_STORAGE_LOCATIONS = gql`
  query GetStorageLocations {
    storageLocations {
      id
      name
      createdAt
      updatedAt
      storages {
        id
        name
      }
    }
  }
`;

export const GET_STORAGE_LOCATION_BY_ID = gql`
  query GetStorageLocationById($id: ID!) {
    storageLocationById(id: $id) {
      id
      name
      createdAt
      updatedAt
      storages {
        id
        name
      }
    }
  }
`;
