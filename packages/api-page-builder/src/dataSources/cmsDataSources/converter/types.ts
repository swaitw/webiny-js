export type SelectionPath = string;

export interface Fragment {
    type: string;
    fields: GraphQLSelection;
}

export type GraphQLSelection = {
    [key: string]: GraphQLSelection | Fragment | true;
};
