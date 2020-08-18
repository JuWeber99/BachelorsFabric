import {IsoCountryCodes} from "./IsoCountryCodes";

export interface Address {
    postalCode: string;
    residence: string;
    streetName: string;
    houseNumber: string;
    country: IsoCountryCodes;
}