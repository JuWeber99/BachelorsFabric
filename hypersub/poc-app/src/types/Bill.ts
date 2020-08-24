import {Subscription} from "./Susbcription";
import {DTransaction} from "./DTransaction";

export enum BillDeliveryType {
    EMAIL = "email",
    MAIL = "mail",
    APP_NOTIFICATION = "app_notification"
}


export interface Bill {
    billId: number;
    contract : Subscription;
    startDate: Date | string;
    endDate: Date | string;
    amount: number;
    billTransactions?: Array<DTransaction>
    billDeliveryTypes: Array<BillDeliveryType>
}