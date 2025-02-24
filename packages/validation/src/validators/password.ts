import ValidationError from "~/validationError";

export default (value: any, params?: string[]) => {
    if (!value) {
        return;
    }
    value = value + "";

    const length = params ? params[0] || 6 : 6;
    const test = value.match(new RegExp(`^.{${length},}$`));
    if (test === null) {
        throw new ValidationError(`Password must contain at least ${length} characters`);
    }
};
