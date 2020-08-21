import { Product } from "./Product";
export interface RateOption {
    optionId: string;
    optionProduct: Product;
    isInclusive: boolean;
    amount: number;
}
