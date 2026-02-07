import { gql } from "@apollo/client";

export const GET_CONTACTS = gql`
  query Contacts {
    contacts {
      id
      name
      phone
      groupid
      group {
        id
        name
      }
    }
  }
`;
export const GET_CONTACTS_WITHOUT_GROUP = gql`
  query ContactsWithoutGroup {
    contactsWithoutGroup {
      id
      name
      phone
    }
  }
`;

export const GET_CONTACT_BY_ID = gql`
  query ContactById($id: ID!) {
    contactById(id: $id) {
      id
      name
      phone
    }
  }
`;
