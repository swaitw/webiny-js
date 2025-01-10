export interface IParams {
    key: string;
}

export const createPartitionKey = () => {
    return `W#internal`;
};

export const createSortKey = ({ key }: IParams) => {
    return key;
};

export const createType = () => {
    return "internal";
};
