import {PersonalDetails} from "./PersonalDetails";
import {Statement} from "./Statement";


export interface DebtorAccount {

    debtorId: string;

    personalDetails: Array<PersonalDetails>;

    statement: Statement;

}