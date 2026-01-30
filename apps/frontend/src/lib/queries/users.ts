import { gql } from "@apollo/client";


export const GET_CURRENT_USER = gql`
  query GetCurrentUser($discordId: String!) {
    user(discordId: $discordId) {
      id
      discordId
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
  }
`;

export const GET_MEMBERS = gql`
  query Members {
    users {
      id
      username
      discordId
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
  }
`;