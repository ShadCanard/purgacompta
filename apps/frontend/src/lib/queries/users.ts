import { gql } from "@apollo/client";

// Toujours placer ce fragment en tout premier
export const USER_FRAGMENT = gql`
  fragment UserFields on User {
    id
    username
    email
    avatar
    role
    createdAt
    updatedAt
    data {
      firstName
      lastName
      alias
      balance
      maxBalance
      isOnline
      manageTablet
      tabletUsername
      phone
    }
  }
`;

export const GET_CURRENT_USER = gql`
  query GetCurrentUser($discordId: String!) {
    user(discordId: $discordId) {
      ...UserFields
      discordId
    }
  }
  ${USER_FRAGMENT}
`;

export const GET_MEMBERS = gql`
  query Members {
    users {
      ...UserFields
      discordId
    }
  }
  ${USER_FRAGMENT}
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    userById(id: $id) {
      ...UserFields
      discordId
    }
  }
  ${USER_FRAGMENT}
`;