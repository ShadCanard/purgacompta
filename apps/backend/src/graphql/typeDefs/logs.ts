export const logTypeDefs = `#graphql
  type Log {
    id: ID!
    action: String!
    entity: String!
    entityId: String!
    user: User!
    diff: String
    createdAt: String!
  }

  input LogFilterInput {
    action: String
    entity: String
    userId: String
    search: String
    from: String
    to: String
  }
`;
