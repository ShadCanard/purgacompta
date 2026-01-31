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