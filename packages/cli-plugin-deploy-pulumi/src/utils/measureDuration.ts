import humanizeDuration from "humanize-duration";

export const measureDuration = () => {
    const start = new Date().getTime();
    return () => {
        return humanizeDuration(new Date().getTime() - start, {
            maxDecimalPoints: 2
        });
    };
};
