export const isJson = (value: unknown) => {
    if (typeof value !== "string") {
        return true;
    }

    try {
        JSON.parse(value);
        return true;
    } catch {
        return false;
    }
};
