import {SimDetails} from "../SimDetails";
import {Statement} from "../Statement";
import {BankingDetails, P2PDetails, SepaDetails} from "../BankingDetails";
import {PersonalDetails} from "../PersonalDetails";

export class CustomerAccount {
    public accountId: string;
    public isRevoked?: boolean;
    public personalDetails: Array<PersonalDetails>;
    public bankingDetails: Array<BankingDetails<P2PDetails | SepaDetails>>;
    public simDetails: Array<SimDetails>;
    public statement: Statement;
}