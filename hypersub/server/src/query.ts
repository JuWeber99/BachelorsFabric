/*
 * SPDX-License-Identifier: Apache-2.0
 */

import {Gateway, Wallets} from 'fabric-network';
import * as path from 'path';
import * as fs from 'fs';

async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', '..', 'organizations', 'peerOrganizations', 'nexnet.hypersub.com', 'connection-nexnet.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(),'..', 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('testUser');
        if (!identity) {
            console.log('An identity for the user "testUser" does not exist in the wallet');
            console.log('Run the enrollRegisterUser.ts application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {wallet, identity: 'testUser', discovery: {enabled: true, asLocalhost: true}});

        const network = await gateway.getNetwork('channel1');

        const contract = network.getContract('customeraccountcc');

        // test query
        await contract.submitTransaction('createCustomerTestAccountTwo');


        await gateway.disconnect();
    } catch
        (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
