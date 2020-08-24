import {Product} from "./Product";

export class RateOption {
    optionId: string;
    optionProduct: Product;
    isInclusive: boolean;
    amount: number;
}