import {Contract, Network} from "fabric-network";

export class ChainCodeCaller {

    private network: Network
    private chaincodeId;
    private contract: Contract;

    constructor(network: Network) {
        this.network = network;
        this.chaincodeId = "customeraccountcc"
        this.contract = network.getContract(this.chaincodeId)
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

    disconnect() {
        this.getNetwork().getGateway().disconnect();
    }

    static deserializeResponse(response: Buffer) {
        return JSON.parse(response.toString())
    }

    async readInitialLedger(): Promise<string> {
        console.log("reading the initialLedger")
        let response = await this.contract.evaluateTransaction('readCustomerAccount', '5d60f057f5294daa7aee33183d3252d1fa78a64da3aee5d8dbdebcbc24c3b809');
        return ChainCodeCaller.deserializeResponse(response)
    }

    async createCustomerTestAccount(): Promise<void> {
        console.log("calling createCustomerTestAccount")
        await this.contract.submitTransaction('createCustomerTestAccount');
    }

    async createCustomerTestAccountTwo(): Promise<void> {
        console.log("calling createCustomerTestAccountTwo")
        await this.contract.submitTransaction('createCustomerTestAccountTwo');
    }

    async readCustomerAccount(accountId: string): Promise<string> {
        console.log("calling readCustomerAccount for id: "+accountId)
        let response = await this.contract.evaluateTransaction('readCustomerAccount', accountId);
        console.log("Found something: +")
        console.log(ChainCodeCaller.deserializeResponse(response))
        return ChainCodeCaller.deserializeResponse(response)
    }

    async changeCustomerAddress(): Promise<void> {
        console.log("calling changeCustomerAddress")
        await this.contract.submitTransaction('changeCustomerAddress', 'guhidasfg238r766grzseugc97dsaftg67sadfadsf23', "Weber", "Julian",
            "11111", "UpdateCity", "UpdateStreet", "2", "DE");
    }

    async findPersonalDetailIndex(accountId: string, name: string, forename: string) {
        console.log("calling findPersonalDetailIndex")
        console.log("target account: " + accountId)
        console.log(`targeting Person named: ${forename} ${name}`)
        let response = await this.contract.evaluateTransaction("findPersonalDetailIndex", accountId, name, forename);
        return response.toString();
    }

}