import { GracefulError } from "./GracefulError";
import { Context, gracefulPulumiErrorHandlers } from "./gracefulPulumiErrorHandlers";

export class GracefulPulumiError extends GracefulError {
    static from(ex: GracefulPulumiError | Error, context: Context) {
        if (ex instanceof GracefulError) {
            return ex;
        }

        for (const handler of gracefulPulumiErrorHandlers) {
            const result = handler({ error: ex, context });
            if (!result) {
                continue;
            }

            let errorMessage = result;
            if (typeof errorMessage === "object") {
                const { message, learnMore } = errorMessage;

                errorMessage = message;
                if (learnMore) {
                    errorMessage += ` Learn more: ${learnMore}.`;
                }
            }

            return new GracefulPulumiError(errorMessage, { cause: ex });
        }
        return undefined;
    }
}
