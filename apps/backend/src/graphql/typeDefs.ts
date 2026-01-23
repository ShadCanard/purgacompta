export const typeDefs = `#graphql
  # Enum pour les rôles utilisateur
  enum UserRole {
    GUEST
    MEMBER
    MANAGER
    ADMIN
    OWNER
  }

  input ImportContactInput {
    display: String!
    number: String!
  }

  # Type Item (objet en jeu)
  type Item {
    id: ID!
    name: String!
    weight: Float!
    createdAt: String!
    updatedAt: String!
  }

  input CreateItemInput {
    name: String!
    weight: Float!
  }

  input UpdateItemInput {
    id: ID!
    name: String
    weight: Float
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
    color1: String
    color2: String
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

  input UpdateGroupInput {
    id: ID!
    name: String
    tag: String
    description: String
    color1: String
    color2: String
    isActive: Boolean
  }
  
  # Type ItemPrice (prix d'un objet pour un groupe)
  type ItemPrice {
    id: ID!
    item: Item!
    group: Group!
    price: Float!
    createdAt: String!
    updatedAt: String!
  }

  input CreateItemPriceInput {
    itemId: ID!
    groupId: ID!
    price: Float!
  }

  input UpdateItemPriceInput {
    id: ID!
    price: Float
  }

  # Queries
  type Query {

    # ItemPrice CRUD
    itemPrices: [ItemPrice!]!
    itemPriceById(id: ID!): ItemPrice
    itemPricesByItem(itemId: ID!): [ItemPrice!]!
    itemPricesByGroup(groupId: ID!): [ItemPrice!]!

    # Objets CRUD
    items: [Item!]!
    itemById(id: ID!): Item

    # Contacts CRUD
    contacts: [Contact!]!
    contactById(id: ID!): Contact
    # Récupérer l'utilisateur authentifié
    me: User

    # Récupérer le groupe 'Purgatory'
    myGroup: Group

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

    # ItemPrice CRUD
    createItemPrice(input: CreateItemPriceInput!): ItemPrice!
    updateItemPrice(input: UpdateItemPriceInput!): ItemPrice!
    deleteItemPrice(id: ID!): Boolean!

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
    createGroup(name: String!, tag: String, description: String, color1: String, color2: String): Group!

    # Modifier un groupe (tous champs)
    updateGroup(input: UpdateGroupInput!): Group!

    # Supprimer un groupe criminel
    deleteGroup(id: ID!): Boolean!

    # Importer des contacts (ignore ceux déjà existants par numéro)
    importContacts(input: [ImportContactInput!]!): [Contact!]!
    # Objets CRUD
    createItem(input: CreateItemInput!): Item!
    updateItem(input: UpdateItemInput!): Item!
    deleteItem(id: ID!): Boolean!

  }
`;
