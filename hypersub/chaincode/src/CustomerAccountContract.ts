import {Context, Contract} from 'fabric-contract-api';
import {testAccounts, testAccountsThree, testAccountsTwo, testContract} from "./data/initialTestLedger";
import {CustomerAccount} from "./types/assets/CustomerAccountAsset";

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

        const newAddress = {
            postalCode: postalCode,
            residence: residence,
            streetName: streetName,
            houseNumber: houseNumber,
            country: country
        }

        const customerAccountBuffer = await ctx.stub.getState(accountId);
        const customerAccount: CustomerAccount = ctx.fromBuffer(customerAccountBuffer)
        const personIndex = await this.findPersonalDetailIndex(ctx, accountId, name, forename);
        customerAccount.personalDetails[personIndex].address = newAddress
        await ctx.stub.putState(accountId, ctx.toBuffer(customerAccount))
    }

    public async readCustomerAccount(ctx: CustomerAccountContext, accountId: string): Promise<string> {
        const customerAccountBuffer = await ctx.stub.getState(accountId);
        if (customerAccountBuffer.length === 0) {
            throw new Error(`${accountId} does not exist`);
        }
        return customerAccountBuffer.toString();
    }

    public async readCustomerAccountContracts(ctx: CustomerAccountContext, accountId: string, imsi: string): Promise<string> {
        const customerAccountBuffer = await ctx.stub.getState(accountId);
        if (customerAccountBuffer.length === 0) {
            throw new Error(`${accountId} does not exist`);
        }
        const customerAccount : CustomerAccount= ctx.fromBuffer(customerAccountBuffer);
        const simIndex = await this.findSimIndex(ctx, accountId, imsi)
        const contracts = customerAccount.simDetails[simIndex]
        return ctx.toBuffer(contracts).toString();
    }

    public async createSubscriptionContractForCustomerSim (ctx: CustomerAccountContext, accountId: string, imsi: string) {
        const customerAccountBuffer = await ctx.stub.getState(accountId);
        if (!customerAccountBuffer || customerAccountBuffer === null ) {
            throw new Error(`customer with accountId: ${accountId} not found`);
        }
        const customerAccount : CustomerAccount = ctx.fromBuffer(customerAccountBuffer);
        const simIndex: number = await this.findSimIndex(ctx, accountId, imsi)
        //PoC purposes with initial test customer
        customerAccount.simDetails[simIndex].contracts.push(testContract);
        await ctx.stub.putState(accountId, ctx.toBuffer(customerAccount));
    }

    public async findPersonalDetailIndex(ctx: CustomerAccountContext, accountId, name, forename): Promise<number> {
        const customerAccountBuffer = await ctx.stub.getState(accountId);
        if (!customerAccountBuffer || customerAccountBuffer.length === 0) {
            throw new Error(`${accountId} does not exist`);
        }
        const customerAccount: CustomerAccount = ctx.fromBuffer(customerAccountBuffer)
        const personIndex = customerAccount.personalDetails
            .findIndex(person => {
                return person.forename.toString().toString().toLowerCase() === forename.toString().toLowerCase() &&
                    person.name.toString().toLowerCase() === name.toString().toLowerCase();
            })
        if (personIndex === -1) {
            throw new Error("A Person with them names does not exists!")
        }
        return personIndex;
    }

    public async findSimIndex(ctx: CustomerAccountContext, accountId: string, imsi: string) {
        const customerAccountBuffer = await ctx.stub.getState(accountId);
        if (!customerAccountBuffer || customerAccountBuffer === null ) {
            throw new Error(`customer with accountId: ${accountId} not found`);
        }
        const customerAccount : CustomerAccount = ctx.fromBuffer(customerAccountBuffer);
        const simIndex: number = customerAccount.simDetails.findIndex(x => x.IMSI === imsi);
        if(simIndex === -1) {
            throw new Error(`SIM with IMSI: ${imsi} not found`);
        }
        return simIndex;
    }
}

