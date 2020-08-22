import { Bill } from "./Bill";
export declare class Statement {
    walletId: string;
    currentBills?: Array<Bill>;
    dueAmount?: number;
}
