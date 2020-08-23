import {Product} from "./Product";
import {RateOption} from "./RateOption";
import {Duration} from "moment";


export interface Subscription {
    contractId: string;
    subscriptionProduct: Product;
    isActive: boolean;
    startDate: Date | string;
    endDate: Date | string;
    billingPeriod: Duration| string;
    cancellationPeriod: Duration | string;
    bookedOptions?: Array<RateOption>
}