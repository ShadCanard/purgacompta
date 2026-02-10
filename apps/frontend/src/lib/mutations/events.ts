
import { gql } from "@apollo/client";

export const CREATE_CONTESTANT = gql`
  mutation CreateContestant($contestantId: ID!, $eventId: ID!) {
    createContestant(contestantId: $contestantId, eventId: $eventId) {
		id
		name
		notes
		color
    }
  }
`;

export const UPDATE_CONTESTANT = gql`
  mutation UpdateContestant($eventId: ID!, $contestantId: ID!, $notes: String) {
    updateContestant(eventId: $eventId, contestantId: $contestantId, notes: $notes) {
      id
      name
      notes
    }
  }
`;

export const DELETE_CONTESTANT = gql`
  mutation DeleteContestant($id: ID!) {
    deleteContestant(id: $id) {
      id
      name
      notes
    }
  }
`;

export const CREATE_EVENT = gql`
  mutation CreateEvent($name: String!, $startDate: String!) {
    createEvent(name: $name, startDate: $startDate) {
      id
      name
      startDate
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_EVENT = gql`
  mutation UpdateEvent($id: ID!, $name: String, $startDate: String, $notes: String) {
    updateEvent(id: $id, name: $name, startDate: $startDate, notes: $notes) {
      id
      name
      startDate
      notes
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id) {
      id
      name
      startDate
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_BET = gql`
  mutation CreateBet($eventId: String!, $gamblerId: String!, $amount: Float!) {
    createBet(eventId: $eventId, gamblerId: $gamblerId, amount: $amount) {
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
      contact {
        id
        name
      }
      group {
        id
        name
      }
    }
  }
`;

export const UPDATE_BET = gql`
  mutation UpdateBet($id: ID!, $amount: Float) {
    updateBet(id: $id, amount: $amount) {
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
      contact {
        id
        name
      }
      group {
        id
        name
      }
    }
  }
`;

export const DELETE_BET = gql`
  mutation DeleteBet($id: ID!) {
    deleteBet(id: $id) {
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
      contact {
        id
        name
      }
      group {
        id
        name
      }
    }
  }
`;