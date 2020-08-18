import {Product} from "./Product";
import {RateOption} from "./RateOption";
import {Duration} from "moment";


export interface Subscription {
    contractId: bigint;
    subscriptionProduct: Product;
    isActive: boolean;
    startDate: Date;
    endDate?: Date;
    billingPeriod: Duration;
    cancellationPeriod: Duration;
    bookedOptions?: Array<RateOption>
}