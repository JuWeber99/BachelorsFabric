import {PersonalDetails} from "./PersonalDetails";
import {Statement} from "./Statement";


export class DebtorAccount {

    debtorId: string;

    personalDetails: Array<PersonalDetails>;

    statement: Statement;

}