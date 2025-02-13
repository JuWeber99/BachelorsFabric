/*
 * SPDX-License-Identifier: Apache-2.0
 */

import {Wallets, X509Identity} from 'fabric-network';
import FabricCAServices from 'fabric-ca-client';
import * as path from 'path';
import * as fs from 'fs';

async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', '..', 'organizations', 'peerOrganizations', 'nexnet.hypersub.com', 'connection-nexnet.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caInfo = ccp.certificateAuthorities['ca.nexnet.hypersub.com'];
        const ca = new FabricCAServices(caInfo.url, {trustedRoots: caInfo.pem, verify: false}, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(),'..', 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);


        // Check to see if we've already enrolled the user.
        const userIdentity = await wallet.get('testUser');
        if (userIdentity) {
            console.log('An identity for the user "testUser" already exists in the wallet');
            return;
        }

        // Check to see if we've already enrolled the admin user.
        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            console.log('An identity for the admin user "admin" does not exist in the wallet');
            console.log('Run the enrollAdmin.ts application before retrying');
            return;
        }

        // build a user object for authenticating with the CA
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({
            affiliation: '',
            enrollmentID: 'testUser',
            role: 'client'
        }, adminUser);

        const enrollment = await ca.enroll({enrollmentID: 'testUser', enrollmentSecret: secret});
        const x509Identity: X509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'nexnetMSP',
            type: 'X.509',
        };
        await wallet.put('testUser', x509Identity);
        console.log('Successfully registered and enrolled admin user "testUser" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to register user "testUser": ${error}`);
        process.exit(1);
    }
}

main();
