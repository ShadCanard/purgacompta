export const groupTypeDefs = `#graphql
  type Group {
    id: ID!
    name: String!
    tag: String
    description: String
    color1: String
    color2: String
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  input UpdateGroupInput {
    id: ID!
    name: String
    tag: String
    description: String
    color1: String
    color2: String
    isActive: Boolean
  }
`;
