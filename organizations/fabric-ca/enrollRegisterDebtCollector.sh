function createDebtCollector {

  echo
	echo "Enroll the CA admin for debtcollector"
  echo
	mkdir -p $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/

	export FABRIC_CA_CLIENT_HOME=$HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/
#  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
#  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:10054 --caname ca-debtcollector --tls.certfiles $HYPERSUB_BASE/organizations/fabric-ca/debtcollector/tls-cert.pem
  set +x

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-10054-ca-debtcollector.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-10054-ca-debtcollector.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-10054-ca-debtcollector.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-10054-ca-debtcollector.pem
    OrganizationalUnitIdentifier: orderer' > $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/msp/config.yaml

  echo
	echo "Register peer0"
  echo
  set -x
	fabric-ca-client register --caname ca-debtcollector --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles $HYPERSUB_BASE/organizations/fabric-ca/debtcollector/tls-cert.pem
  set +x

  echo
  echo "Register user: debtcollectoruser"
  echo
  set -x
  fabric-ca-client register --caname ca-debtcollector --id.name debtcollectoruser --id.secret debtcollectoruserpw --id.type client --tls.certfiles $HYPERSUB_BASE/organizations/fabric-ca/debtcollector/tls-cert.pem
  set +x

  echo
  echo "Register the organisation admin for debtcollector"
  echo
  set -x
  fabric-ca-client register --caname ca-debtcollector --id.name debtcollectoradmin --id.secret debtcollectoradminpw --id.type admin --tls.certfiles $HYPERSUB_BASE/organizations/fabric-ca/debtcollector/tls-cert.pem
  set +x

	mkdir -p $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/peers
  mkdir -p $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/peers/peer0.debtcollector.hypersub.com

  echo
  echo "## Generate the peer0 msp for debtcollector"
  echo
  set -x
	fabric-ca-client enroll -u https://peer0:peer0pw@localhost:10054 --caname ca-debtcollector -M $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/peers/peer0.debtcollector.hypersub.com/msp --csr.hosts peer0.debtcollector.hypersub.com --tls.certfiles $HYPERSUB_BASE/organizations/fabric-ca/debtcollector/tls-cert.pem
  set +x

  cp $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/msp/config.yaml $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/peers/peer0.debtcollector.hypersub.com/msp/config.yaml

  echo
  echo "## Generate the peer0-tls certificates for debtcollector"
  echo
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:10054 --caname ca-debtcollector -M $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/peers/peer0.debtcollector.hypersub.com/tls --enrollment.profile tls --csr.hosts peer0.debtcollector.hypersub.com --csr.hosts localhost --tls.certfiles $HYPERSUB_BASE/organizations/fabric-ca/debtcollector/tls-cert.pem
  set +x


  cp $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/peers/peer0.debtcollector.hypersub.com/tls/tlscacerts/* $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/peers/peer0.debtcollector.hypersub.com/tls/ca.crt
  cp $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/peers/peer0.debtcollector.hypersub.com/tls/signcerts/* $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/peers/peer0.debtcollector.hypersub.com/tls/server.crt
  cp $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/peers/peer0.debtcollector.hypersub.com/tls/keystore/* $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/peers/peer0.debtcollector.hypersub.com/tls/server.key

  mkdir -p $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/msp/tlscacerts
  cp $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/peers/peer0.debtcollector.hypersub.com/tls/tlscacerts/* $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/msp/tlscacerts/ca.crt

  mkdir -p $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/tlsca
  cp $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/peers/peer0.debtcollector.hypersub.com/tls/tlscacerts/* $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/tlsca/tlsca.debtcollector.hypersub.com-cert.pem

  mkdir -p $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/ca
  cp $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/peers/peer0.debtcollector.hypersub.com/msp/cacerts/* $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/ca/ca.debtcollector.hypersub.com-cert.pem

  mkdir -p $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/users
  mkdir -p $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/users/debtcollectoruser@debtcollector.hypersub.com

  echo
  echo "## Generate the user msp for debtcollectoruser-user"
  echo
  set -x
	fabric-ca-client enroll -u https://debtcollectoruser:debtcollectoruserpw@localhost:10054 --caname ca-debtcollector -M $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/users/debtcollectoruser@debtcollector.hypersub.com/msp --tls.certfiles $HYPERSUB_BASE/organizations/fabric-ca/debtcollector/tls-cert.pem
  set +x

  cp $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/msp/config.yaml $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/users/debtcollectoruser@debtcollector.hypersub.com/msp/config.yaml

  mkdir -p $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/users/Admin@debtcollector.hypersub.com

  echo
  echo "## Generate the debtcollector admin msp"
  echo
  set -x
	fabric-ca-client enroll -u https://debtcollectoradmin:debtcollectoradminpw@localhost:10054 --caname ca-debtcollector -M $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/users/Admin@debtcollector.hypersub.com/msp --tls.certfiles $HYPERSUB_BASE/organizations/fabric-ca/debtcollector/tls-cert.pem
  set +x

  cp $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/msp/config.yaml $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/users/Admin@debtcollector.hypersub.com/msp/config.yaml

}

