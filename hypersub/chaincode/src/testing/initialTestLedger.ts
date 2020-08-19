import {CustomerAccount} from "../types/assets/CustomerAccountAsset";
import {PaymentType} from "../types/BankingDetails";
import {IsoCountryCodes} from "../types/IsoCountryCodes";
import {DebtorAccount} from "../types/assets/DebtorAccount";

export const testAccounts: Array<CustomerAccount> = [
    {
        accountId: "D2lHSwZA7MUUY0OKSk8z", //random hash string
        bankingDetails: [{
            paymentType: PaymentType.P2P,
            details: {
                payerId: "testPayerID",
                paymentToken: "testPaymentToken"
            }
        }],
        personalDetails: [{
            address: {
                country: IsoCountryCodes.Germany,
                postalCode: "16798",
                streetName: "Rathenaustrasse",
                houseNumber: "17",
                residence: "Fürstenberg/Havel"
            },
            birthday: new Date("1999-06-14"),
            forename: "Julian",
            name: "Weber",
            mailAddress: "s_weberj@hwr-berlin.de",
            telephoneContact: "03309332033"
        }],
        statement: {
            walletId: "randomHashStringIdentifier",
            currentBills: [],
            dueAmount: 0
        },
        simDetails: [{
            identity: "CERTIFICATE PATH",
            phoneNumber: "+4901623713723",
            activeContracts: [],
            consumedPricedEvents: [],
        }],
        isRevoked: false
    }
]


export const testDebtors: Array<DebtorAccount> = [{
    debtorId: "a2kH2w3A7MUUY0OK4k5z", //random hash string
    personalDetails: [{
        address: {
            country: IsoCountryCodes.Germany,
            postalCode: "16798",
            streetName: "Rathenaustrasse",
            houseNumber: "17",
            residence: "Fürstenberg/Havel"
        },
        birthday: new Date("1999-06-14"),
        forename: "Julian",
        name: "Weber",
        mailAddress: "s_weberj@hwr-berlin.de",
        telephoneContact: "03309332033"
    }],
    statement: {
        walletId: "randomHashStringIdentifier",
        currentBills: [],
        dueAmount: 0
    }
}
]
