import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
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

@Info(
    {title: "CustomerAccountContract", description: "Smart contract for managing customer accounts"}
)
export class CustomerAccountContract extends Contract {

    createContext(): Context {
        return new CustomerAccountContext();
    }


    @Transaction()
    public async initLedger(ctx: CustomerAccountContext) {
        await ctx.stub.putState(testAccounts.accountId, ctx.serialize(testAccounts));
        console.info(`Account ${testAccounts.accountId} initialized`);
    }

    @Transaction()
    public async createCustomerTestAccount(ctx: CustomerAccountContext) {
        await ctx.stub.putState(testAccountsTwo.accountId, ctx.serialize(testAccountsTwo));
        console.log("placeholder")
    };

    @Transaction()
    public async createCustomerTestAccountTwo(ctx: CustomerAccountContext) {
        await ctx.stub.putState(testAccountsThree.accountId, ctx.serialize(testAccountsThree));
        console.log("placeholder")
    };

    // @Transaction()
    // public async cafca(ctx: CustomerAccountContext, accountId, contractId,
    //                                              name,
    //                                              forename,
    //                                              postalCode: string,
    //                                              residence: string,
    //                                              streetName: string,
    //                                              houseNumber: string,
    //                                              country: string): Promise<void> {
    //
    //     const customerAccountAsBytes = await ctx.stub.getState(accountId);
    //     const customerAccount: CustomerAccount = ctx.deserialize(customerAccountAsBytes)

        // const personIndex = customerAccount.personalDetails.findIndex(person => {
        //     (person.forename === forename && person.name === name)
        // })
        //
        // const person = customerAccount.personalDetails[personIndex];
        //
        // const newAddress = {
        //     postalCode,
        //     residence,
        //     streetName,
        //     houseNumber,
        //     country
        // }
        // person.address = newAddress
        //
    // }


    @Transaction(false)
    @Returns("string")
    public async readCustomerAccount(ctx: CustomerAccountContext, accountId: string): Promise<string> {
        const accountAsBytes = await ctx.stub.getState(accountId);
        if (!accountAsBytes || accountAsBytes.length === 0) {
            throw new Error(`${accountId} does not exist`);
        }
        console.log(accountAsBytes.toString());
        return accountAsBytes.toString();
    }
}

