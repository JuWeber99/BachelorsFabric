import {Object, Property} from 'fabric-contract-api'
import {SimDetails} from "../SimDetails";
import {Statement} from "../Statement";
import {BankingDetails, P2PDetails, SepaDetails} from "../BankingDetails";
import {PersonalDetails} from "../PersonalDetails";

@Object()
export class CustomerAccount {

    @Property("accountId", "string")
    public accountId: string;

    @Property("isRevoked", "boolean")
    public isRevoked?: boolean;

    public personalDetails: Array<PersonalDetails>;
    public bankingDetails: Array<BankingDetails<P2PDetails | SepaDetails>>;
    public simDetails: Array<SimDetails>;
    public statement: Statement;

}