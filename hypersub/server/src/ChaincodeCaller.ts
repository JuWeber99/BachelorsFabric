import {Contract, Network} from "fabric-network";

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


    async readInitialLedger(): Promise<string> {
        console.log("reading the initialLedger")
        let response = await this.contract.evaluateTransaction('readCustomerAccount', '5d60f057f5294daa7aee33183d3252d1fa78a64da3aee5d8dbdebcbc24c3b809');
        return response.toString()
    }

    async createCustomerTestAccount(): Promise<void> {
        console.log("calling createCustomerTestAccount")
        let response = await this.contract.submitTransaction('createCustomerTestAccount');
        console.log(response.toString())
    }

    async createCustomerTestAccountTwo(): Promise<void> {
        console.log("calling createCustomerTestAccountTwo")
        let response = await this.contract.submitTransaction('createCustomerTestAccountTwo');
        console.log(response.toString())
    }

    async readCustomerAccount(accountId: string): Promise<string> {
        console.log("calling changeCustomerAddress")
        let response = await this.contract.evaluateTransaction('readCustomerAccount', accountId);
        return response.toString()
    }

    async changeCustomerAddress(): Promise<void> {
        console.log("calling changeCustomerAddress")
        let response = await this.contract.submitTransaction('cafca', 'guhidasfg238r766grzseugc97dsaftg67sadfadsf23', "Weber", "Julian",
            "11111", "UpdateCity", "UpdateStreet", "2", "DE");
        console.log(response.toString())
    }

}