import { gql } from "@apollo/client";

export const CREATE_VEHICLE = gql`
  mutation CreateVehicle($input: CreateVehicleInput!) {
    createVehicle(input: $input) {
      id
      name
      front
      back
    }
  }
`;

export const UPDATE_VEHICLE = gql`
  mutation UpdateVehicle($input: UpdateVehicleInput!) {
    updateVehicle(input: $input) {
      id
      name
      front
      back
    }
  }
`;

export const DELETE_VEHICLE = gql`
  mutation DeleteVehicle($id: ID!) {
    deleteVehicle(id: $id)
  }
`;

export const SET_VEHICLE_USER = gql`
  mutation setVehicleUser($input: SetVehicleUserInput!) {
    setVehicleUser(input: $input) {
      id
      found
      vehicle { id }
      user { id }
    }
  }
`;

export const DELETE_VEHICLE_USER = gql`
  mutation DeleteVehicleUser($id: ID!) {
    deleteVehicleUser(id: $id)
  }
`;

export const CREATE_VEHICLE_TRANSACTION = gql`
  mutation CreateVehicleTransaction($input: VehicleTransactionInput!) {
    createVehicleTransaction(input: $input) {
      id
      vehicleId
      targetId
      rewardAmount
      isMoney
      isDirtyMoney
      itemId
      createdAt
    }
  }
`;

export const UPDATE_VEHICLE_TRANSACTION = gql`
  mutation UpdateVehicleTransaction($id: ID!, $input: VehicleTransactionInput!) {
    updateVehicleTransaction(id: $id, input: $input) {
      id
      vehicleId
      targetId
      rewardAmount
      isMoney
      isDirtyMoney
      itemId
      createdAt
    }
  }
`;

export const DELETE_VEHICLE_TRANSACTION = gql`
  mutation DeleteVehicleTransaction($id: ID!) {
    deleteVehicleTransaction(id: $id)
  }
`;
