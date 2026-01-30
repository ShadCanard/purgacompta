import { gql } from "@apollo/client";

export const GET_VEHICLE_USERS = gql`
  query VehicleUsers {
    vehicleUsers {
      id
      found
      vehicle { id name front back }
      user { id username discordId data { firstName lastName alias } }
    }
  }
`;

export const GET_VEHICLE_USER_BY_ID = gql`
  query VehicleUserById($id: ID!) {
    vehicleUserById(id: $id) {
      id
      found
      vehicle { id name front back }
      user { id username discordId data { firstName lastName alias } }
    }
  }
`;

export const GET_VEHICLE_USERS_BY_VEHICLE = gql`
  query VehicleUsersByVehicle($vehicleId: ID!) {
    vehicleUsersByVehicle(vehicleId: $vehicleId) {
      id
      found
      user { id username discordId data { firstName lastName alias } }
    }
  }
`;

export const GET_VEHICLE_USERS_BY_USER = gql`
  query VehicleUsersByUser($userId: ID!) {
    vehicleUsersByUser(userId: $userId) {
      id
      found
      vehicle { id name front back }
    }
  }
`;

export const GET_VEHICLES = gql`
  query Vehicles {
    vehicles {
      id
      name
      front
      back
    }
  }
`;

export const GET_VEHICLE = gql`
  query VehicleById($id: ID!) {
    vehicleById(id: $id) {
      id
      name
      front
      back
    }
  }
`;

export const GET_VEHICLE_TRANSACTIONS = gql`
  query VehicleTransactions {
    vehicleTransactions {
      id
      vehicleId
      targetId
      rewardAmount
      isMoney
      isDirtyMoney
      itemId
      createdAt
      vehicle { id name }
      item { id name }
    }
  }
`;

export const GET_VEHICLE_TRANSACTION = gql`
  query VehicleTransaction($id: ID!) {
    vehicleTransaction(id: $id) {
      id
      vehicleId
      targetId
      rewardAmount
      isMoney
      isDirtyMoney
      itemId
      createdAt
      vehicle { id name }
      item { id name }
    }
  }
`;
