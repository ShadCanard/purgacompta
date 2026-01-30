import { gql } from "@apollo/client";
export const STORAGE_UPDATED = gql`
  subscription OnStorageUpdated {
    storageUpdated {
      storageId
    }
  }
`;

