import {Object, Property} from 'fabric-contract-api'
import {SimDetails} from "../SimDetails";
import {Statement} from "../Statement";
import {BankingDetails, P2PDetails, SepaDetails} from "../BankingDetails";
import {PersonalDetails} from "../PersonalDetails";
import {State} from "../../State";
import {testAccount2} from "../../../../server/testing/initialTestLedger";

@Object()
export class CustomerAccount extends State {

    private _accountId: string;
    private _isRevoked?: boolean;
    private _personalDetails: Array<PersonalDetails>;
    private _bankingDetails: Array<BankingDetails<P2PDetails | SepaDetails>>;
    private _simDetails: Array<SimDetails>;
    private _statement: Statement;

    constructor(obj: CustomerAccount) {
        super(CustomerAccount.getClass(), [obj._accountId])
    }

    static getClass() {
        return 'nexnet.hypersub.customeraccount';
    }


    get accountId(): string {
        return this._accountId;
    }

    set accountId(value: string) {
        this._accountId = value;
    }

    get isRevoked(): boolean {
        return this._isRevoked;
    }

    set isRevoked(value: boolean) {
        this._isRevoked = value;
    }

    get personalDetails(): Array<PersonalDetails> {
        return this._personalDetails;
    }

    set personalDetails(value: Array<PersonalDetails>) {
        this._personalDetails = value;
    }

    get bankingDetails(): Array<BankingDetails<P2PDetails | SepaDetails>> {
        return this._bankingDetails;
    }

    set bankingDetails(value: Array<BankingDetails<P2PDetails | SepaDetails>>) {
        this._bankingDetails = value;
    }

    get simDetails(): Array<SimDetails> {
        return this._simDetails;
    }

    set simDetails(value: Array<SimDetails>) {
        this._simDetails = value;
    }

    get statement(): Statement {
        return this._statement;
    }

    set statement(value: Statement) {
        this._statement = value;
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