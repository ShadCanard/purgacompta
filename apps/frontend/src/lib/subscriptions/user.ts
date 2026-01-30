import { gql } from "@apollo/client";

export const USER_UPDATED = gql`
  subscription OnUserUpdated {
  userUpdated {
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