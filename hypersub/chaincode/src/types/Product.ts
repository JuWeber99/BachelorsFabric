import {Duration} from "moment";

export enum ProductType {
    SUBSCRIPTION = "subscription",
    RATE_OPTION = "rate_option",
}

export interface Product {
    productId: bigint;
    productType: ProductType;
    callThreshold: Duration;
    smsThreshold: bigint;
    dataUsageThresholdInMb: bigint;
}
