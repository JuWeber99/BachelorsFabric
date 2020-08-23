import {StateList} from "../../StateList"

export class CustomerAccountList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.papernet.commercialpaperlist');
        this.use(CustomerAccountList);
    }

    async addCustomerAccount(customerAccount) {
        return this.addState(customerAccount);
    }

    async getCustomerAccount(customerAccountKey) {
        return this.getState(customerAccountKey);
    }

    async updatePaper(customerAccount) {
        return this.updateState(customerAccount);
    }
}
