import { gql } from "@apollo/client";

export const TABLET_UPDATED = gql`
  subscription OnTabletUpdated {
    tabletUpdated {
      id
      # Ajoutez ici les champs nécessaires selon le schéma backend
    }
  }
`;
