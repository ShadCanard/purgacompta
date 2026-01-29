export const vehicleTypeDefs = `#graphql
  type Vehicle {
    id: ID!
    name: String!
    front: String!
    back: String!
    vehicleUsers: [VehicleUser!]!
  }

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

  input CreateVehicleInput {
    name: String!
    front: String!
    back: String!
  }

  input UpdateVehicleInput {
    id: ID!
    name: String
    front: String
    back: String
  }
`;
