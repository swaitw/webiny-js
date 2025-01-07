export const isHtml = (value: unknown) => {
    if (typeof value !== "string" || value.startsWith("<")) {
        return false;
    }

    return true;
};
