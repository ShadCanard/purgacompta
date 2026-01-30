import { gql } from "@apollo/client";


export const IMPORT_CONTACTS = gql`
        mutation ImportContacts($input: [ImportContactInput!]!) {
            importContacts(input: $input) {
                id
                name
                phone
                createdAt
                updatedAt
            }
        }
`;
export const CREATE_CONTACT = gql`
    mutation CreateContact($input: CreateContactInput!) {
        createContact(input: $input) {
            id
            name
            phone
            group { id name }
        }
    }
`;

export const UPDATE_CONTACT = gql`
    mutation UpdateContact($input: UpdateContactInput!) {
        updateContact(input: $input) {
            id
            name
            phone
            group { id name }
        }
    }
`;

export const UPDATE_CONTACTS_MASS = gql`
    mutation UpdateContactsMass($ids: [ID!]!, $groupId: ID!) {
        updateContactsMass(ids: $ids, groupId: $groupId) {
            id
            name
            phone
            group { id name }
        }
    }
`;

export const DELETE_CONTACTS_MASS = gql`
    mutation DeleteContactsMass($ids: [ID!]!) {
        deleteContactsMass(ids: $ids)
    }
`;

export const DELETE_CONTACT = gql`
    mutation DeleteContact($id: ID!) {
    deleteContact(id: $id)
    }
`;
