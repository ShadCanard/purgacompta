import { gql } from "@apollo/client";

export const GET_STORAGES_BY_STORAGE_LOCATION_ID = gql`
  query StoragesByStorageLocationId($storageLocationId: ID!) {
    storagesByStorageLocationId(storageLocationId: $storageLocationId) {
      id
      name
      type
      maxWeight
    }
  }
`;
// Stockages
export const GET_STORAGES = gql`
  query Storages {
    storages {
      id
      name
      type
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
