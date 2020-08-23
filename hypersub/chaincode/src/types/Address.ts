import {IsoCountryCodes} from "./IsoCountryCodes";

export class Address {
    postalCode: string;
    residence: string;
    streetName: string;
    houseNumber: string;
    country: IsoCountryCodes | string;

    constructor(postalCode: string,
                residence: string,
                streetName: string,
                houseNumber: string,
                country: IsoCountryCodes | string) {
            this.postalCode = postalCode;
            this.residence = residence;
            this.streetName = streetName;
            this.houseNumber = houseNumber;
            this.country = country;
    }
}