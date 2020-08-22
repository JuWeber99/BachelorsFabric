
export class DTransaction {
    transactionId: string;
    amount: number;
    timeOfTransaction: Date | string;
    errors? : Array<string>;
}