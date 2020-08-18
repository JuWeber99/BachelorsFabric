import {Bill} from "./Bill";

export interface Wallet {
    walletId: string;
    currentBills?: Array<Bill>
    dueAmount?: number;
}