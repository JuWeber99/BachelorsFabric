import {Product} from "./Product";

export interface RateOption {
    optionId: bigint;
    optionProduct: Product;
    isInclusive: boolean;
    amount: number;
}