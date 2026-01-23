import { gql } from "@apollo/client";


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