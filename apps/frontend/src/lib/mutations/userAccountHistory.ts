import { gql } from "@apollo/client";

export const CREATE_USER_ACCOUNT_HISTORY = gql`
  mutation CreateUserAccountHistory($input: UserAccountHistoryInput!) {
    createUserAccountHistory(input: $input) {
      id
      userId
      amount
      createdAt
      notes
    }
  }
`;

export const UPDATE_USER_ACCOUNT_HISTORY = gql`
  mutation UpdateUserAccountHistory($id: ID!, $input: UserAccountHistoryInput!) {
    updateUserAccountHistory(id: $id, input: $input) {
      id
      userId
      amount
      createdAt
      notes
    }
  }
`;

export const DELETE_USER_ACCOUNT_HISTORY = gql`
  mutation DeleteUserAccountHistory($id: ID!) {
    deleteUserAccountHistory(id: $id)
  }
`;
