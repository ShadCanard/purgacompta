export const vehicleTransactionTypeDefs = `#graphql
  type VehicleTransaction {
    id: ID!
    targetGroup: Group
    targetContact: Contact
    rewardAmount: Float!
    isMoney: Boolean!
    isDirtyMoney: Boolean!
    itemId: String
    createdAt: String!
    vehicle: Vehicle!
    item: Item
  }

  input VehicleTransactionInput {
    vehicleUserId: String!
    targetId: String!
    rewardAmount: Float!
    isMoney: Boolean!
    isDirtyMoney: Boolean!
    itemId: String
  }

  type Query {
    vehicleTransactions: [VehicleTransaction!]!
    vehicleTransaction(id: ID!): VehicleTransaction
    vehicleTransactionsByTarget(targetId: ID!): [VehicleTransaction!]!
  }

  type Mutation {
    createVehicleTransaction(input: VehicleTransactionInput!): VehicleTransaction!
    updateVehicleTransaction(id: ID!, input: VehicleTransactionInput!): VehicleTransaction!
    deleteVehicleTransaction(id: ID!): Boolean!
  }
`;
