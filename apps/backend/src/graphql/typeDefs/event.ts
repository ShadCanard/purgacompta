export const eventTypeDefs = `#graphql
  enum BetStatus {
    PENDING
    APPROVED
    DENIED
  }
  
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
	betsOpened: Boolean!
    participants: [Contestant!]!
    createdAt: String!
    updatedAt: String!
    participating: Boolean
	winner: Contestant
  }

  type Bet {
    id: ID!
    eventId: String!
    contestantId: String!
    contestant: Contestant!
    gamblerId: String!
    gambler: GenericIdName!
    amount: Float!
    status: BetStatus!
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
    eventsByGroup(groupId: ID!): [Event!]!
	groupsByEvent(eventId: ID!): [Group!]!
  }

  type Mutation {
    createEvent(name: String!, startDate: String!): Event!
    updateEvent(id: ID!, name: String, startDate: String, notes: String, winnerId: ID): Event!
    deleteEvent(id: ID!): Event!
    createBet(eventId: String!, contestantId: String!, gamblerId: String!, amount: Float!): Bet!
    updateBet(id: ID!, amount: Float, status: BetStatus): Bet!
    deleteBet(id: ID!): Bet!
	toggleBets(eventId: ID!): Event!
    createContestant(contestantId: ID!, eventId: ID!): Contestant!
    updateContestant(eventId: ID!, contestantId: ID!, notes: String): Contestant!
	addGroupToEvent(eventId: ID!, groupId: ID!): Event!
	removeGroupFromEvent(eventId: ID!, groupId: ID!): Event!
  }

  type Subscription {
    eventUpdated: Event!
    betUpdated: Bet!
	contestantUpdated: Contestant!
  }
`;
