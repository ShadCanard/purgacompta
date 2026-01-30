import { gql } from "@apollo/client";

export const UPDATE_GROUP_IS_ACTIVE = gql`
        mutation UpdateGroupIsActive($id: ID!, $isActive: Boolean!) {
                updateGroupIsActive(input: { id: $id, isActive: $isActive }) {
                id
                isActive
                }
        }
`;

export const CREATE_GROUP = gql`
    mutation CreateGroup($name: String!, $tag: String, $description: String, $isActive: Boolean, $color1: String, $color2: String) {
        createGroup(name: $name, tag: $tag, description: $description, isActive: $isActive, color1: $color1, color2: $color2) {
            id
            name
            tag
            description
            isActive
            color1
            color2
            createdAt
            updatedAt
        }
    }
`;

export const UPDATE_GROUP = gql`
    mutation UpdateGroup($id: ID!, $name: String, $tag: String, $description: String, $isActive: Boolean, $color1: String, $color2: String) {
        updateGroup(input: { id: $id, name: $name, tag: $tag, description: $description, isActive: $isActive, color1: $color1, color2: $color2 }) {
            id
            name
            tag
            description
            isActive
            updatedAt
            color1
            color2
        }
    }
`;

export const DELETE_GROUP = gql`
        mutation DeleteGroup($id: ID!) {
            deleteGroup(id: $id)
        }
`;
