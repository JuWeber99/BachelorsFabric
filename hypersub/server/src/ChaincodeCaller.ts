import {Contract, Network} from "fabric-network";
import {populateNetworkConnection as netConnection} from "./NetConnection";
import {testAddress} from "../data/initialTestLedger";

export class ChainCodeCaller {

    private network: Network
    private chaincodeId: string
    private contract: Contract;

    constructor(network: Network) {
        this.network = network;
        this.chaincodeId = "customeraccountcc"
        this.contract = this.network.getContract(this.chaincodeId);
    }

    getNetwork() {
        return this.network;
    }

    getChaincodeId() {
        return this.chaincodeId;
    }

    setChaincodeId(chaincodeId: string) {
        this.chaincodeId = chaincodeId;
    }

    callChaincode(func: Function): Promise<any> {
        let contract = this.getNetwork().getContract(this.getChaincodeId())
        return
    }

    async readInitialLedger() {
        console.log("reading the initialLedger")
        let readRes1 = await this.contract.evaluateTransaction('readCustomerAccount', '5d60f057f5294daa7aee33183d3252d1fa78a64da3aee5d8dbdebcbc24c3b809');
        console.log(readRes1.toString())
    }

    async createCustomerTestAccount() {
        console.log("calling createCustomerTestAccount")
        let createRes1 = await this.contract.submitTransaction('createCustomerTestAccount');
        console.log(createRes1.toString())
    }

    async createCustomerTestAccountTwo() {
        console.log("calling createCustomerTestAccountTwo")
        let createRes2 = await this.contract.submitTransaction('createCustomerTestAccountTwo');
        console.log(createRes2.toString())
    }

    async readCustomerAccount(accountId: string) {
        console.log("calling changeCustomerAddress")
        let readRes2 = await this.contract.evaluateTransaction('readCustomerAccount', accountId);
        console.log(readRes2.toString())
    }

    async changeCustomerAddress() {
        console.log("calling changeCustomerAddress")
        let readRes3 = await this.contract.submitTransaction('cafca', 'guhidasfg238r766grzseugc97dsaftg67sadfadsf23', "Weber", "Julian",
            "11111", "UpdateCity", "UpdateStreet", "2", testAddress.country);
        console.log(readRes3.toString())
    }

}