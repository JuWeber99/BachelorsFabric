import {Context, Contract} from 'fabric-contract-api';
import {testAccounts, testAccountsThree, testAccountsTwo} from "./data/initialTestLedger";
import {CustomerAccount} from "./types/assets/CustomerAccountAsset";

class CustomerAccountContext extends Context {

    constructor() {
        super();
    }

    public serialize = (jayson: CustomerAccount) => {
        return Buffer.from(JSON.stringify(jayson));
    }

    public deserialize = (buffer: Uint8Array): CustomerAccount => {
        return JSON.parse(buffer.toString())
    }
}

export class CustomerAccountContract extends Contract {

    createContext(): Context {
        return new CustomerAccountContext();
    }


    public async initLedger(ctx: CustomerAccountContext) {
        await ctx.stub.putState(testAccounts.accountId, ctx.serialize(testAccounts));
    }

    public async createCustomerTestAccount(ctx: CustomerAccountContext) {
        await ctx.stub.putState(testAccountsTwo.accountId, ctx.serialize(testAccountsTwo));
    };

    public async createCustomerTestAccountTwo(ctx: CustomerAccountContext) {
        await ctx.stub.putState(testAccountsThree.accountId, ctx.serialize(testAccountsThree));
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
        const customerAccount: CustomerAccount = ctx.deserialize(customerAccountAsBytes)

        const person = await this.getPersonFromCustomerAccount(ctx, accountId, name, forename);

        const newAddress = {
            postalCode,
            residence,
            streetName,
            houseNumber,
            country
        }
        person.address = newAddress

        await ctx.stub.putState(accountId, ctx.serialize(customerAccount))

    }

    public async readCustomerAccount(ctx: CustomerAccountContext, accountId: string): Promise<string> {
        const accountAsBytes = await ctx.stub.getState(accountId);
        if (!accountAsBytes || accountAsBytes.length === 0) {
            throw new Error(`${accountId} does not exist`);
        }
        return accountAsBytes.toString();
    }

    public async getPersonFromCustomerAccount(ctx: CustomerAccountContext, accountId, name, forename) {

        const customerAccountAsBytes = await ctx.stub.getState(accountId);

        if (!customerAccountAsBytes || customerAccountAsBytes.length === 0) {
            throw new Error(`${accountId} does not exist`);
        }
        const customerAccount: CustomerAccount = ctx.deserialize(customerAccountAsBytes)

        const personIndex = customerAccount.personalDetails
            .findIndex(person => (person.forename == forename && person.name == name))
        if (personIndex === -1) {
            throw new Error("A Person with them names does not exists!")
        }
        return customerAccount.personalDetails[personIndex];
    }
}

