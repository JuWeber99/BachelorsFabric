
function createXorg {

  echo
	echo "Enroll the CA admin for xorg"
  echo
	mkdir -p organizations/peerOrganizations/xorg.hypersub.com/

	export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/xorg.hypersub.com/
#  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
#  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:8054 --caname ca-xorg --tls.certfiles ${PWD}/organizations/fabric-ca/xorg/tls-cert.pem
  set +x

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-xorg.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-xorg.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-xorg.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-xorg.pem
    OrganizationalUnitIdentifier: orderer' > ${PWD}/organizations/peerOrganizations/xorg.hypersub.com/msp/config.yaml

  echo
	echo "Register peer0"
  echo
  set -x
	fabric-ca-client register --caname ca-xorg --id.name peer0 --id.secret peer0 --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/xorg/tls-cert.pem
  set +x

  echo
  echo "Register user: XorgUser"
  echo
  set -x
  fabric-ca-client register --caname ca-xorg --id.name xorgUser --id.secret xorgUser --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/xorg/tls-cert.pem
  set +x

  echo
  echo "Register the organisation admin for xorg"
  echo
  set -x
  fabric-ca-client register --caname ca-xorg --id.name xorgadmin --id.secret xorgadmin --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/xorg/tls-cert.pem
  set +x

	mkdir -p organizations/peerOrganizations/xorg.hypersub.com/peers
  mkdir -p organizations/peerOrganizations/xorg.hypersub.com/peers/peer0.xorg.hypersub.com

  echo
  echo "## Generate the peer0 msp for xorg"
  echo
  set -x
	fabric-ca-client enroll -u https://peer0:peer0@localhost:8054 --caname ca-xorg -M ${PWD}/organizations/peerOrganizations/xorg.hypersub.com/peers/peer0.xorg.hypersub.com/msp --csr.hosts peer0.xorg.hypersub.com --tls.certfiles ${PWD}/organizations/fabric-ca/xorg/tls-cert.pem
  set +x

  cp ${PWD}/organizations/peerOrganizations/xorg.hypersub.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/xorg.hypersub.com/peers/peer0.xorg.hypersub.com/msp/config.yaml

  echo
  echo "## Generate the peer0-tls certificates for xorg"
  echo
  set -x
  fabric-ca-client enroll -u https://peer0:peer0:8054 --caname ca-xorg -M ${PWD}/organizations/peerOrganizations/xorg.hypersub.com/peers/peer0.xorg.hypersub.com/tls --enrollment.profile tls --csr.hosts peer0.xorg.hypersub.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/xorg/tls-cert.pem
  set +x


  cp ${PWD}/organizations/peerOrganizations/xorg.hypersub.com/peers/peer0.xorg.hypersub.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/xorg.hypersub.com/peers/peer0.xorg.hypersub.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/xorg.hypersub.com/peers/peer0.xorg.hypersub.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/xorg.hypersub.com/peers/peer0.xorg.hypersub.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/xorg.hypersub.com/peers/peer0.xorg.hypersub.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/xorg.hypersub.com/peers/peer0.xorg.hypersub.com/tls/server.key

  mkdir -p ${PWD}/organizations/peerOrganizations/xorg.hypersub.com/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/xorg.hypersub.com/peers/peer0.xorg.hypersub.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/xorg.hypersub.com/msp/tlscacerts/ca.crt

  mkdir -p ${PWD}/organizations/peerOrganizations/xorg.hypersub.com/tlsca
  cp ${PWD}/organizations/peerOrganizations/xorg.hypersub.com/peers/peer0.xorg.hypersub.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/xorg.hypersub.com/tlsca/tlsca.xorg.hypersub.com-cert.pem

  mkdir -p ${PWD}/organizations/peerOrganizations/xorg.hypersub.com/ca
  cp ${PWD}/organizations/peerOrganizations/xorg.hypersub.com/peers/peer0.xorg.hypersub.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/xorg.hypersub.com/ca/ca.xorg.hypersub.com-cert.pem

  mkdir -p organizations/peerOrganizations/xorg.hypersub.com/users
  mkdir -p organizations/peerOrganizations/xorg.hypersub.com/users/XorgUser@xorg.hypersub.com

  echo
  echo "## Generate the user msp for XorgUser"
  echo
  set -x
	fabric-ca-client enroll -u https://XorgUser:XorgUser@localhost:8054 --caname ca-xorg -M ${PWD}/organizations/peerOrganizations/xorg.hypersub.com/users/XorgUser@xorg.hypersub.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/xorg/tls-cert.pem
  set +x

  cp ${PWD}/organizations/peerOrganizations/xorg.hypersub.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/xorg.hypersub.com/users/XorgUser@xorg.hypersub.com/msp/config.yaml

  mkdir -p organizations/peerOrganizations/xorg.hypersub.com/users/Admin@xorg.hypersub.com

  echo
  echo "## Generate the xorg admin msp"
  echo
  set -x
	fabric-ca-client enroll -u https://xorgadmin:xorgadminpw@localhost:8054 --caname ca-xorg -M ${PWD}/organizations/peerOrganizations/xorg.hypersub.com/users/Admin@xorg.hypersub.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/xorg/tls-cert.pem
  set +x

  cp ${PWD}/organizations/peerOrganizations/xorg.hypersub.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/xorg.hypersub.com/users/Admin@xorg.hypersub.com/msp/config.yaml

}