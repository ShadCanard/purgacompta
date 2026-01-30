import { gql } from "@apollo/client";

export const GET_GROUPS = gql`
    query Groups {
      groups {
        id
        name
        tag
        description
        isActive
        createdAt
        updatedAt
        color1
        color2
      }
    }
  `;

export const GET_PURGATORY = gql`
  query MyGroup {
    myGroup { id name color1 color2 tag description }
  }
`;
