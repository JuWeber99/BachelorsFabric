import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import {testAccounts} from "./testing/initialTestLedger";
import {JsonUtil} from "./util";
import {CustomerAccount} from "./types/assets/CustomerAccountAsset";

@Info(
    {title: "CustomerAccountContract", description: "Smart contract for managing customer accounts"}
)
export class CustomerAccountContract extends Contract {


    @Transaction()
    public async InitLedger(ctx: Context): Promise<void> {
        for (const customerAccount of testAccounts) {
            await ctx.stub.putState(customerAccount.accountId, Buffer.from(JSON.stringify(customerAccount)))
            console.info(`Account ${customerAccount.accountId} initialized`);
        }
    }

    @Transaction()
    public async CreateCustomerAccount(ctx: Context, customerAccount: CustomerAccount) {
        await ctx.stub.putState(customerAccount.accountId, JsonUtil.createBufferFromJSON(customerAccount));
    };

    @Transaction(false)
    @Returns("string")
    public async ReadCustomerAccount(ctx: Context, id?: string, customerAccount?: CustomerAccount): Promise<string> {
        let jsonRepresentation;
        if (id == null && customerAccount == null) {
            throw new Error("no Parameter given")
        } else if (id == null) {
            jsonRepresentation = ctx.stub.getState(id);
        } else if (customerAccount == null) {
            jsonRepresentation = ctx.stub.getState(customerAccount.accountId);
        }

        if (!jsonRepresentation || jsonRepresentation.length === 0) {
            throw new Error("asset not found")
        }
        return jsonRepresentation.toString();
    }
}

