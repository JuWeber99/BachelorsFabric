"use strict";
/*
 * SPDX-License-Identifier: Apache-2.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_network_1 = require("fabric-network");
const fabric_ca_client_1 = __importDefault(require("fabric-ca-client"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', '..', 'organizations', 'peerOrganizations', 'nexnet.hypersub.com', 'connection-nexnet.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // Create a new CA client for interacting with the CA.
        const caInfo = ccp.certificateAuthorities['ca.nexnet.hypersub.com'];
        const ca = new fabric_ca_client_1.default(caInfo.url, { trustedRoots: caInfo.pem, verify: false }, caInfo.caName);
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '..', 'wallet');
        const wallet = await fabric_network_1.Wallets.newFileSystemWallet(walletPath);
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
        const enrollment = await ca.enroll({ enrollmentID: 'testUser', enrollmentSecret: secret });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'nexnetMSP',
            type: 'X.509',
        };
        await wallet.put('testUser', x509Identity);
        console.log('Successfully registered and enrolled admin user "testUser" and imported it into the wallet');
    }
    catch (error) {
        console.error(`Failed to register user "testUser": ${error}`);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=enrollRegisterUser.js.map