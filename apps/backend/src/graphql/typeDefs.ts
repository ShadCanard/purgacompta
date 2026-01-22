export const typeDefs = `#graphql
  # Enum pour les rôles utilisateur
  enum UserRole {
    GUEST
    MEMBER
    MANAGER
    ADMIN
    OWNER
  }




  # Type Contact
  type Contact {
    id: ID!
    name: String!
    phone: String!
    group: Group
    createdAt: String!
    updatedAt: String!
  }

  # Type Group
  type Group {
    id: ID!
    name: String!
    tag: String
    description: String
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }
  # Inputs pour Contact
  input CreateContactInput {
    name: String!
    phone: String!
    groupId: ID
  }

  input UpdateContactInput {
    id: ID!
    name: String
    phone: String
    groupId: ID
  }

  # Type Log
  type Log {
    id: ID!
    action: String!
    entity: String!
    entityId: String!
    user: User!
    diff: String
    createdAt: String!
  }

  # Type User
  type User {
    id: ID!
    discordId: String!
    username: String!
    name: String!
    email: String
    avatar: String
    balance: Int!
    isOnline: Boolean!
    maxBalance: Int!
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


  input LogFilterInput {
    action: String
    entity: String
    userId: String
    search: String
    from: String
    to: String
  }

    input UpdateGroupIsActiveInput {
    id: ID!
    isActive: Boolean!
  }

  # Queries
  type Query {
    # Contacts CRUD
    contacts: [Contact!]!
    contactById(id: ID!): Contact
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

    # Récupérer les logs (admin only)
    logs(filter: LogFilterInput, skip: Int, take: Int): [Log!]!

    # Récupérer la liste des groupes criminels
    groups: [Group!]!
    
    # Récupérer un groupe criminel par son ID
    groupById(id: ID!): Group!

    # Récupérer le nombre de groupes criminels
    groupsCount: Int!
  }

  # Mutations
  type Mutation {
    # Contacts CRUD
    createContact(input: CreateContactInput!): Contact!
    updateContact(input: UpdateContactInput!): Contact!
    deleteContact(id: ID!): Boolean!
    # Enregistrer ou mettre à jour un utilisateur (appelé lors de la connexion)
    registerOrUpdateUser(input: RegisterUserInput!): User!

    # Mettre à jour le rôle d'un utilisateur (admin only)
    updateUserRole(input: UpdateUserRoleInput!): User!

    # Mettre à jour le nom affiché d'un utilisateur (admin only)
    updateUserName(input: UpdateUserNameInput!): User!

    # Mettre à jour le statut en ligne d'un utilisateur
    updateUserOnline(discordId: String!, isOnline: Boolean!): User!

    # Supprimer un utilisateur (owner only)
    deleteUser(discordId: String!): Boolean!

    # Créer un groupe criminel
    createGroup(name: String!, tag: String, description: String): Group!

    # Modifier l'état d'activité d'un groupe
    updateGroupIsActive(input: UpdateGroupIsActiveInput!): Group!
  }
`;
