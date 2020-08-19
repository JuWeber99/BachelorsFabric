function createNexnet {

  echo
	echo "Enroll the CA admin for nexnet"
  echo
	mkdir -p organizations/peerOrganizations/nexnet.hypersub.com/

	export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/nexnet.hypersub.com/
#  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
#  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:7054 --caname ca-nexnet --tls.certfiles ${PWD}/organizations/fabric-ca/nexnet/tls-cert.pem
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
    OrganizationalUnitIdentifier: orderer' > ${PWD}/organizations/peerOrganizations/nexnet.hypersub.com/msp/config.yaml

  echo
	echo "Register peer0"
  echo
  set -x
	fabric-ca-client register --caname ca-nexnet --id.name peer0 --id.secret peer0 --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/nexnet/tls-cert.pem
  set +x

  echo
  echo "Register user: Julian"
  echo
  set -x
  fabric-ca-client register --caname ca-nexnet --id.name Julian --id.secret Julian --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/nexnet/tls-cert.pem
  set +x

  echo
  echo "Register the organisation admin for nexnet"
  echo
  set -x
  fabric-ca-client register --caname ca-nexnet --id.name nexnetadmin --id.secret nexnetadmin --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/nexnet/tls-cert.pem
  set +x

	mkdir -p organizations/peerOrganizations/nexnet.hypersub.com/peers
  mkdir -p organizations/peerOrganizations/nexnet.hypersub.com/peers/peer0.nexnet.hypersub.com

  echo
  echo "## Generate the peer0 msp for nexnet"
  echo
  set -x
	fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-nexnet -M ${PWD}/organizations/peerOrganizations/nexnet.hypersub.com/peers/peer0.nexnet.hypersub.com/msp --csr.hosts peer0.nexnet.hypersub.com --tls.certfiles ${PWD}/organizations/fabric-ca/nexnet/tls-cert.pem
  set +x

  cp ${PWD}/organizations/peerOrganizations/nexnet.hypersub.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/nexnet.hypersub.com/peers/peer0.nexnet.hypersub.com/msp/config.yaml

  echo
  echo "## Generate the peer0-tls certificates for nexnet"
  echo
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-nexnet -M ${PWD}/organizations/peerOrganizations/nexnet.hypersub.com/peers/peer0.nexnet.hypersub.com/tls --enrollment.profile tls --csr.hosts peer0.nexnet.hypersub.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/nexnet/tls-cert.pem
  set +x


  cp ${PWD}/organizations/peerOrganizations/nexnet.hypersub.com/peers/peer0.nexnet.hypersub.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/nexnet.hypersub.com/peers/peer0.nexnet.hypersub.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/nexnet.hypersub.com/peers/peer0.nexnet.hypersub.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/nexnet.hypersub.com/peers/peer0.nexnet.hypersub.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/nexnet.hypersub.com/peers/peer0.nexnet.hypersub.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/nexnet.hypersub.com/peers/peer0.nexnet.hypersub.com/tls/server.key

  mkdir -p ${PWD}/organizations/peerOrganizations/nexnet.hypersub.com/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/nexnet.hypersub.com/peers/peer0.nexnet.hypersub.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/nexnet.hypersub.com/msp/tlscacerts/ca.crt

  mkdir -p ${PWD}/organizations/peerOrganizations/nexnet.hypersub.com/tlsca
  cp ${PWD}/organizations/peerOrganizations/nexnet.hypersub.com/peers/peer0.nexnet.hypersub.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/nexnet.hypersub.com/tlsca/tlsca.nexnet.hypersub.com-cert.pem

  mkdir -p ${PWD}/organizations/peerOrganizations/nexnet.hypersub.com/ca
  cp ${PWD}/organizations/peerOrganizations/nexnet.hypersub.com/peers/peer0.nexnet.hypersub.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/nexnet.hypersub.com/ca/ca.nexnet.hypersub.com-cert.pem

  mkdir -p organizations/peerOrganizations/nexnet.hypersub.com/users
  mkdir -p organizations/peerOrganizations/nexnet.hypersub.com/users/Julian@nexnet.hypersub.com

  echo
  echo "## Generate the user msp for Julian user"
  echo
  set -x
	fabric-ca-client enroll -u https://Julian:Julian@localhost:7054 --caname ca-nexnet -M ${PWD}/organizations/peerOrganizations/nexnet.hypersub.com/users/Julian@nexnet.hypersub.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/nexnet/tls-cert.pem
  set +x

  cp ${PWD}/organizations/peerOrganizations/nexnet.hypersub.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/nexnet.hypersub.com/users/Julian@nexnet.hypersub.com/msp/config.yaml

  mkdir -p organizations/peerOrganizations/nexnet.hypersub.com/users/Admin@nexnet.hypersub.com

  echo
  echo "## Generate the nexnet admin msp"
  echo
  set -x
	fabric-ca-client enroll -u https://nexnetadmin:nexnetadminpw@localhost:7054 --caname ca-nexnet -M ${PWD}/organizations/peerOrganizations/nexnet.hypersub.com/users/Admin@nexnet.hypersub.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/nexnet/tls-cert.pem
  set +x

  cp ${PWD}/organizations/peerOrganizations/nexnet.hypersub.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/nexnet.hypersub.com/users/Admin@nexnet.hypersub.com/msp/config.yaml

}
