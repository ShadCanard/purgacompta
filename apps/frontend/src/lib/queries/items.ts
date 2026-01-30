import { gql } from "@apollo/client";

export const GET_ITEMS = gql`
  query Items {
    items {
      id
      name
      weight
      weapon
      sellable
    }
  }
`;