import { Address } from "./Address";
export interface PersonalDetails {
    name: string;
    forename: string;
    birthday: Date;
    mailAddress: string;
    telephoneContact: string;
    address: Address;
}
