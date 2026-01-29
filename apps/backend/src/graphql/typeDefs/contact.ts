export const contactTypeDefs = `#graphql
  type Contact {
    id: ID!
    name: String!
    phone: String!
    group: Group
    groupid: ID
    createdAt: String!
    updatedAt: String!
    notes: String
  }

  input CreateContactInput {
    name: String!
    phone: String!
    groupId: ID
    notes: String
  }

  input UpdateContactInput {
    id: ID!
    name: String
    phone: String
    groupId: ID
    notes: String
  }

  input ImportContactInput {
    display: String!
    number: String!
  }
`;
