import { MoveElementActionArgsType } from "./types";
import { BaseEventAction } from "../../eventActions";

export class MoveElementActionEvent extends BaseEventAction<MoveElementActionArgsType> {
    public getName(): string {
        return "MoveElementActionEvent";
    }
}
