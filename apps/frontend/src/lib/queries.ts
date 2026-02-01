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
