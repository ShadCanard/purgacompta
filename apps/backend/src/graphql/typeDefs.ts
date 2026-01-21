export const typeDefs = `#graphql
  # Enum pour les rôles utilisateur
  enum UserRole {
    GUEST
    MEMBER
    MANAGER
    ADMIN
    OWNER
  }

  # Type User
  type User {
    id: ID!
    discordId: String!
    username: String!
    name: String!
    email: String
    avatar: String
    role: UserRole!
    createdAt: String!
    updatedAt: String!
  }

  # Input pour l'enregistrement/mise à jour d'un utilisateur
  input RegisterUserInput {
    discordId: String!
    username: String!
    name: String
    email: String
    avatar: String
  }

  input UpdateUserNameInput {
    discordId: String!
    name: String!
  }

  # Input pour la mise à jour du rôle
  input UpdateUserRoleInput {
    discordId: String!
    role: UserRole!
  }

  # Queries
  type Query {
    # Récupérer l'utilisateur authentifié
    me: User

    # Récupérer un utilisateur par son Discord ID
    user(discordId: String!): User
    
    # Récupérer un utilisateur par son ID
    userById(id: ID!): User
    
    # Récupérer tous les utilisateurs (admin only)
    users: [User!]!
    
    # Récupérer le nombre d'utilisateurs
    usersCount: Int!
  }

  # Mutations
  type Mutation {
    # Enregistrer ou mettre à jour un utilisateur (appelé lors de la connexion)
    registerOrUpdateUser(input: RegisterUserInput!): User!

    # Mettre à jour le rôle d'un utilisateur (admin only)
    updateUserRole(input: UpdateUserRoleInput!): User!

    # Mettre à jour le nom affiché d'un utilisateur (admin only)
    updateUserName(input: UpdateUserNameInput!): User!

    # Supprimer un utilisateur (owner only)
    deleteUser(discordId: String!): Boolean!
  }
`;
