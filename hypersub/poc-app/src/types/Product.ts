import {Duration} from "moment";

export enum ProductType {
    SUBSCRIPTION = "subscription",
    RATE_OPTION = "rate_option",
}

export interface Product {
    productId: string;
    productType: ProductType;
    callThreshold: Duration | string;
    smsThreshold: number;
    dataUsageThresholdInMb: number;
    cost: number
}
