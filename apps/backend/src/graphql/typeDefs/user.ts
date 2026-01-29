export const userTypeDefs = `#graphql
  enum UserRole {
    GUEST
    MEMBER
    MANAGER
    ADMIN
    OWNER
  }

  type User {
    id: ID!
    discordId: String!
    username: String!
    name: String!
    email: String
    avatar: String
    balance: Int!
    phone: String
    isOnline: Boolean!
    maxBalance: Int!
    role: UserRole!
    createdAt: String!
    updatedAt: String!
    vehicleUsers: [VehicleUser!]!
    data: String
  }

  input RegisterUserInput {
    discordId: String!
    username: String!
    name: String
    email: String
    avatar: String
    phone: String
  }

  input UpdateUserInput {
    username: String
    name: String
    email: String
    avatar: String
    isOnline: Boolean
    balance: Int
    maxBalance: Int
    role: UserRole
    phone: String
    data: String
  }
`;
