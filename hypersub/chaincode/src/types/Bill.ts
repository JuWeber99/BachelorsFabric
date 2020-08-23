import {Subscription} from "./Susbcription";
import {DTransaction} from "./DTransaction";

export enum BillDeliveryType {
    EMAIL = "email",
    MAIL = "mail",
    APPNOTIFICATION = "appnotification"
}


export class Bill {
    protected billId: string;
    protected contract : Subscription;
    protected startDate: Date | string;
    protected endDate: Date | string;
    protected amount: number;
    protected billTransactions?: Array<DTransaction>
    protected billDeliveryTypes: Array<BillDeliveryType>


    getBillId(): string {
        return this.billId;
    }

    setBillId(value: string) {
        this.billId = value;
    }

    getContract(): Subscription {
        return this.contract;
    }

    setContract(value: Subscription) {
        this.contract = value;
    }

    getStartDate(): Date | string {
        return this.startDate;
    }

    setStartDate(value: Date | string) {
        this.startDate = value;
    }

    getEndDate(): Date | string {
        return this.endDate;
    }

    setEndDate(value: Date | string) {
        this.endDate = value;
    }

    getAmount(): number {
        return this.amount;
    }

    setAmount(value: number) {
        this.amount = value;
    }

    getBillTransactions(): Array<DTransaction> {
        return this.billTransactions;
    }

    setBillTransactions(value: Array<DTransaction>) {
        this.billTransactions = value;
    }

    getBillDeliveryTypes(): Array<BillDeliveryType> {
        return this.billDeliveryTypes;
    }

    setBillDeliveryTypes(value: Array<BillDeliveryType>) {
        this.billDeliveryTypes = value;
    }
}