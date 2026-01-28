import { gql } from "@apollo/client";

export const GET_SETTINGS = gql`
  query GetSettings {
    settings {
      id
      name
      value
    }
  }
`;
// VehicleUser
export const GET_VEHICLE_USERS = gql`
  query VehicleUsers {
    vehicleUsers {
      id
      found
      vehicle { id name front back }
      user { id name username discordId }
    }
  }
`;

export const GET_VEHICLE_USER_BY_ID = gql`
  query VehicleUserById($id: ID!) {
    vehicleUserById(id: $id) {
      id
      found
      vehicle { id name front back }
      user { id name username discordId }
    }
  }
`;

export const GET_VEHICLE_USERS_BY_VEHICLE = gql`
  query VehicleUsersByVehicle($vehicleId: ID!) {
    vehicleUsersByVehicle(vehicleId: $vehicleId) {
      id
      found
      user { id name username discordId }
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

export const GET_TRANSACTIONS_BY_ENTITY = gql`
  query GetTransactionsByEntity($entityId: ID!) {
    transactionsByEntity(entityId: $entityId) {
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
export const GET_TRANSACTIONS = gql`
  query GetTransactions {
    transactions {
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
// Récupère les groupes et les contacts sans groupe (pour transactions)
export const GET_CONTACTS_OR_GROUPS_TRANSACTION = gql`
  query ContactsOrGroupsTransaction {
    groups {
      id
      name
    }
    contactsWithoutGroup {
      id
      name
    }
  }
`;

export const GET_ITEM_PRICES = gql`
  query ItemPrices {
    itemPrices {
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

export const GET_CURRENT_USER = gql`
  query GetCurrentUser($discordId: String!) {
    user(discordId: $discordId) {
      id
      discordId
      username
      name
      email
      avatar
      role
      createdAt
      updatedAt
      isOnline
      balance
      maxBalance
      data
    }
  }
`;
export const GET_ITEM_PRICES_BY_GROUP = gql`
  query ItemPricesByGroup($groupId: ID!) {
    itemPricesByGroup(groupId: $groupId) {
      id
      price
      item { id name }
      group { id name }
      targetId
      createdAt
      updatedAt
      onSell
      buying
    }
  }
`;

export const GET_PURGATORY = gql`
  query MyGroup {
    myGroup { id name color1 color2 tag description }
  }
`;

export const GET_ITEMS = gql`
  query Items {
    items {
      id
      name
      weight
      weapon
      sellable
    }
  }
`;

export const GET_GROUPS = gql`
    query Groups {
      groups {
        id
        name
        tag
        description
        isActive
        createdAt
        updatedAt
        color1
        color2
      }
    }
  `;

export const GET_CONTACTS = gql`
  query Contacts {
    contacts {
      id
      name
      phone
      groupid
      group {
        id
        name
      }
    }
  }
`;
export const GET_CONTACTS_WITHOUT_GROUP = gql`
  query ContactsWithoutGroup {
    contactsWithoutGroup {
      id
      name
      phone
    }
  }
`;


export const GET_ITEM_PRICES_BY_TARGET = gql`
  query ItemPricesByTarget($targetId: ID) {
    itemPricesByTarget(targetId: $targetId) {
      id
      price
      item { id name }
      targetId
      buying
    }
  }
`;

export const GET_MEMBERS = gql`
  query Members {
    users {
      id
      username
      discordId
      name
      email
      avatar
      role
      phone
      createdAt
      updatedAt
      isOnline
      balance
      maxBalance
      data
    }
  }
`;

export const GET_LOGS = gql`
  query Logs($filter: LogFilterInput, $skip: Int, $take: Int) {
    logs(filter: $filter, skip: $skip, take: $take) {
      id
      action
      entity
      entityId
      diff
      createdAt
      user {
        id
        name
        role
      }
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