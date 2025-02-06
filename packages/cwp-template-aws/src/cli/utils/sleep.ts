export const sleep = (ms: number = 3333) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
