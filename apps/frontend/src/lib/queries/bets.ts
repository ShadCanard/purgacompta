import { gql } from "@apollo/client";

export const GET_BETS = gql`
  query GetBets {
    bets {
      id
      eventId
      gamblerId
      amount
      createdAt
      updatedAt
      event {
        id
        name
      }
      gambler {
        id
        name
      }
    }
  }
`;

export const GET_BET = gql`
  query GetBet($id: ID!) {
    bet(id: $id) {
      id
      eventId
      gamblerId
      amount
      createdAt
      updatedAt
      event {
        id
        name
      }
      gambler {
        id
        name
      }
    }
  }
`;

export const GET_BETS_BY_EVENT = gql`
  query GetBetsByEvent($eventId: ID!) {
	betsByEvent(eventId: $eventId) {
	  id
	  gamblerId
	  contestantId
	  amount
	}
}
`;