export const storageTypeDefs = `#graphql
  enum StorageType {
    ARMURERIE
    STOCKAGE
  }

  type Storage {
    id: ID!
    name: String!
    type: StorageType!
    location: String!
    maxWeight: Float
    createdAt: String!
    updatedAt: String!
    items: [StorageItem!]!
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
    location: String!
    maxWeight: Float
  }

  input UpdateStorageInput {
    storageId: ID!
    itemId: ID!
    quantity: Int!
  }
`;
