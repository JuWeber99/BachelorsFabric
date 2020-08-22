import {SimDetails} from "./SimDetails";
import {Statement} from "./Statement";
import {BankingDetails, P2PDetails, SepaDetails} from "./BankingDetails";
import {PersonalDetails} from "./PersonalDetails";

export class CustomerAccount {

    accountId: string;

    isRevoked?: boolean;

    personalDetails: Array<PersonalDetails>;

    bankingDetails: Array<BankingDetails<P2PDetails | SepaDetails>>;

    simDetails: Array<SimDetails>;

    statement: Statement;

}