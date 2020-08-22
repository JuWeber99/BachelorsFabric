import { IsoCountryCodes } from "./IsoCountryCodes";
export declare enum PaymentType {
    P2P = "P2P",
    SEPA_COLLECTION = "SEPA",
    CRYPTO = "CRYPTO"
}
export declare class BankingDetails<T extends P2PDetails | SepaDetails> {
    paymentType: PaymentType;
    details: T;
}
export declare class P2PDetails {
    payerId: string;
    paymentToken: string;
}
export declare class SepaDetails {
    iban: string;
    bic: string;
    countryCode: IsoCountryCodes;
    sepaMandateDate: Date;
    sepaMandateId: string;
    isSepaMandateValid: boolean;
}
