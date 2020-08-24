import {Context, Contract} from 'fabric-contract-api';
import {testAccounts, testAccountsThree, testAccountsTwo} from "./data/initialTestLedger";
import {CustomerAccount} from "./types/assets/CustomerAccountAsset";
import {PersonalDetails} from "./types/PersonalDetails";
import {CustomerAccountTypes} from "./types/CustomerAccountTypes";

class CustomerAccountContext extends Context {

    constructor() {
        super();
    }

    public toBuffer = (jayson: any) => {
        return Buffer.from(JSON.stringify(jayson));
    }

    public fromBuffer = (buffer: Uint8Array): any => {
        return JSON.parse(buffer.toString())
    }

    public fromStringToJson(input: string): any {
        return JSON.parse(input);
    }
}

export class CustomerAccountContract extends Contract {

    createContext(): Context {
        return new CustomerAccountContext();
    }


    public async initLedger(ctx: CustomerAccountContext) {
        await ctx.stub.putState(testAccounts.accountId, ctx.toBuffer(testAccounts));
    }

    public async createCustomerTestAccount(ctx: CustomerAccountContext) {
        await ctx.stub.putState(testAccountsTwo.accountId, ctx.toBuffer(testAccountsTwo));
    };

    public async createCustomerTestAccountTwo(ctx: CustomerAccountContext) {
        await ctx.stub.putState(testAccountsThree.accountId, ctx.toBuffer(testAccountsThree));
    };

    public async changeCustomerAddress(ctx: CustomerAccountContext,
                                       accountId,
                                       name,
                                       forename,
                                       postalCode: string,
                                       residence: string,
                                       streetName: string,
                                       houseNumber: string,
                                       country: string): Promise<void> {
        const customerAccountAsBytes = await ctx.stub.getState(accountId);
        const customerAccount: CustomerAccount = ctx.fromBuffer(customerAccountAsBytes)
        const personIndex = await this.findPersonalDetailIndex(ctx, accountId, name, forename);
        const person = customerAccount.personalDetails[personIndex];
        const newAddress = {
            postalCode,
            residence,
            streetName,
            houseNumber,
            country
        }
        person.address = newAddress
        await ctx.stub.putState(accountId, ctx.toBuffer(customerAccount))
    }


    public async readCustomerAccount(ctx: CustomerAccountContext, accountId: string): Promise<string> {
        const accountAsBytes = await ctx.stub.getState(accountId);
        if (!accountAsBytes || accountAsBytes.length === 0) {
            throw new Error(`${accountId} does not exist`);
        }
        return accountAsBytes.toString();
    }


    public async findPersonalDetailIndex(ctx: CustomerAccountContext, accountId, name, forename): Promise<number> {
        const customerAccountAsBytes = await ctx.stub.getState(accountId);
        if (!customerAccountAsBytes || customerAccountAsBytes.length === 0) {
            throw new Error(`${accountId} does not exist`);
        }
        const customerAccount: CustomerAccount = ctx.fromBuffer(customerAccountAsBytes)
        const personIndex = customerAccount.personalDetails
            .findIndex(person => (person.forename == forename && person.name == name))
        if (personIndex === -1) {
            throw new Error("A Person with them names does not exists!")
        }
        return personIndex;
    }
}

