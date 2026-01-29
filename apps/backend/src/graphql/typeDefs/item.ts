export const itemTypeDefs = `#graphql
  type Item {
    id: ID!
    name: String!
    weight: Float!
    createdAt: String!
    updatedAt: String!
    sellable: Boolean!
    weapon: Boolean!
  }

  input CreateItemInput {
    name: String!
    weight: Float!
    sellable: Boolean!
    weapon: Boolean!
  }

  input UpdateItemInput {
    id: ID!
    name: String
    weight: Float
    sellable: Boolean
    weapon: Boolean
  }
`;
