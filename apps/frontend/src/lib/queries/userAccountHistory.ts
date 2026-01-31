import { gql } from "@apollo/client";
import { USER_FRAGMENT } from "./users";

export const ACCOUNT_HISTORY_FRAGMENT = gql`
  fragment AccountFields on UserAccountHistory {
    id
    userId
    amount
    createdAt
    notes
    user { ...UserFields }
  }
  ${USER_FRAGMENT}
`;

export const GET_USER_ACCOUNT_HISTORIES = gql`
  query UserAccountHistories {
    userAccountHistories {
      ...AccountFields
    }
  }
  ${ACCOUNT_HISTORY_FRAGMENT}
`;

export const GET_USER_ACCOUNT_HISTORY = gql`
  query UserAccountHistory($id: ID!) {
    userAccountHistory(id: $id) {
      ...AccountFields
    }
  }
  ${ACCOUNT_HISTORY_FRAGMENT}
`;

export const GET_USER_ACCOUNT_HISTORIES_BY_USER = gql`
  query UserAccountHistoriesByUser($userId: ID!) {
    userAccountHistoriesByUser(userId: $userId) {
      ...AccountFields
    }
  }
  ${ACCOUNT_HISTORY_FRAGMENT}
`;
