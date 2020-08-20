function createNexnet {

  echo
	echo "Enroll the CA admin for nexnet"
  echo
	mkdir -p $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/

	export FABRIC_CA_CLIENT_HOME=$HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/
#  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
#  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:7054 --caname ca-nexnet --tls.certfiles $HYPERSUB_BASE/organizations/fabric-ca/nexnet/tls-cert.pem
  set +x

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-nexnet.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-nexnet.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-nexnet.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-nexnet.pem
    OrganizationalUnitIdentifier: orderer' > $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/msp/config.yaml

  echo
	echo "Register peer0"
  echo
  set -x
	fabric-ca-client register --caname ca-nexnet --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles $HYPERSUB_BASE/organizations/fabric-ca/nexnet/tls-cert.pem
  set +x

  echo
  echo "Register user: nexnetuser"
  echo
  set -x
  fabric-ca-client register --caname ca-nexnet --id.name nexnetuser --id.secret nexnetuserpw --id.type client --tls.certfiles $HYPERSUB_BASE/organizations/fabric-ca/nexnet/tls-cert.pem
  set +x

  echo
  echo "Register the organisation admin for nexnet"
  echo
  set -x
  fabric-ca-client register --caname ca-nexnet --id.name nexnetadmin --id.secret nexnetadminpw --id.type admin --tls.certfiles $HYPERSUB_BASE/organizations/fabric-ca/nexnet/tls-cert.pem
  set +x

	mkdir -p $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/peers
  mkdir -p $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/peers/peer0.nexnet.hypersub.com

  echo
  echo "## Generate the peer0 msp for nexnet"
  echo
  set -x
	fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-nexnet -M $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/peers/peer0.nexnet.hypersub.com/msp --csr.hosts peer0.nexnet.hypersub.com --tls.certfiles $HYPERSUB_BASE/organizations/fabric-ca/nexnet/tls-cert.pem
  set +x

  cp $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/msp/config.yaml $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/peers/peer0.nexnet.hypersub.com/msp/config.yaml

  echo
  echo "## Generate the peer0-tls certificates for nexnet"
  echo
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-nexnet -M $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/peers/peer0.nexnet.hypersub.com/tls --enrollment.profile tls --csr.hosts peer0.nexnet.hypersub.com --csr.hosts localhost --tls.certfiles $HYPERSUB_BASE/organizations/fabric-ca/nexnet/tls-cert.pem
  set +x


  cp $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/peers/peer0.nexnet.hypersub.com/tls/tlscacerts/* $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/peers/peer0.nexnet.hypersub.com/tls/ca.crt
  cp $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/peers/peer0.nexnet.hypersub.com/tls/signcerts/* $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/peers/peer0.nexnet.hypersub.com/tls/server.crt
  cp $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/peers/peer0.nexnet.hypersub.com/tls/keystore/* $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/peers/peer0.nexnet.hypersub.com/tls/server.key

  mkdir -p $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/msp/tlscacerts
  cp $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/peers/peer0.nexnet.hypersub.com/tls/tlscacerts/* $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/msp/tlscacerts/ca.crt

  mkdir -p $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/tlsca
  cp $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/peers/peer0.nexnet.hypersub.com/tls/tlscacerts/* $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/tlsca/tlsca.nexnet.hypersub.com-cert.pem

  mkdir -p $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/ca
  cp $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/peers/peer0.nexnet.hypersub.com/msp/cacerts/* $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/ca/ca.nexnet.hypersub.com-cert.pem

  mkdir -p $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/users
  mkdir -p $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/users/nexnetuser@nexnet.hypersub.com

  echo
  echo "## Generate the user msp for nexnetuser-user"
  echo
  set -x
	fabric-ca-client enroll -u https://nexnetuser:nexnetuserpw@localhost:7054 --caname ca-nexnet -M $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/users/nexnetuser@nexnet.hypersub.com/msp --tls.certfiles $HYPERSUB_BASE/organizations/fabric-ca/nexnet/tls-cert.pem
  set +x

  cp $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/msp/config.yaml $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/users/nexnetuser@nexnet.hypersub.com/msp/config.yaml

  mkdir -p $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/users/Admin@nexnet.hypersub.com

  echo
  echo "## Generate the nexnet admin msp"
  echo
  set -x
	fabric-ca-client enroll -u https://nexnetadmin:nexnetadminpw@localhost:7054 --caname ca-nexnet -M $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/users/Admin@nexnet.hypersub.com/msp --tls.certfiles $HYPERSUB_BASE/organizations/fabric-ca/nexnet/tls-cert.pem
  set +x

  cp $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/msp/config.yaml $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/users/Admin@nexnet.hypersub.com/msp/config.yaml

}

