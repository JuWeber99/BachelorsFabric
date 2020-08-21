
export interface DTransaction {
    transactionId: string;
    amount: number;
    timestamp: Date | string;
    errors? : Array<string>;
}