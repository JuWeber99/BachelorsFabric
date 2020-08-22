import {Duration} from "moment";

export enum PricedEventType {
    CALL = "call",
    DATA_USAGE = "data_usage",
    SMS = "sms"
}

export type PricedEvent = CallEvent | SmsEvent | DataUsageEvent;

export class EventStructure {
    eventId: string;
    issueTimestamp: Date | string;
    amount?: number;
    taxRate?: number;
    pricedEventType: PricedEventType;
    additionalCosts?: number;
}

export class CallEvent extends EventStructure {
    pricedEventType: PricedEventType.CALL;
    targetPhoneNumber: string;
    callDuration: Duration
}


export class SmsEvent extends EventStructure {
    pricedEventType: PricedEventType.SMS;
    targetPhoneNumber: string;
}


export class DataUsageEvent extends EventStructure {
    pricedEventType: PricedEventType.DATA_USAGE;
    usedAmountInMb: number;
}