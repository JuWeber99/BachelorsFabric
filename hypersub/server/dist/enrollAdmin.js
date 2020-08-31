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
const fabric_ca_client_1 = __importDefault(require("fabric-ca-client"));
const fabric_network_1 = require("fabric-network");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
exports.ccpPath = path.resolve(__dirname, '..', '..', '..', 'organizations', 'peerOrganizations', 'nexnet.hypersub.com', 'connection-nexnet.json');
async function enrollAdmin() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', '..', 'organizations', 'peerOrganizations', 'nexnet.hypersub.com', 'connection-nexnet.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // Create a new CA client for interacting with the CA.
        const caInfo = ccp.certificateAuthorities['ca.nexnet.hypersub.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new fabric_ca_client_1.default(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '..', 'wallet');
        const wallet = await fabric_network_1.Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get('admin');
        if (identity) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            return;
        }
        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'nexnetMSP',
            type: 'X.509',
        };
        await wallet.put('admin', x509Identity);
        console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
    }
    catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
        process.exit(1);
    }
}
enrollAdmin();
//# sourceMappingURL=enrollAdmin.js.map