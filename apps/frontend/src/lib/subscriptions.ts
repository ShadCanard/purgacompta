
export const TABLET_UPDATED = gql`
  subscription OnTabletUpdated {
    tabletUpdated {
      id
      # Ajoutez ici les champs nécessaires selon le schéma backend
    }
  }
`;
import { gql } from "@apollo/client";
export const STORAGE_UPDATED = gql`
  subscription OnStorageUpdated {
    storageUpdated {
      storageId
    }
  }
`;


export const USER_UPDATED = gql`
  subscription OnUserUpdated {
    userUpdated {
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
