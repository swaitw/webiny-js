const searchDataByKey = (searchKey: string, object: Record<string, any>): string | null => {
    if (!object || typeof object !== "object") {
        return null;
    }

    if (object[searchKey]) {
        return object[searchKey];
    }

    for (const key in object) {
        const value = searchDataByKey(searchKey, object[key]);
        if (value) {
            return value;
        }
    }

    return null;
};

export default searchDataByKey;
