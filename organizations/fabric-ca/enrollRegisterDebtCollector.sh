function createDebtCollector {

  echo
	echo "Enroll the CA admin for the debt collector"
  echo
	mkdir -p organizations/peerOrganizations/debtcollector.hypersub.com/

	export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/debtcollector.hypersub.com/
#  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
#  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:10054 --caname ca-debtcollector --tls.certfiles ${PWD}/organizations/fabric-ca/debtcollector/tls-cert.pem
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
    OrganizationalUnitIdentifier: orderer' > ${PWD}/organizations/peerOrganizations/debtcollector.hypersub.com/msp/config.yaml

  echo
	echo "Register peer0"
  echo
  set -x
	fabric-ca-client register --caname ca-debtcollector --id.name peer0 --id.secret peer0 --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/debtcollector/tls-cert.pem
  set +x

  echo
  echo "Register user: DebtCollectorUser"
  echo
  set -x
  fabric-ca-client register --caname ca-debtcollector --id.name DebtCollectorUser --id.secret DebtCollectorUser --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/debtcollector/tls-cert.pem
  set +x

  echo
  echo "Register the organisation admin for debtcollector"
  echo
  set -x
  fabric-ca-client register --caname ca-debtcollector --id.name debtcollectoradmin --id.secret debtcollectoradmin --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/debtcollector/tls-cert.pem
  set +x

	mkdir -p organizations/peerOrganizations/debtcollector.hypersub.com/peers
  mkdir -p organizations/peerOrganizations/debtcollector.hypersub.com/peers/peer0.debtcollector.hypersub.com

  echo
  echo "## Generate the peer0 msp for debtcollector"
  echo
  set -x
	fabric-ca-client enroll -u https://peer0:peer0pw@localhost:10054 --caname ca-debtcollector -M ${PWD}/organizations/peerOrganizations/debtcollector.hypersub.com/peers/peer0.debtcollector.hypersub.com/msp --csr.hosts peer0.debtcollector.hypersub.com --tls.certfiles ${PWD}/organizations/fabric-ca/debtcollector/tls-cert.pem
  set +x

  cp ${PWD}/organizations/peerOrganizations/debtcollector.hypersub.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/debtcollector.hypersub.com/peers/peer0.debtcollector.hypersub.com/msp/config.yaml

  echo
  echo "## Generate the peer0-tls certificates for debtcollector"
  echo
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:10054 --caname ca-debtcollector -M ${PWD}/organizations/peerOrganizations/debtcollector.hypersub.com/peers/peer0.debtcollector.hypersub.com/tls --enrollment.profile tls --csr.hosts peer0.debtcollector.hypersub.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/debtcollector/tls-cert.pem
  set +x


  cp ${PWD}/organizations/peerOrganizations/debtcollector.hypersub.com/peers/peer0.debtcollector.hypersub.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/debtcollector.hypersub.com/peers/peer0.debtcollector.hypersub.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/debtcollector.hypersub.com/peers/peer0.debtcollector.hypersub.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/debtcollector.hypersub.com/peers/peer0.debtcollector.hypersub.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/debtcollector.hypersub.com/peers/peer0.debtcollector.hypersub.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/debtcollector.hypersub.com/peers/peer0.debtcollector.hypersub.com/tls/server.key

  mkdir -p ${PWD}/organizations/peerOrganizations/debtcollector.hypersub.com/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/debtcollector.hypersub.com/peers/peer0.debtcollector.hypersub.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/debtcollector.hypersub.com/msp/tlscacerts/ca.crt

  mkdir -p ${PWD}/organizations/peerOrganizations/debtcollector.hypersub.com/tlsca
  cp ${PWD}/organizations/peerOrganizations/debtcollector.hypersub.com/peers/peer0.debtcollector.hypersub.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/debtcollector.hypersub.com/tlsca/tlsca.debtcollector.hypersub.com-cert.pem

  mkdir -p ${PWD}/organizations/peerOrganizations/debtcollector.hypersub.com/ca
  cp ${PWD}/organizations/peerOrganizations/debtcollector.hypersub.com/peers/peer0.debtcollector.hypersub.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/debtcollector.hypersub.com/ca/ca.debtcollector.hypersub.com-cert.pem

  mkdir -p organizations/peerOrganizations/debtcollector.hypersub.com/users
  mkdir -p organizations/peerOrganizations/debtcollector.hypersub.com/users/DebtCollectorUser@debtcollector.hypersub.com

  echo
  echo "## Generate the user msp for DebtCollectorUser"
  echo
  set -x
	fabric-ca-client enroll -u https://DebtCollectorUser:DebtCollectorUser@localhost:10054 --caname ca-debtcollector -M ${PWD}/organizations/peerOrganizations/debtcollector.hypersub.com/users/DebtCollectorUser@debtcollector.hypersub.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/debtcollector/tls-cert.pem
  set +x

  cp ${PWD}/organizations/peerOrganizations/debtcollector.hypersub.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/debtcollector.hypersub.com/users/DebtCollectorUser@debtcollector.hypersub.com/msp/config.yaml

  mkdir -p organizations/peerOrganizations/debtcollector.hypersub.com/users/Admin@debtcollector.hypersub.com

  echo
  echo "## Generate the debtcollector admin msp"
  echo
  set -x
	fabric-ca-client enroll -u https://debtcollectoradmin:debtcollectoradminpw@localhost:10054 --caname ca-debtcollector -M ${PWD}/organizations/peerOrganizations/debtcollector.hypersub.com/users/Admin@debtcollector.hypersub.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/debtcollector/tls-cert.pem
  set +x

  cp ${PWD}/organizations/peerOrganizations/debtcollector.hypersub.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/debtcollector.hypersub.com/users/Admin@debtcollector.hypersub.com/msp/config.yaml

}

