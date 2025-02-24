import { Modifier } from "~/types";

export default (): Modifier => {
    return {
        name: "if",
        execute(value: string, parameters: Array<string>) {
            return value === parameters[0] ? parameters[1] : parameters[2] || "";
        }
    };
};
