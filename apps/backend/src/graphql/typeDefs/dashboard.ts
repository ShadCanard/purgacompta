export const dashboardTypeDefs = `#graphql
  type UserAccountHistoryStats {
    transactionsCount: Int!
    transactionsCountLastWeek: Int!
    totalBalance: Float!
    totalBalanceLastWeek: Float!
    totalAmount: Float!
    totalAmountLastWeek: Float!
    totalIncoming: Float!
    totalIncomingLastWeek: Float!
    totalOutgoing: Float!
    totalOutgoingLastWeek: Float!
    vehicleTransactionsCount: Int!
    vehicleTransactionsCountLastWeek: Int!
  }

  type Query {
    userAccountHistoryStats: UserAccountHistoryStats!
  }
`;
