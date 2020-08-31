"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChainCodeCaller {
    constructor(network, chaincodeId = "customeraccountcc") {
        this.network = network;
        this.chaincodeId = chaincodeId;
        this.contract = network.getContract(this.chaincodeId);
    }
    getNetwork() {
        return this.network;
    }
    getChaincodeId() {
        return this.chaincodeId;
    }
    setChaincodeId(chaincodeId) {
        this.chaincodeId = chaincodeId;
    }
    disconnect() {
        this.getNetwork().getGateway().disconnect();
    }
    static deserializeResponse(response) {
        return JSON.parse(response.toString());
    }
    async readInitialLedger() {
        console.log("reading the initialLedger");
        let response = await this.contract.evaluateTransaction('readCustomerAccount', '5d60f057f5294daa7aee33183d3252d1fa78a64da3aee5d8dbdebcbc24c3b809');
        return ChainCodeCaller.deserializeResponse(response);
    }
    async createCustomerTestAccount() {
        console.log("calling createCustomerTestAccount");
        await this.contract.submitTransaction('createCustomerTestAccount');
    }
    async createCustomerTestAccountTwo() {
        console.log("calling createCustomerTestAccountTwo");
        await this.contract.submitTransaction('createCustomerTestAccountTwo');
    }
    async readCustomerAccount(accountId) {
        console.log("calling readCustomerAccount for id: " + accountId);
        let response = await this.contract.evaluateTransaction('readCustomerAccount', accountId);
        console.log("transaction proposal response: ");
        console.log(ChainCodeCaller.deserializeResponse(response));
        return ChainCodeCaller.deserializeResponse(response);
    }
    async changeCustomerAddressFor(accountId, name, forename) {
        console.log("calling changeCustomerAddress");
        console.log("params:");
        console.log(`account: ${accountId}\nname: ${name}\nforename: ${forename}`);
        await this.contract.submitTransaction('changeCustomerAddress', accountId, name, forename, "11111", "UpdateCity", "UpdateStreet", "2", "DE");
    }
    async changeCustomerAddressTest() {
        console.log("calling changeCustomerAddress");
        await this.contract.submitTransaction('changeCustomerAddress', '5d60f057f5294daa7aee33183d3252d1fa78a64da3aee5d8dbdebcbc24c3b809', "Weber", "Julian", "11111", "UpdateCity", "UpdateStreet", "2", "DE");
    }
    async findPersonalDetailIndex(accountId, name, forename) {
        console.log("calling findPersonalDetailIndex");
        console.log("target account: " + accountId);
        console.log(`targeting Person named: ${forename} ${name}`);
        let response = await this.contract.evaluateTransaction("findPersonalDetailIndex", accountId, name, forename);
        return response.toString();
    }
    async createSubscriptionContractForCustomerSim(accountId, imsi) {
        console.log("calling createSubscriptionContractForCustomerSim");
        console.log("target account: " + accountId);
        console.log(`targeting SIM with IMSI: ${imsi}`);
        let response = await this.contract.submitTransaction("createSubscriptionContractForCustomerSim", accountId, imsi);
        return response.toString();
    }
}
exports.ChainCodeCaller = ChainCodeCaller;
//# sourceMappingURL=ChaincodeCaller.js.map