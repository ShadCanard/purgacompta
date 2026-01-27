import { gql } from "@apollo/client";


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
