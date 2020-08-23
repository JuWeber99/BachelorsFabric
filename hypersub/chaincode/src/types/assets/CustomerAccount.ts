import {Object, Property} from 'fabric-contract-api'
import {SimDetails} from "../SimDetails";
import {Statement} from "../Statement";
import {BankingDetails, P2PDetails, SepaDetails} from "../BankingDetails";
import {PersonalDetails} from "../PersonalDetails";
import {State} from "../../State";
import {testAccount2} from "../../../../server/testing/initialTestLedger";

@Object()
export class CustomerAccount extends State {

    protected accountId: string;
    protected isRevoked?: boolean;
    protected personalDetails: Array<PersonalDetails>;
    protected bankingDetails: Array<BankingDetails<P2PDetails | SepaDetails>>;
    protected simDetails: Array<SimDetails>;
    protected statement: Statement;

    constructor(obj: CustomerAccount) {
        super(CustomerAccount.getClass(), [obj.accountId])
    }

    static getClass() {
        return 'nexnet.hypersub.customeraccount';
    }


    getAccountId(): string {
        return this.accountId;
    }

    setSetAccountId(value: string) {
        this.accountId = value;
    }

    getIsRevoked(): boolean {
        return this.isRevoked;
    }

    setIsRevoked(value: boolean) {
        this.isRevoked = value;
    }

    getPersonalDetails(): Array<PersonalDetails> {
        return this.personalDetails;
    }

    setPersonalDetails(value: Array<PersonalDetails>) {
        this.personalDetails = value;
    }

    getBankingDetails(): Array<BankingDetails<P2PDetails | SepaDetails>> {
        return this.bankingDetails;
    }

    setBankingDetails(value: Array<BankingDetails<P2PDetails | SepaDetails>>) {
        this.bankingDetails = value;
    }

    getSimDetails(): Array<SimDetails> {
        return this.simDetails;
    }

    setSimDetails(value: Array<SimDetails>) {
        this.simDetails = value;
    }

    getStatement(): Statement {
        return this.statement;
    }

    setStatement(value: Statement) {
        this.statement = value;
    }

    static fromBuffer(buffer) {
        return CustomerAccount.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, CustomerAccount);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(obj) {
        return new CustomerAccount(obj);
    }
    
}