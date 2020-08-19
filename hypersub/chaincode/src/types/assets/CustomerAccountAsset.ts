import {Object, Property} from 'fabric-contract-api'
import {SimDetails} from "../SimDetails";
import {Statement} from "../Statement";
import {BankingDetails, P2PDetails, SepaDetails} from "../BankingDetails";
import {PersonalDetails} from "../PersonalDetails";

@Object()
export class CustomerAccount {

    @Property()
    public accountId: string;

    @Property()
    public isRevoked?: boolean;

    @Property()
    public personalDetails: Array<PersonalDetails>;

    @Property()
    public bankingDetails: Array<BankingDetails<P2PDetails | SepaDetails>>;

    @Property()
    public simDetails: Array<SimDetails>;

    @Property()
    public statement: Statement;

}