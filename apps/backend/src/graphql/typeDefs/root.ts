export const rootTypeDefs = `#graphql
  type Query {
    # StorageLocation
    storageLocations: [StorageLocation!]!
    storageLocationById(id: ID!): StorageLocation
    storagesByStorageLocationId(storageLocationId: ID!): [Storage!]!

    # Storage
    storages: [Storage!]!
    storageById(id: ID!): Storage
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
    # Récupérer la liste des groupes criminels
    groups: [Group!]!
    # Récupérer un groupe criminel par son ID
    groupById(id: ID!): Group
    # Récupérer le nombre de groupes criminels
    groupsCount: Int!
    # Transactions
    transactions: [Transaction!]!
    transactionById(id: ID!): Transaction
    transactionsByEntity(entityId: ID!): [Transaction!]!
    transactionDetailsList: [TransactionDetailsListItem!]!
  }

  type Mutation {
    # StorageLocation
    createStorageLocation(input: CreateStorageLocationInput!): StorageLocation!
    updateStorageLocation(id: ID!, input: UpdateStorageLocationInput!): StorageLocation!
    deleteStorageLocation(id: ID!): Boolean!
    # Storage
    createStorage(input: CreateStorageInput!): Storage!
    updateStorage(input: UpdateStorageInput!): Storage!

    updateStorageItem(input: UpdateStorageItemInput!): StorageItem!
    
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
    createGroup(name: String!, tag: String, description: String, color1: String, color2: String, isActive: Boolean): Group!
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

  type Subscription {
    userUpdated: User!
    tabletUpdated: VehicleUser!
    storageUpdated(storageId: ID): StorageUpdatedPayload!
    accountUpdated: UserAccountHistory!
  }

  type StorageUpdatedPayload {
    storageId: ID!
  }
`;
