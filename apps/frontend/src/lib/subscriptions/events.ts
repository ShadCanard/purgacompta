import { gql } from "@apollo/client";

export const BET_UPDATED_SUBSCRIPTION = gql`
  subscription OnBetUpdated {
    betUpdated {
      id
    }
  }
`;

export const EVENT_UPDATED_SUBSCRIPTION = gql`
  subscription OnEventUpdated {
    eventUpdated {
      id
    }
  }
`;

export const CONTESTANT_UPDATED_SUBSCRIPTION = gql`
	subscription ContestantUpdated {
	contestantUpdated {
		id
	}
	}
`;
