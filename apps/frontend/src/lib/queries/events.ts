import { gql } from "@apollo/client";


export const GET_EVENTS = gql`
  query GetEvents {
    events {
      id
      name
      startDate
      createdAt
      updatedAt
	  betsOpened
      bets {
        id
        gamblerId
        amount
        gambler {
          id
          name
        }
      }
	  winner {
		id
		name
		color
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
	  betsOpened
      participants {
        id
        name
        notes
        color
      }
	  winner {
		id
		name
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
	  winner {
		id
		name
		color
	  }
	  bets {
		id
		gamblerId
		amount
	  }
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