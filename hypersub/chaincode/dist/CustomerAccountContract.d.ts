import { Context, Contract } from 'fabric-contract-api';
import { CustomerAccount } from "./types/assets/CustomerAccountAsset";
export declare class CustomerAccountContract extends Contract {
    initLedger(ctx: Context): Promise<void>;
    createCustomerAccount(ctx: Context, customerAccount: CustomerAccount): Promise<void>;
    readCustomerAccount(ctx: Context, id?: string, customerAccount?: CustomerAccount): Promise<string>;
}
