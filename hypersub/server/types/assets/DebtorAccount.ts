import {PersonalDetails} from "../PersonalDetails";
import {Statement} from "../Statement";


export class DebtorAccount {
    public debtorId: string;
    public personalDetails: Array<PersonalDetails>;
    public statement: Statement;
}