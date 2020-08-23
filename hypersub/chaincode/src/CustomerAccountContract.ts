import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import {testAccounts, testAccountsThree, testAccountsTwo} from "./data/initialTestLedger";
import {JsonUtil} from "./util";
import {CustomerAccount} from "./types/assets/CustomerAccountAsset";

@Info(
    {title: "CustomerAccountContract", description: "Smart contract for managing customer accounts"}
)
export class CustomerAccountContract extends Contract {


    @Transaction()
    public async initLedger(ctx: Context): Promise<void> {
        await ctx.stub.putState(testAccounts.accountId, JsonUtil.createBufferFromJSON(testAccounts));
        console.info(`Account ${testAccounts.accountId} initialized`);
    }

    @Transaction()
    public async createCustomerTestAccount(ctx: Context) {
        await ctx.stub.putState(testAccountsTwo.accountId, JsonUtil.createBufferFromJSON(testAccountsTwo));
        console.log("placeholder")
    };


    @Transaction()
    public async createCustomerTestAccountTwo(ctx: Context) {
        await ctx.stub.putState(testAccountsThree.accountId, JsonUtil.createBufferFromJSON(testAccountsThree));
        console.log("placeholder")
    };

    @Transaction(false)
    @Returns("string")
    public async readCustomerAccount(ctx: Context, accountId: string): Promise<string> {
        const accountAsBytes = await ctx.stub.getState(accountId);
        if (!accountAsBytes || accountAsBytes.length === 0) {
            throw new Error(`${accountId} does not exist`);
        }
        console.log(accountAsBytes.toString());
        return accountAsBytes.toString();
    }
}

