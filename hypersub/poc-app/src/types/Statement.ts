import {Bill} from "./Bill";

export interface Statement {
    walletId: string;
    currentBills?: Array<Bill>
    dueAmount?: number;
}