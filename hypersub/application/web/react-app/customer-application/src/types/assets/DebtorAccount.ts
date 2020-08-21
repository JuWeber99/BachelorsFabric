import {Object, Property} from 'fabric-contract-api'
import {PersonalDetails} from "../PersonalDetails";
import {Statement} from "../Statement";


@Object()
export class DebtorAccount {


    @Property()
    public debtorId: string;

    @Property()
    public personalDetails: Array<PersonalDetails>;

    @Property()
    public statement: Statement;

}