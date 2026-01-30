import { gql } from "@apollo/client";

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
