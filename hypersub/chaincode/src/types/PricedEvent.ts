import {Duration} from "moment";

enum PricedEventType {
    CALL = "call",
    DATA_USAGE = "data_usage",
    SMS = "sms"
}

export interface PricedEvent {
    eventId: bigint;
    issueTimestamp: Date;
    amount: number;
    taxRate: number;
    pricedEventType: PricedEventType;
    additionalCosts?: number;
}

export interface CallEvent extends PricedEvent{
    pricedEventType: PricedEventType.CALL;
    targetPhoneNumber: string;
    callDuration: Duration
}


export interface SmsEvent extends PricedEvent{
    pricedEventType: PricedEventType.SMS;
    targetPhoneNumber: string;
}


export interface DataUsageEvent extends PricedEvent{
    pricedEventType: PricedEventType.DATA_USAGE;
    usedAmountInMb: number;
}