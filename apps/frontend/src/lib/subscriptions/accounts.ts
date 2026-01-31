import { gql } from "@apollo/client";
import { ACCOUNT_HISTORY_FRAGMENT } from "../queries/userAccountHistory";

export const ACCOUNT_UPDATED = gql`
  subscription OnAccountUpdated {
    accountUpdated {
        ...AccountFields
    }
  }
  ${ACCOUNT_HISTORY_FRAGMENT}
`;
