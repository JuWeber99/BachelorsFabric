function createAuditor {

  echo
	echo "Enroll the CA admin for auditor"
  echo
	mkdir -p organizations/peerOrganizations/auditor.hypersub.com/

	export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/auditor.hypersub.com/
#  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
#  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:7054 --caname ca-auditor --tls.certfiles ${PWD}/organizations/fabric-ca/auditor/tls-cert.pem
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
    OrganizationalUnitIdentifier: orderer' > ${PWD}/organizations/peerOrganizations/auditor.hypersub.com/msp/config.yaml

  echo
	echo "Register peer0"
  echo
  set -x
	fabric-ca-client register --caname ca-auditor --id.name peer0 --id.secret peer0 --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/auditor/tls-cert.pem
  set +x

  echo
  echo "Register user: AuditorUser"
  echo
  set -x
  fabric-ca-client register --caname ca-auditor --id.name AuditorUser --id.secret AuditorUser --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/auditor/tls-cert.pem
  set +x

  echo
  echo "Register the organisation admin for auditor"
  echo
  set -x
  fabric-ca-client register --caname ca-auditor --id.name auditoradmin --id.secret auditoradmin --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/auditor/tls-cert.pem
  set +x

	mkdir -p organizations/peerOrganizations/auditor.hypersub.com/peers
  mkdir -p organizations/peerOrganizations/auditor.hypersub.com/peers/peer0.auditor.hypersub.com

  echo
  echo "## Generate the peer0 msp for auditor"
  echo
  set -x
	fabric-ca-client enroll -u https://peer0:peer0pw@localhost:9054 --caname ca-auditor -M ${PWD}/organizations/peerOrganizations/auditor.hypersub.com/peers/peer0.auditor.hypersub.com/msp --csr.hosts peer0.auditor.hypersub.com --tls.certfiles ${PWD}/organizations/fabric-ca/auditor/tls-cert.pem
  set +x

  cp ${PWD}/organizations/peerOrganizations/auditor.hypersub.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/auditor.hypersub.com/peers/peer0.auditor.hypersub.com/msp/config.yaml

  echo
  echo "## Generate the peer0-tls certificates for auditor"
  echo
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:9054 --caname ca-auditor -M ${PWD}/organizations/peerOrganizations/auditor.hypersub.com/peers/peer0.auditor.hypersub.com/tls --enrollment.profile tls --csr.hosts peer0.auditor.hypersub.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/auditor/tls-cert.pem
  set +x


  cp ${PWD}/organizations/peerOrganizations/auditor.hypersub.com/peers/peer0.auditor.hypersub.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/auditor.hypersub.com/peers/peer0.auditor.hypersub.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/auditor.hypersub.com/peers/peer0.auditor.hypersub.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/auditor.hypersub.com/peers/peer0.auditor.hypersub.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/auditor.hypersub.com/peers/peer0.auditor.hypersub.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/auditor.hypersub.com/peers/peer0.auditor.hypersub.com/tls/server.key

  mkdir -p ${PWD}/organizations/peerOrganizations/auditor.hypersub.com/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/auditor.hypersub.com/peers/peer0.auditor.hypersub.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/auditor.hypersub.com/msp/tlscacerts/ca.crt

  mkdir -p ${PWD}/organizations/peerOrganizations/auditor.hypersub.com/tlsca
  cp ${PWD}/organizations/peerOrganizations/auditor.hypersub.com/peers/peer0.auditor.hypersub.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/auditor.hypersub.com/tlsca/tlsca.auditor.hypersub.com-cert.pem

  mkdir -p ${PWD}/organizations/peerOrganizations/auditor.hypersub.com/ca
  cp ${PWD}/organizations/peerOrganizations/auditor.hypersub.com/peers/peer0.auditor.hypersub.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/auditor.hypersub.com/ca/ca.auditor.hypersub.com-cert.pem

  mkdir -p organizations/peerOrganizations/auditor.hypersub.com/users
  mkdir -p organizations/peerOrganizations/auditor.hypersub.com/users/AuditorUser@auditor.hypersub.com

  echo
  echo "## Generate the user msp for AuditorUser-user"
  echo
  set -x
	fabric-ca-client enroll -u https://AuditorUser:AuditorUser@localhost:9054 --caname ca-auditor -M ${PWD}/organizations/peerOrganizations/auditor.hypersub.com/users/AuditorUser@auditor.hypersub.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/auditor/tls-cert.pem
  set +x

  cp ${PWD}/organizations/peerOrganizations/auditor.hypersub.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/auditor.hypersub.com/users/AuditorUser@auditor.hypersub.com/msp/config.yaml

  mkdir -p organizations/peerOrganizations/auditor.hypersub.com/users/Admin@auditor.hypersub.com

  echo
  echo "## Generate the auditor admin msp"
  echo
  set -x
	fabric-ca-client enroll -u https://auditoradmin:auditoradminpw@localhost:9054 --caname ca-auditor -M ${PWD}/organizations/peerOrganizations/auditor.hypersub.com/users/Admin@auditor.hypersub.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/auditor/tls-cert.pem
  set +x

  cp ${PWD}/organizations/peerOrganizations/auditor.hypersub.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/auditor.hypersub.com/users/Admin@auditor.hypersub.com/msp/config.yaml

}

