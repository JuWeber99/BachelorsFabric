import {PersonalDetails} from "../types/PersonalDetails";
import {CustomerAccount} from "../types/CustomerAccountAsset";

export async function callFindPersonIndex(accountId: string, name: string, forename: string): Promise<number> {
    const personIndex = await fetch(`http://localhost:3031/api/findPersonalDetailIndex/${accountId}/${name}/${forename}`)
        .then((response) => response.json())
        .then((personIndex: number) => personIndex)
    return personIndex;
}

    export async function getPersonalDetailsForCustomerOnSite(accountId: string, personIndex: number): Promise<PersonalDetails> {
        let result = await fetch(`http://localhost:3031/api/readCustomerAccount/${accountId}`)
            .then((response) => response.json())
            .then((customerAccount: CustomerAccount) => customerAccount.personalDetails[personIndex])
        return result
    }

    export async function getCustomerDetails(accountId: string): Promise<CustomerAccount> {
        const customerAccount = await fetch(`http://localhost:3031/api/readCustomerAccount/${accountId}`)
            .then((response) => response.json())
            .then((customerAccount: CustomerAccount) => customerAccount);
        return customerAccount;
    }

    export async function callUpdateLedgerTest(accountId, name, forename): Promise<boolean> {
        let success = await fetch(`http://localhost:3031/api/changeCustomerAddress/${accountId}/${name}/${forename}`)
            .then((response) => response.ok)
        return success;
}




