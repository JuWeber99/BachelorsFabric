/*
 * SPDX-License-Identifier: Apache-2.0
 */

import {Gateway, Network, Wallets} from 'fabric-network';
import * as path from 'path';
import * as fs from 'fs';


export const populateNetworkConnection = async (): Promise<Network> => {

    const ccpPath = path.resolve(__dirname, '..', 'gateway');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    const walletPath = path.join(process.cwd(), '..', 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath)
        .catch((err) => {
            throw new Error(err)
        });

    console.log(`Wallet path: ${walletPath}`);
    const identity = await wallet.get('testUser');
    if (!identity) {
        console.log('An identity for the user "testUser" does not exist in the wallet');
        console.log('Run the enrollRegisterUser.ts application before retrying');
        return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {wallet, identity: 'testUser', discovery: {enabled: true, asLocalhost: true}});
    const network = await gateway.getNetwork('channel1');

    if (!network || network === null) {
        throw new Error("Couldnt populate connection to fabric network")
    }
    return network;
}


