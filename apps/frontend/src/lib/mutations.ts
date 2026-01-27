import { gql } from "@apollo/client";

// VehicleUser

export const SET_VEHICLE_USER = gql`
  mutation setVehicleUser($input: SetVehicleUserInput!) {
    setVehicleUser(input: $input) {
      id
      found
      vehicle { id name front back }
      user { id name username discordId }
    }
  }
`;

export const DELETE_VEHICLE_USER = gql`
  mutation DeleteVehicleUser($id: ID!) {
    deleteVehicleUser(id: $id)
  }
`;
export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`;
export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
      sourceGroup { id name }
      targetGroup { id name }
      targetContact { id name }
      blanchimentPercent
      amountToBring
      blanchimentAmount
      totalFinal
      createdAt
      lines {
        id
        item { id name }
        quantity
        unitPrice
      }
    }
  }
`;

export const UPDATE_ITEM_PRICE = gql`
  mutation UpdateItemPrice($input: UpdateItemPriceInput!) {
    updateItemPrice(input: $input) {
      id
      price
      item { id name }
      group { id name }
      createdAt
      updatedAt
      onSell
      buying
    }
  }
`;

export const CREATE_ITEM_PRICE = gql`
  mutation CreateItemPrice($input: CreateItemPriceInput!) {
    createItemPrice(input: $input) {
      id
      price
      item { id name }
      group { id name }
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_ITEM_PRICE = gql`
  mutation DeleteItemPrice($id: ID!) {
    deleteItemPrice(id: $id)
  }
`;

export const IMPORT_CONTACTS = gql`
    mutation ImportContacts($input: [ImportContactInput!]!) {
      importContacts(input: $input) {
        id
        name
        phone
        createdAt
        updatedAt
      }
    }
`;
export const CREATE_CONTACT = gql`
  mutation CreateContact($input: CreateContactInput!) {
    createContact(input: $input) {
      id
      name
      phone
      group { id name }
    }
  }
`;

export const UPDATE_CONTACT = gql`
  mutation UpdateContact($input: UpdateContactInput!) {
    updateContact(input: $input) {
      id
      name
      phone
      group { id name }
    }
  }
`;

export const UPDATE_GROUP_IS_ACTIVE = gql`
    mutation UpdateGroupIsActive($id: ID!, $isActive: Boolean!) {
        updateGroupIsActive(input: { id: $id, isActive: $isActive }) {
        id
        isActive
        }
    }
`;

export const CREATE_GROUP = gql`
  mutation CreateGroup($name: String!, $tag: String, $description: String, $isActive: Boolean, $color1: String, $color2: String) {
    createGroup(name: $name, tag: $tag, description: $description, isActive: $isActive, color1: $color1, color2: $color2) {
      id
      name
      tag
      description
      isActive
      color1
      color2
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_GROUP = gql`
  mutation UpdateGroup($id: ID!, $name: String, $tag: String, $description: String, $isActive: Boolean, $color1: String, $color2: String) {
    updateGroup(input: { id: $id, name: $name, tag: $tag, description: $description, isActive: $isActive, color1: $color1, color2: $color2 }) {
      id
      name
      tag
      description
      isActive
      updatedAt
      color1
      color2
    }
  }
`;

export const DELETE_GROUP = gql`
    mutation DeleteGroup($id: ID!) {
      deleteGroup(id: $id)
    }
`;

export const CREATE_ITEM = gql`
  mutation CreateItem($input: CreateItemInput!) {
    createItem(input: $input) {
      id
      name
      weight
      sellable
      weapon
    }
  }
`;

export const UPDATE_ITEM = gql`
  mutation UpdateItem($input: UpdateItemInput!) {
    updateItem(input: $input) {
      id
      name
      weight
      sellable
      weapon
    }
  }
`;

export const DELETE_ITEM = gql`
  mutation DeleteItem($id: ID!) {
    deleteItem(id: $id)
  }
`;

export const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($input: UpdateUserRoleInput!) {
    updateUserRole(input: $input) {
      id
      discordId
      username
      avatar
      role
    }
  }
`;

export const UPDATE_USER_NAME = gql`
  mutation UpdateUserName($input: UpdateUserNameInput!) {
    updateUserName(input: $input) {
      id
      discordId
      username
      name
      avatar
      role
    }
  }
`;

export const UPDATE_USER_PHONE = gql`
  mutation UpdateUserPhone($input: UpdateUserPhoneInput!) {
    updateUserPhone(input: $input) {
      discordId
      phone
    }
  }
`;

export const UPDATE_USER_ONLINE = gql`
  mutation UpdateUserOnline($discordId: String!, $isOnline: Boolean!) {
    updateUserOnline(discordId: $discordId, isOnline: $isOnline) {
      id
      discordId
      isOnline
    }
  }
`;

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
