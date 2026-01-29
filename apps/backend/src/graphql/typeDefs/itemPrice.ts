export const itemPriceTypeDefs = `#graphql
  type ItemPrice {
    id: ID!
    item: Item!
    group: Group!
    targetId: ID
    targetGroup: Group
    targetContact: Contact
    price: Float!
    createdAt: String!
    updatedAt: String!
    onSell: Boolean!
    buying: Boolean!
  }

  input CreateItemPriceInput {
    itemId: ID!
    groupId: ID!
    targetId: ID
    price: Float!
    onSell: Boolean
    buying: Boolean
  }

  input UpdateItemPriceInput {
    id: ID!
    price: Float
    onSell: Boolean
    buying: Boolean
    targetId: ID
  }
`;
