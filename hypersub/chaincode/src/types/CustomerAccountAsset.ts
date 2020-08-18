import {Object, Property} from 'fabric-contract-api'
import {SimDetails} from "./SimDetails";
import {Wallet} from "./Wallet";
import {BankingDetails, P2PDetails, SepaDetails} from "./BankingDetails";
import {PersonalDetails} from "./PersonalDetails";

@Object()
export class CustomerAccount {

    @Property()
    public accountId: string;

    @Property()
    public isRevoked?: boolean;

    @Property()
    public personalDetails: PersonalDetails;

    @Property()
    public bankingDetails: BankingDetails<P2PDetails | SepaDetails>;

    @Property()
    public simDetails: SimDetails;

    @Property()
    public wallet: Wallet;

}