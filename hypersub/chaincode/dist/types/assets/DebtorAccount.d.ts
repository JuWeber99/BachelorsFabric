import { PersonalDetails } from "../PersonalDetails";
import { Statement } from "../Statement";
export declare class DebtorAccount {
    debtorId: string;
    personalDetails: Array<PersonalDetails>;
    statement: Statement;
}
