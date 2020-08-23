import {IsoCountryCodes} from "./IsoCountryCodes";

export class Address {
    postalCode: string;
    residence: string;
    streetName: string;
    houseNumber: string;
    country: IsoCountryCodes;
}