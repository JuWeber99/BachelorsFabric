import {IsoCountryCodes} from "./IsoCountryCodes";

export enum PaymentType {
    P2P = "P2P",
    SEPA_COLLECTION = "SEPA",
    CRYPTO = "CRYPTO"
}

export class BankingDetails<T extends P2PDetails | SepaDetails> {
    paymentType: PaymentType;
    details: T
}

export class P2PDetails {
    payerId: string;
    paymentToken: string;
}

export class SepaDetails {
    iban: string;
    bic: string;
    countryCode: IsoCountryCodes;
    sepaMandateDate: Date;
    sepaMandateId: string;
    isSepaMandateValid: boolean
}