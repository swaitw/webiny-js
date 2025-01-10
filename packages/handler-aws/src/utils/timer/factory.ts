import type { ITimer } from "./abstractions/ITimer";
import { CustomTimer } from "./CustomTimer";
import type { Context as LambdaContext } from "@webiny/aws-sdk/types";
import { Timer } from "./Timer";

export type ITimerFactoryParams = Pick<LambdaContext, "getRemainingTimeInMillis">;

export const timerFactory = (params?: Partial<ITimerFactoryParams>): ITimer => {
    const customTimer = new CustomTimer();

    return new Timer(() => {
        if (params?.getRemainingTimeInMillis) {
            return params.getRemainingTimeInMillis();
        }
        return customTimer.getRemainingMilliseconds();
    });
};
