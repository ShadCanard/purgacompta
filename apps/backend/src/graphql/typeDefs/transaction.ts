export const transactionTypeDefs = `#graphql
  type TransactionLine {
    id: ID!
    item: Item!
    quantity: Int!
    unitPrice: Float!
  }

  type Transaction {
    id: ID!
    sourceGroup: Group
    targetGroup: Group
    targetContact: Contact
    blanchimentPercent: Int!
    amountToBring: Float!
    blanchimentAmount: Float!
    totalFinal: Float!
    createdAt: String!
    lines: [TransactionLine!]!
  }

  input TransactionLineInput {
    itemId: ID!
    quantity: Int!
    unitPrice: Float!
  }

  input CreateTransactionInput {
    sourceId: ID
    targetId: ID
    blanchimentPercent: Int!
    amountToBring: Float!
    blanchimentAmount: Float!
    totalFinal: Float!
    lines: [TransactionLineInput!]!
  }
`;
