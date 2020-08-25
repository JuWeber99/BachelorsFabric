export enum ProductType {
    SUBSCRIPTION = "subscription",
    RATE_OPTION = "rate_option",
}

export class Product {
    productId: string;
    productType: ProductType;
    callThresholdInMin: string;
    smsThreshold: number;
    dataUsageThresholdInMb: number;
    amount: number;
}
