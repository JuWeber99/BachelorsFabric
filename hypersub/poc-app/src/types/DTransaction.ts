import {Runtime} from "inspector";

export class DTransaction {
    transactionId: string;
    amount: number;
    timestamp: Date | string;
    errors? : Array<string>;
}