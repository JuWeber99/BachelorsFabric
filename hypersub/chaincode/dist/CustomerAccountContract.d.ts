import { Context, Contract } from 'fabric-contract-api';
import { CustomerAccount } from "./types/assets/CustomerAccountAsset";
export declare class CustomerAccountContract extends Contract {
    InitLedger(ctx: Context): Promise<void>;
    CreateCustomerAccount(ctx: Context, customerAccount: CustomerAccount): Promise<void>;
    ReadCustomerAccount(ctx: Context, id?: string, customerAccount?: CustomerAccount): Promise<string>;
}
