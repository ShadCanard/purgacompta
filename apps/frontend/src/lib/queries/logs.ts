import { gql } from "@apollo/client";

export const GET_LOGS = gql`
  query Logs($filter: LogFilterInput, $skip: Int, $take: Int) {
    logs(filter: $filter, skip: $skip, take: $take) {
      id
      action
      entity
      entityId
      diff
      createdAt
      user {
        id
        data {
          firstName
          lastName
          alias
        }
        role
      }
    }
  }
`;