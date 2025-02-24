import { join } from "path";
import notifier from "node-notifier";

export interface INotifyParams {
    message: string;
    timeout?: number;
}

export const notify = ({ message, timeout }: INotifyParams) => {
    return new Promise(resolve => {
        notifier.notify({
            title: "Webiny CLI",
            message,
            icon: join(__dirname, "logo.png"),
            sound: false,
            timeout: timeout === undefined ? 1 : timeout
        });

        setTimeout(resolve, 100);
    });
};
