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
    email: String
    avatar: String
    role: UserRole!
    createdAt: String!
    updatedAt: String!
    vehicleUsers: [VehicleUser!]!
    data: UserData
  }

  type UserData {
    firstName: String
    lastName: String
    alias: String
    balance: Int
    maxBalance: Int
    isOnline: Boolean
    manageTablet: Boolean
    tabletUsername: String
    phone: String
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
    data: InputUserData
  }

    input InputUserData {
    firstName: String
    lastName: String
    alias: String
    balance: Int
    maxBalance: Int
    isOnline: Boolean
    manageTablet: Boolean
    tabletUsername: String
    phone: String
    }
`;
