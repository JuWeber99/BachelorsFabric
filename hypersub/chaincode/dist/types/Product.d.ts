import { Duration } from "moment";
export declare enum ProductType {
    SUBSCRIPTION = "subscription",
    RATE_OPTION = "rate_option"
}
export interface Product {
    productId: string;
    productType: ProductType;
    callThreshold: Duration;
    smsThreshold: number;
    dataUsageThresholdInMb: number;
}
