import { gql } from "@apollo/client";


// Stockages
export const CREATE_STORAGE = gql`
    mutation CreateStorage($input: CreateStorageInput!) {
        createStorage(input: $input) {
            id
            name
            type
            location
            maxWeight
            createdAt
            updatedAt
        }
    }
`;

export const UPDATE_STORAGE = gql`
    mutation UpdateStorage($input: UpdateStorageInput!) {
        updateStorage(input: $input) {
            id
            quantity
            storage {
                id
                name
            }
            item {
                id
                name
                weapon
            }
        }
    }
`;
