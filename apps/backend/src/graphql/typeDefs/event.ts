export const eventTypeDefs = `#graphql

  type GenericIdName {
    id: ID!
    name: String!
  }

  type Contestant {
	id: ID!
	name: String!
	notes: String
	color: String
  }

  type Event {
    id: ID!
    name: String!
    startDate: String!
    notes: String
    bets: [Bet!]!
    participants: [Contestant!]!
    createdAt: String!
    updatedAt: String!
  }

  type Bet {
    id: ID!
    eventId: String!
    contestantId: String!
    contestant: Contestant!
    gamblerId: String!
    gambler: GenericIdName!
    amount: Float!
    createdAt: String!
    updatedAt: String!
    event: Event!
  }

  type Query {
    events: [Event!]!
    event(id: ID!): Event
    bets: [Bet!]!
    bet(id: ID!): Bet
    contestantsByEvent(eventId: ID!): [Contestant!]!
	betsByEvent(eventId: ID!): [Bet!]!
  }

  type Mutation {
    createEvent(name: String!, startDate: String!): Event!
    updateEvent(id: ID!, name: String, startDate: String, notes: String): Event!
    deleteEvent(id: ID!): Event!
    createBet(eventId: String!, contestantId: String!, gamblerId: String!, amount: Float!): Bet!
    updateBet(id: ID!, amount: Float): Bet!
    deleteBet(id: ID!): Bet!
    createContestant(contestantId: ID!, eventId: ID!): Contestant!
    updateContestant(eventId: ID!, contestantId: ID!, notes: String): Contestant!
  }

  type Subscription {
    eventUpdated: Event!
    betUpdated: Bet!
	contestantUpdated: Contestant!
  }
`;
