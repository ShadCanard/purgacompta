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
		status
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

export const GET_EVENTS_BY_GROUP = gql`
  query GetEventsByGroup($groupId: ID!) {
	eventsByGroup(groupId: $groupId) {
	  id
	  name
	  startDate
	  participating
	}
}
`;
export const GET_GROUPS_BY_EVENT = gql`
	query GroupsByEvent($eventId: ID!) {
	groupsByEvent(eventId: $eventId) {
		id
		name
	}
	}
`;