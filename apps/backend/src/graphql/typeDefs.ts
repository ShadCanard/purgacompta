
export const typeDefs = `#graphql
  # Enum pour les rôles utilisateur
  enum UserRole {
    GUEST
    MEMBER
    MANAGER
    ADMIN
    OWNER
  }




  # Type Vehicle
  type Vehicle {
    id: ID!
    name: String!
    front: String!
    back: String!
    vehicleUsers: [VehicleUser!]!
  }

  # Type VehicleUser (liaison véhicule/utilisateur)
  type VehicleUser {
    id: ID!
    vehicle: Vehicle
    user: User!
    found: Boolean!
  }

  input SetVehicleUserInput {
    vehicleId: ID
    userId: ID!
    found: Boolean
  }

  input SetVehiculeUserFoundInput {
    id: ID!
    found: Boolean!
  }

  # Inputs pour Vehicle
  input CreateVehicleInput {
    name: String!
    front: String!
    back: String!
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

  input UpdateVehicleInput {
    id: ID!
    name: String
    front: String
    back: String
  }
  input ImportContactInput {
    display: String!
    number: String!
  }

  # Type Item (objet en jeu)

  # Subscription
  type Subscription {
    vehicleUserChanged: VehicleUser!
  }
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

  # Type Contact
  type Contact {
    id: ID!
    name: String!
    phone: String!
    group: Group
    createdAt: String!
    updatedAt: String!
    notes: String
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
    notes: String
  }

  input UpdateContactInput {
    id: ID!
    name: String
    phone: String
    groupId: ID
    notes: String
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
    phone: String
    isOnline: Boolean!
    maxBalance: Int!
    role: UserRole!
    createdAt: String!
    updatedAt: String!
    vehicleUsers: [VehicleUser!]!
    data: String
  }

  # Input pour l'enregistrement/mise à jour d'un utilisateur
  input RegisterUserInput {
    discordId: String!
    username: String!
    name: String
    email: String
    avatar: String
    phone: String
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
  
  # Type TransactionLine (ligne d'une transaction)
  type TransactionLine {
    id: ID!
    item: Item!
    quantity: Int!
    unitPrice: Float!
  }

  # Type Transaction
  type Transaction {
    id: ID!
    sourceGroup: Group
    targetGroup: Group
    targetContact: Contact
    blanchimentPercent: Int!
    amountToBring: Float!
    blanchimentAmount: Float!
    totalFinal: Float!
    createdAt: String!
    lines: [TransactionLine!]!
  }

  input TransactionLineInput {
    itemId: ID!
    quantity: Int!
    unitPrice: Float!
  }

  input CreateTransactionInput {
    sourceId: ID
    targetId: ID
    blanchimentPercent: Int!
    amountToBring: Float!
    blanchimentAmount: Float!
    totalFinal: Float!
    lines: [TransactionLineInput!]!
  }
  type ItemPrice {
    id: ID!
    item: Item!
    group: Group!
    targetId: ID
    targetGroup: Group
    targetContact: Contact
    price: Float!
    createdAt: String!
    updatedAt: String!
    onSell: Boolean!
    buying: Boolean!
  }

  input CreateItemPriceInput {
    itemId: ID!
    groupId: ID!
    targetId: ID
    price: Float!
    onSell: Boolean
    buying: Boolean
  }

  input UpdateItemPriceInput {
    id: ID!
    price: Float
    onSell: Boolean
    buying: Boolean
    targetId: ID
  }

  # Queries
  type Query {
    # VehicleUser
    vehicleUsers: [VehicleUser!]!
    vehicleUserById(id: ID!): VehicleUser
    vehicleUsersByVehicle(vehicleId: ID!): [VehicleUser!]!
    vehicleUsersByUser(userId: ID!): [VehicleUser!]!

    # ItemPrice CRUD
    itemPrices: [ItemPrice!]!
    itemPriceById(id: ID!): ItemPrice
    itemPricesByItem(itemId: ID!): [ItemPrice!]!
    itemPricesByGroup(groupId: ID!): [ItemPrice!]!
    itemPricesByTarget(targetId: ID): [ItemPrice!]!
    onSellitemPricesByGroup(groupId: ID!): [ItemPrice!]!

    # Vehicles CRUD
    vehicles: [Vehicle!]!
    vehicleById(id: ID!): Vehicle

    # Objets CRUD
    items: [Item!]!
    itemById(id: ID!): Item
    sellableItems: [Item!]!
    weaponItems: [Item!]!

    # Contacts CRUD
    contacts: [Contact!]!
    contactById(id: ID!): Contact
    contactsWithoutGroup: [Contact!]!
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

    # Transactions
    transactions: [Transaction!]!
    transactionById(id: ID!): Transaction
    transactionsByEntity(entityId: ID!): [Transaction!]!
  }

  # Mutations

  type Mutation {
    # VehicleUser
    setVehicleUser(input: SetVehicleUserInput!): VehicleUser
    setVehicleUserFound(input: SetVehiculeUserFoundInput!): VehicleUser!
    deleteVehicleUser(id: ID!): Boolean!
    # Transactions
    createTransaction(input: CreateTransactionInput!): Transaction!
    deleteTransaction(id: ID!): Boolean!

    # ItemPrice CRUD
    createItemPrice(input: CreateItemPriceInput!): ItemPrice!
    updateItemPrice(input: UpdateItemPriceInput!): ItemPrice!
    deleteItemPrice(id: ID!): Boolean!

    # Vehicles CRUD
    createVehicle(input: CreateVehicleInput!): Vehicle!
    updateVehicle(input: UpdateVehicleInput!): Vehicle!
    deleteVehicle(id: ID!): Boolean!

    # Contacts CRUD
    createContact(input: CreateContactInput!): Contact!
    updateContact(input: UpdateContactInput!): Contact!
    deleteContact(id: ID!): Boolean!
    # Enregistrer ou mettre à jour un utilisateur (appelé lors de la connexion)
    registerOrUpdateUser(input: RegisterUserInput!): User!

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

        # Mettre à jour tous les champs d'un utilisateur
    updateUser(id: ID!, input: UpdateUserInput!): User!
  }

  # Subscriptions
  type Subscription {
    userUpdated: User!
    tabletUpdated: VehicleUser!
  }
`;
