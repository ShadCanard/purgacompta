import { gql } from "@apollo/client";


export const GET_EVENTS = gql`
  query GetEvents {
    events {
      id
      name
      startDate
      createdAt
      updatedAt
      bets {
        id
        gamblerId
        amount
        gambler {
          id
          name
        }
      }
    }
  }
`;

export const GET_EVENT = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      id
      name
      startDate
      notes
      createdAt
      updatedAt
      participants {
        id
        name
        notes
        color
      }
      bets {
        id
        gamblerId
        amount
        gambler {
          id
          name
        }
        contestantId
        contestant {
          id
          name
          color
        }
        createdAt
        updatedAt
      }
    }
  }

`;

export const GET_CONTESTANTS_BY_EVENT = gql`
  query GetContestantsByEvent($eventId: ID!) {
	contestantsByEvent(eventId: $eventId) {
	  id
	  name
	  notes
	  color
	}
  }
`;