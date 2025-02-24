export interface MoveElementActionArgsType {
    source: {
        id: string;
        type: string;
        position: number;
    };
    target: {
        id: string;
        type: string;
        position: number;
    };
}
