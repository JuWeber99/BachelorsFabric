import {Product} from "./Product";
import {RateOption} from "./RateOption";


export class Subscription {
    contractId: string;
    subscriptionProduct: Product;
    isActive: boolean;
    startDate: Date | string;
    endDate?: Date | string;
    billingPeriod: string;
    cancellationPeriod: string;
    bookedOptions?: Array<RateOption>
}