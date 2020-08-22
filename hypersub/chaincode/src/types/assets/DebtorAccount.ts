import {Object, Property} from 'fabric-contract-api'
import {PersonalDetails} from "../PersonalDetails";
import {Statement} from "../Statement";


@Object()
export class DebtorAccount {
    public debtorId: string;
    public personalDetails: Array<PersonalDetails>;
    public statement: Statement;
}