"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testDebtors = exports.testAccounts = exports.testSim = exports.testStatement = exports.testPersonalDetails = exports.testBill = exports.testTransaction = exports.testContract = exports.testOptions = exports.testSMSEvent = exports.testDataUsageEvent = exports.testCallEvent = exports.testStandartSubscribtion = exports.testSmsOption = void 0;
const BankingDetails_1 = require("../types/BankingDetails");
const IsoCountryCodes_1 = require("../types/IsoCountryCodes");
const Product_1 = require("../types/Product");
const moment = require("moment");
const Bill_1 = require("../types/Bill");
const PricedEvent_1 = require("../types/PricedEvent");
// PRODUCTS #################################
exports.testSmsOption = {
    callThreshold: moment.duration(0),
    dataUsageThresholdInMb: 0,
    smsThreshold: 50,
    productId: "7b2b1179a8953dc98acc70bd827d569352f3c4d8dcb98f9fbf089b45da51d455",
    productType: Product_1.ProductType.RATE_OPTION
};
exports.testStandartSubscribtion = {
    callThreshold: moment.duration(100, "minutes"),
    dataUsageThresholdInMb: 5000,
    smsThreshold: 200,
    productId: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    productType: Product_1.ProductType.SUBSCRIPTION
};
// ##########################################
exports.testCallEvent = {
    callDuration: moment.duration(116, "seconds"),
    targetPhoneNumber: "+491637143713",
    eventId: "2925e881732c69cf3b09317cb070a6a811505c9c",
    issueTimestamp: new Date(moment.now()),
    pricedEventType: PricedEvent_1.PricedEventType.CALL,
    taxRate: 19
};
exports.testDataUsageEvent = {
    usedAmountInMb: 123,
    eventId: "2925e881732c69cf3b09317cb070a6a811505c9c",
    issueTimestamp: new Date(moment.now()),
    pricedEventType: PricedEvent_1.PricedEventType.DATA_USAGE,
};
exports.testSMSEvent = {
    targetPhoneNumber: "491637143713",
    eventId: "2925e881732c69cf3b09317cb070a6a811505c9c",
    issueTimestamp: new Date(moment.now()),
    pricedEventType: PricedEvent_1.PricedEventType.SMS
};
exports.testOptions = {
    amount: 10,
    isInclusive: false,
    optionId: "b82eef4c7445be869ea581a6bcf9da58524f2c17784c1f63f0577bc4331b5f50",
    optionProduct: exports.testSmsOption
};
exports.testContract = {
    contractId: "8bb10978c15551cac26fbf63e536453781d2649c4a313b4382b780fd63ff3933",
    subscriptionProduct: exports.testStandartSubscribtion,
    isActive: true,
    startDate: moment().calendar(),
    endDate: moment(moment.now()).add(5, "months").calendar(),
    billingPeriod: moment.duration(30, "days"),
    cancellationPeriod: moment.duration(7, "days"),
    bookedOptions: [exports.testOptions]
};
exports.testTransaction = {
    amount: 300,
    timestamp: new Date(),
    transactionId: "e71f9ae31c72971778b956b42040edf72415e5d638a65c31ebf66a47e67ab03c"
};
exports.testBill = {
    amount: 0,
    billDeliveryTypes: [Bill_1.BillDeliveryType.EMAIL],
    billId: "311120699c855e163b663f649c3543dbd8c717c5b33d956c2442c713fba51983",
    billTransactions: [exports.testTransaction],
    contract: exports.testContract,
    endDate: moment(moment.now()).add(5, "months").calendar(),
    startDate: moment().calendar()
};
exports.testPersonalDetails = {
    address: {
        country: IsoCountryCodes_1.IsoCountryCodes.Germany,
        postalCode: "16798",
        streetName: "Rathenaustrasse",
        houseNumber: "17",
        residence: "Fürstenberg/Havel"
    },
    birthday: moment({ day: 14, month: 6, year: 1999 }).toDate(),
    forename: "Julian",
    name: "Weber",
    mailAddress: "s_weberj@hwr-berlin.de",
    telephoneContact: "03309332033"
};
exports.testStatement = {
    walletId: "randomHashStringIdentifier",
    currentBills: [],
    dueAmount: 0
};
exports.testSim = {
    identity: "CERTIFICATE PATH",
    phoneNumber: "+4901623713723",
    contracts: [exports.testContract],
    consumedPricedEvents: [exports.testCallEvent, exports.testSMSEvent, exports.testDataUsageEvent],
};
exports.testAccounts = [
    {
        accountId: "5d60f057f5294daa7aee33183d3252d1fa78a64da3aee5d8dbdebcbc24c3b809",
        bankingDetails: [{
                paymentType: BankingDetails_1.PaymentType.P2P,
                details: {
                    payerId: "testPayerID",
                    paymentToken: "testPaymentToken"
                }
            }],
        personalDetails: [exports.testPersonalDetails],
        statement: exports.testStatement,
        simDetails: [exports.testSim],
        isRevoked: false
    }
];
exports.testDebtors = [{
        debtorId: "a2kH2w3A7MUUY0OK4k5z",
        personalDetails: [{
                address: {
                    country: IsoCountryCodes_1.IsoCountryCodes.Germany,
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
];
//# sourceMappingURL=initialTestLedger.js.map