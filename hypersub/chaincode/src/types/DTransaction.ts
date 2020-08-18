import {Runtime} from "inspector";

export interface DTransaction {
    transactionId: bigint;
    amount: number;
    timestamp: Date;
    errors? : Array<string>;
}