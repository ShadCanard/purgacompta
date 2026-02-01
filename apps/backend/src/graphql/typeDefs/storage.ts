export const storageTypeDefs = `#graphql
  enum StorageType {
    ARMORY
    STORAGE
    FRIDGE
  }

  input UpdateStorageItemInput {
    storageItemId: ID!
    quantity: Int
  }
  type Storage {
    id: ID!
    name: String!
    type: StorageType!
    maxWeight: Float
    createdAt: String!
    updatedAt: String!
    items: [StorageItem!]!
    storageLocation: StorageLocation
  }

  type StorageItem {
    id: ID!
    storage: Storage!
    item: Item!
    quantity: Int!
  }

  input CreateStorageInput {
    name: String!
    type: StorageType!
    maxWeight: Float
    storageLocationId: ID
  }

  input UpdateStorageInput {
    storageId: ID!
    name: String
    type: StorageType
    maxWeight: Float
    storageLocationId: ID
  }

  input UpdateStorageContentInput {
    storageId: ID!
    itemId: ID!
    quantity: Int!
  }
`;
