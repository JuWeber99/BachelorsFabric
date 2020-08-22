import {Bill} from "./Bill";

export class Statement {
    walletId: string;
    currentBills?: Array<Bill>
    dueAmount?: number;
}