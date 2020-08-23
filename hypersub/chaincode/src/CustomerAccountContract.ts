import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import {testAccounts} from "./data/initialTestLedger";
import {JsonUtil} from "./util";
import {CustomerAccount} from "./types/assets/CustomerAccount";
import {CustomerAccountList} from "./types/assets/CustomerAccountList";
import {testAccount2} from "../../server/testing/initialTestLedger";


class CustomerAccountContractContext extends Context {
    public customerAccountList: CustomerAccountList;

    constructor() {
        super();
        this.customerAccountList = new CustomerAccountList(this)
    }
}

@Info(
    {title: "CustomerAccountContract", description: "Smart contract for managing customer accounts"}
)
export class CustomerAccountContract extends Contract {

    constructor() {
        super("nexnet.hypersub.customeraccount");
    }

    createContext(): Context {
        return new CustomerAccountContractContext()
    }

    @Transaction()
    public async initLedger(ctx: CustomerAccountContractContext): Promise<void> {
        for (const customerAccount of testAccounts) {
            await ctx.customerAccountList.addCustomerAccount(customerAccount);
        }
    }

    @Transaction(false)
    public async readCustomerAccount(ctx: CustomerAccountContractContext, id: string): Promise<CustomerAccount> {
        let customerAccountKey = CustomerAccount.makeKey([id])
        let customerAccount = ctx.customerAccountList.getCustomerAccount(customerAccountKey);

        if (customerAccount === null) {
            throw new Error("NO ANSWER : NULL")
        }
        console.log(customerAccount)
        return customerAccount;
    }

    @Transaction(false)
    public async createTestAccountTwo(ctx: CustomerAccountContractContext) {
        let customerAccount = await ctx.customerAccountList.addCustomerAccount(testAccount2);

        return customerAccount;
    }

}

