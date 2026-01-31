export const userAccountHistoryTypeDefs = `#graphql
  type UserAccountHistory {
    id: ID!
    userId: String!
    amount: Float!
    createdAt: String!
    notes: String
    user: User!
  }

  input UserAccountHistoryInput {
    userId: String!
    amount: Float!
    notes: String
  }

  type Query {
    userAccountHistories: [UserAccountHistory!]!
    userAccountHistory(id: ID!): UserAccountHistory
    userAccountHistoriesByUser(userId: ID!): [UserAccountHistory!]!
  }

  type Mutation {
    createUserAccountHistory(input: UserAccountHistoryInput!): UserAccountHistory!
    updateUserAccountHistory(id: ID!, input: UserAccountHistoryInput!): UserAccountHistory!
    deleteUserAccountHistory(id: ID!): Boolean!
  }
`;
