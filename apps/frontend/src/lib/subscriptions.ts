
import { gql } from "@apollo/client";

export const STORAGE_UPDATED = gql`
	subscription StorageUpdated {
		storageUpdated {
			storageId
		}
	}
`;
