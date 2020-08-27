/*
 * SPDX-License-Identifier: Apache-2.0
 */

import {Gateway, Network, Wallets} from 'fabric-network';
import * as path from 'path';
import * as fs from 'fs';
import {ccpPath} from "./enrollAdmin";

// const ccpPath = path.resolve(__dirname, '..', '..', '..', 'organizations', 'peerOrganizations', 'nexnet.hypersub.com', 'connection-nexnet.json');
export const populateNetworkConnection = async () => {
    console.log("populate connection ...")
    try {
        const ccpPath = path.resolve(__dirname, '..', 'gateway', 'connection-nexnet.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        console.log(ccp)
        console.log(ccp.toString())
// Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        console.log("Check to see if we've already enrolled the user.");
        const identity = await wallet.get('testUser');
        if (!identity) {
            console.log('An identity for the user "testUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {wallet, identity: 'testUser', discovery: {enabled: true, asLocalhost: true}});

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('channel1');

        // Get the contract from the network.
       // return network.getContract('customeraccountcc');
        return network;
        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
    } catch (error) {
        console.error(`Failed to get network connection: ${error}`);
        process.exit(1);
    }


    // const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    // const walletPath = path.join(process.cwd(), '..', 'wallet', 'testUser');
    // const wallet = await Wallets.newFileSystemWallet(walletPath);
    //
    // console.log(`Wallet path: ${walletPath}`);
    // const identity = await wallet.get('Context');
    //
    // if (!identity) {
    //     console.log('An identity for the user "test" does not exist in the wallet');
    //     console.log('Run the enrollRegisterUser.ts application before retrying');
    //     return;
    // }
    // const gateway = new Gateway();
    // await gateway.connect(ccp, {wallet, identity: 'testUser', discovery: {enabled: true, asLocalhost: true}});
    // const network = await gateway.getNetwork('channel1');
    //
    // if (!network || network === null) {
    //     throw new Error("Couldnt populate connection to fabric network")
    // }
    // return network;
}


