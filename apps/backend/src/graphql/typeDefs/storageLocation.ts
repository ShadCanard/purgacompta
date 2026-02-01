export const storageLocationTypeDefs = `#graphql
  type StorageLocation {
    id: ID!
    name: String!
    storages: [Storage!]!
    createdAt: String!
    updatedAt: String!
  }

    input CreateStorageLocationInput {
      name: String!
    }

    input UpdateStorageLocationInput {
    name: String
    }

`;
