import {Subscription} from "./Susbcription";
import {DTransaction} from "./DTransaction";

export enum BillDeliveryType {
    EMAIL = "email",
    MAIL = "mail",
    APPNOTIFICATION = "appnotification"
}

export class Bill {
    public billId: number;
    public contract : Subscription;
    public startDate: Date | string;
    public endDate: Date | string;
    public amount: number;
    public billTransactions?: Array<DTransaction>
    public billDeliveryTypes: Array<BillDeliveryType>

    constructor(obj: Bill) {
        this.billId = obj.billId
        this.contract = obj.contract
        this.startDate = obj.startDate
        this.endDate = obj.endDate
        this.amount = obj.amount
        this.billTransactions = obj.billTransactions
        this.billDeliveryTypes = obj.billDeliveryTypes
    }


}