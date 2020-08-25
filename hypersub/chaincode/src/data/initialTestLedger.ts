import {PaymentType} from "../types/BankingDetails";
import {IsoCountryCodes} from "../types/IsoCountryCodes";
import {DebtorAccount} from "../types/assets/DebtorAccount";
import {Subscription} from "../types/Susbcription";
import {Product, ProductType} from "../types/Product";
import {RateOption} from "../types/RateOption";
import * as moment from "moment"
import {Bill, BillDeliveryType} from "../types/Bill";
import {DTransaction} from "../types/DTransaction";
import {CallEvent, DataUsageEvent, PricedEventType, SmsEvent} from "../types/PricedEvent";
import {PersonalDetails} from "../types/PersonalDetails";
import {Statement} from "../types/Statement";
import {SimDetails} from "../types/SimDetails";
import {CustomerAccount} from "../types/assets/CustomerAccountAsset";


// PRODUCTS #################################
export const testSmsOption: Product = {
    callThresholdInMin: moment.duration(0).toISOString(),
    dataUsageThresholdInMb: 0,
    smsThreshold: 50,
    productId: "7b2b1179a8953dc98acc70bd827d569352f3c4d8dcb98f9fbf089b45da51d455",
    productType: ProductType.RATE_OPTION,
    amount: 10
}

export const testStandartSubscribtion: Product = {
    callThresholdInMin: moment.duration(100, "minutes").toISOString(),
    dataUsageThresholdInMb: 5000,
    smsThreshold: 200,
    productId: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    productType: ProductType.SUBSCRIPTION,
    amount: 10
}
// ##########################################


export const testCallEvent: CallEvent = {
    callDuration: moment.duration(116, "seconds").toISOString(),
    targetPhoneNumber: "+491637143713",
    eventId: "2925e881732c69cf3b09317cb070a6a811505c9c",
    pricedEventType: PricedEventType.CALL,
    taxRate: 19
}

export const testDataUsageEvent: DataUsageEvent = {
    usedAmountInMb: 123,
    eventId: "2925e881732c69cf3b09317cb070a6a811505c9c",
    pricedEventType: PricedEventType.DATA_USAGE,
}

export const testSMSEvent: SmsEvent = {
    targetPhoneNumber: "491637143713",
    eventId: "2925e881732c69cf3b09317cb070a6a811505c9c",
    pricedEventType: PricedEventType.SMS
}


export const testOptions: RateOption = {
    amount: 10,
    isInclusive: false,
    optionId: "b82eef4c7445be869ea581a6bcf9da58524f2c17784c1f63f0577bc4331b5f50",
    optionProduct: testSmsOption
}

export const testContract: Subscription = {
    contractId: "8bb10978c15551cac26fbf63e536453781d2649c4a313b4382b780fd63ff3933",
    subscriptionProduct: testStandartSubscribtion,
    isActive: true,
    startDate: moment().calendar(),
    endDate: moment(moment.now()).add(5, "months").calendar(),
    billingPeriod: moment.duration(30, "days").toISOString(),
    cancellationPeriod: moment.duration(7, "days").toISOString(),
    bookedOptions: [testOptions]
}

export const testTransaction: DTransaction = {
    amount: 300,
    transactionId: "e71f9ae31c72971778b956b42040edf72415e5d638a65c31ebf66a47e67ab03c"

}

export const testBill: Bill = {
    amount: 0,
    billDeliveryTypes: [BillDeliveryType.EMAIL],
    billId: 1,
    billTransactions: [testTransaction],
    contract: testContract,
    endDate:  moment(moment.now()).add(5, "months").calendar(),
    startDate:  moment().calendar()
}

export const testPersonalDetails: PersonalDetails = {
    address: {
        country: IsoCountryCodes.Germany,
        postalCode: "16798",
        streetName: "Rathenaustrasse",
        houseNumber: "17",
        residence: "Fürstenberg/Havel"
    },
    birthday: moment({day: 14, month: 6, year: 1999}).toDate(),
    forename: "Julian",
    name: "Weber",
    mailAddress: "s_weberj@hwr-berlin.de",
    telephoneContact: "03309332033"
}

export const testStatement: Statement = {
    walletId: "randomHashStringIdentifier",
    currentBills: [],
    dueAmount: 0
}

export const testSim: SimDetails = {
    identity: "CERTIFICATE PATH",
    phoneNumber: "+4901623713723",
    contracts: [testContract],
    consumedPricedEvents: [testCallEvent, testSMSEvent, testDataUsageEvent],
}


export const testAccounts: CustomerAccount =
    {
        accountId: "5d60f057f5294daa7aee33183d3252d1fa78a64da3aee5d8dbdebcbc24c3b809", //random hash string
        bankingDetails: [{
            paymentType: PaymentType.P2P,
            details: {
                payerId: "testPayerID",
                paymentToken: "testPaymentToken"
            }
        }],
        personalDetails: [testPersonalDetails],
        statement: testStatement,
        simDetails: [testSim],
        isRevoked: false
    }

export const testAccountsTwo: CustomerAccount =
    {
        accountId: "guhidasfg238r766grzseugc97dsaftg67sadfadsf23", //random hash string
        bankingDetails: [{
            paymentType: PaymentType.P2P,
            details: {
                payerId: "testPayerID",
                paymentToken: "testPaymentToken"
            }
        }],
        personalDetails: [testPersonalDetails],
        statement: testStatement,
        simDetails: [testSim],
        isRevoked: false
    }
export const testAccountsThree: CustomerAccount =
    {
        accountId: "aaabbbcccdddeeefasdfhcsiqkfhjasdf", //random hash string
        bankingDetails: [{
            paymentType: PaymentType.P2P,
            details: {
                payerId: "testPayerID",
                paymentToken: "testPaymentToken"
            }
        }],
        personalDetails: [testPersonalDetails],
        statement: testStatement,
        simDetails: [testSim],
        isRevoked: false
    }


export const testDebtors: DebtorAccount = {
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

