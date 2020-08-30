/*
 * SPDX-License-Identifier: Apache-2.0
 */

import {Gateway, Wallets} from 'fabric-network';
import * as path from 'path';
import * as fs from 'fs';


    export const populateNetworkConnection = async () => {
        console.log("populate connection ...")
        try {
            // path to the network connection profile
            const ccpPath = path.resolve(__dirname, '..', '..', '..', 'organizations',
                            'peerOrganizations', 'nexnet.hypersub.com', 'connection-nexnet.json');
            // parsing the network-profile - JSON file
            const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);

            console.log("Check to see if we've already enrolled the user.");
            const identity = await wallet.get('testUser');
            if (!identity) {
                console.log('An identity for the user "testUser" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, {wallet, identity: 'testUser',
                                    discovery: {enabled: true, asLocalhost: true}});

            // Get the network (channel1) our contract is deployed to and return it
            const network = await gateway.getNetwork('channel1');
            return network;
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


