import { Network } from "fabric-network";
export declare class ChainCodeCaller {
    private network;
    private chaincodeId;
    private contract;
    constructor(network: Network, chaincodeId?: string);
    getNetwork(): Network;
    getChaincodeId(): any;
    setChaincodeId(chaincodeId: string): void;
    disconnect(): void;
    static deserializeResponse(response: Buffer): any;
    readInitialLedger(): Promise<string>;
    createCustomerTestAccount(): Promise<void>;
    createCustomerTestAccountTwo(): Promise<void>;
    readCustomerAccount(accountId: string): Promise<string>;
    changeCustomerAddressFor(accountId: string, name: string, forename: string): Promise<void>;
    changeCustomerAddressTest(): Promise<void>;
    findPersonalDetailIndex(accountId: string, name: string, forename: string): Promise<string>;
    createSubscriptionContractForCustomerSim(accountId: string, imsi: string): Promise<string>;
}
