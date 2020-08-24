import {Product} from "./Product";
import {RateOption} from "./RateOption";
import {Object} from "fabric-contract-api";

export class Subscription {
    contractId: string;
    subscriptionProduct: Product;
    isActive: boolean;
    startDate: string;
    endDate?: string;
    billingPeriod: string;
    cancellationPeriod: string;
    bookedOptions?: Array<RateOption>
}