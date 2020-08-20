function createAuditor {

  echo
	echo "Enroll the CA admin for auditor"
  echo
	mkdir -p $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/

	export FABRIC_CA_CLIENT_HOME=$HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/
#  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
#  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:9054 --caname ca-auditor --tls.certfiles $HYPERSUB_BASE/organizations/fabric-ca/auditor/tls-cert.pem
  set +x

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-auditor.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-auditor.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-auditor.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-auditor.pem
    OrganizationalUnitIdentifier: orderer' > $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/msp/config.yaml

  echo
	echo "Register peer0"
  echo
  set -x
	fabric-ca-client register --caname ca-auditor --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles $HYPERSUB_BASE/organizations/fabric-ca/auditor/tls-cert.pem
  set +x

  echo
  echo "Register user: auditoruser"
  echo
  set -x
  fabric-ca-client register --caname ca-auditor --id.name auditoruser --id.secret auditoruserpw --id.type client --tls.certfiles $HYPERSUB_BASE/organizations/fabric-ca/auditor/tls-cert.pem
  set +x

  echo
  echo "Register the organisation admin for auditor"
  echo
  set -x
  fabric-ca-client register --caname ca-auditor --id.name auditoradmin --id.secret auditoradminpw --id.type admin --tls.certfiles $HYPERSUB_BASE/organizations/fabric-ca/auditor/tls-cert.pem
  set +x

	mkdir -p $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/peers
  mkdir -p $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/peers/peer0.auditor.hypersub.com

  echo
  echo "## Generate the peer0 msp for auditor"
  echo
  set -x
	fabric-ca-client enroll -u https://peer0:peer0pw@localhost:9054 --caname ca-auditor -M $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/peers/peer0.auditor.hypersub.com/msp --csr.hosts peer0.auditor.hypersub.com --tls.certfiles $HYPERSUB_BASE/organizations/fabric-ca/auditor/tls-cert.pem
  set +x

  cp $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/msp/config.yaml $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/peers/peer0.auditor.hypersub.com/msp/config.yaml

  echo
  echo "## Generate the peer0-tls certificates for auditor"
  echo
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:9054 --caname ca-auditor -M $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/peers/peer0.auditor.hypersub.com/tls --enrollment.profile tls --csr.hosts peer0.auditor.hypersub.com --csr.hosts localhost --tls.certfiles $HYPERSUB_BASE/organizations/fabric-ca/auditor/tls-cert.pem
  set +x


  cp $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/peers/peer0.auditor.hypersub.com/tls/tlscacerts/* $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/peers/peer0.auditor.hypersub.com/tls/ca.crt
  cp $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/peers/peer0.auditor.hypersub.com/tls/signcerts/* $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/peers/peer0.auditor.hypersub.com/tls/server.crt
  cp $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/peers/peer0.auditor.hypersub.com/tls/keystore/* $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/peers/peer0.auditor.hypersub.com/tls/server.key

  mkdir -p $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/msp/tlscacerts
  cp $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/peers/peer0.auditor.hypersub.com/tls/tlscacerts/* $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/msp/tlscacerts/ca.crt

  mkdir -p $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/tlsca
  cp $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/peers/peer0.auditor.hypersub.com/tls/tlscacerts/* $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/tlsca/tlsca.auditor.hypersub.com-cert.pem

  mkdir -p $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/ca
  cp $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/peers/peer0.auditor.hypersub.com/msp/cacerts/* $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/ca/ca.auditor.hypersub.com-cert.pem

  mkdir -p $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/users
  mkdir -p $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/users/auditoruser@auditor.hypersub.com

  echo
  echo "## Generate the user msp for auditoruser-user"
  echo
  set -x
	fabric-ca-client enroll -u https://auditoruser:auditoruserpw@localhost:9054 --caname ca-auditor -M $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/users/auditoruser@auditor.hypersub.com/msp --tls.certfiles $HYPERSUB_BASE/organizations/fabric-ca/auditor/tls-cert.pem
  set +x

  cp $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/msp/config.yaml $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/users/auditoruser@auditor.hypersub.com/msp/config.yaml

  mkdir -p $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/users/Admin@auditor.hypersub.com

  echo
  echo "## Generate the auditor admin msp"
  echo
  set -x
	fabric-ca-client enroll -u https://auditoradmin:auditoradminpw@localhost:9054 --caname ca-auditor -M $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/users/Admin@auditor.hypersub.com/msp --tls.certfiles $HYPERSUB_BASE/organizations/fabric-ca/auditor/tls-cert.pem
  set +x

  cp $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/msp/config.yaml $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/users/Admin@auditor.hypersub.com/msp/config.yaml

}

