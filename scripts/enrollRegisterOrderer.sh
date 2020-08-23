function createOrderer {

  echo
	printSubtask "Enroll the CA admin"
  echo
	mkdir -p $HYPERSUB_BASE/organizations/ordererOrganizations/hypersub.com

	export FABRIC_CA_CLIENT_HOME=$HYPERSUB_BASE/organizations/ordererOrganizations/hypersub.com
#  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
#  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:11054 --caname ca-orderer --tls.certfiles $HYPERSUB_BASE/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-11054-ca-orderer.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-11054-ca-orderer.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-11054-ca-orderer.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-11054-ca-orderer.pem
    OrganizationalUnitIdentifier: orderer' > $HYPERSUB_BASE/organizations/ordererOrganizations/hypersub.com/msp/config.yaml


  echo
	printSubtask "Register orderer"
  echo
  set -x
	fabric-ca-client register --caname ca-orderer --id.name orderer --id.secret ordererpw --id.type orderer --tls.certfiles $HYPERSUB_BASE/organizations/fabric-ca/ordererOrg/tls-cert.pem
    set +x

  echo
  printSubtask "Register the orderer admin"
  echo
  set -x
  fabric-ca-client register --caname ca-orderer --id.name ordereradmin --id.secret ordereradminpw --id.type admin --tls.certfiles $HYPERSUB_BASE/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

	mkdir -p $HYPERSUB_BASE/organizations/ordererOrganizations/hypersub.com/orderers
  mkdir -p $HYPERSUB_BASE/organizations/ordererOrganizations/hypersub.com/orderers/hypersub.com

  mkdir -p $HYPERSUB_BASE/organizations/ordererOrganizations/hypersub.com/orderers/orderer.hypersub.com

  echo
  printSubtask "Generate the orderer msp"
  echo
  set -x
	fabric-ca-client enroll -u https://orderer:ordererpw@localhost:11054 --caname ca-orderer -M $HYPERSUB_BASE/organizations/ordererOrganizations/hypersub.com/orderers/orderer.hypersub.com/msp --csr.hosts orderer.hypersub.com --csr.hosts localhost --tls.certfiles $HYPERSUB_BASE/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

  cp $HYPERSUB_BASE/organizations/ordererOrganizations/hypersub.com/msp/config.yaml $HYPERSUB_BASE/organizations/ordererOrganizations/hypersub.com/orderers/orderer.hypersub.com/msp/config.yaml

  echo
  printSubtask "Generate the orderer-tls certificates"
  echo
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:11054 --caname ca-orderer -M $HYPERSUB_BASE/organizations/ordererOrganizations/hypersub.com/orderers/orderer.hypersub.com/tls --enrollment.profile tls --csr.hosts orderer.hypersub.com --csr.hosts localhost --tls.certfiles $HYPERSUB_BASE/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

  cp $HYPERSUB_BASE/organizations/ordererOrganizations/hypersub.com/orderers/orderer.hypersub.com/tls/tlscacerts/* $HYPERSUB_BASE/organizations/ordererOrganizations/hypersub.com/orderers/orderer.hypersub.com/tls/ca.crt
  cp $HYPERSUB_BASE/organizations/ordererOrganizations/hypersub.com/orderers/orderer.hypersub.com/tls/signcerts/* $HYPERSUB_BASE/organizations/ordererOrganizations/hypersub.com/orderers/orderer.hypersub.com/tls/server.crt
  cp $HYPERSUB_BASE/organizations/ordererOrganizations/hypersub.com/orderers/orderer.hypersub.com/tls/keystore/* $HYPERSUB_BASE/organizations/ordererOrganizations/hypersub.com/orderers/orderer.hypersub.com/tls/server.key

  mkdir -p $HYPERSUB_BASE/organizations/ordererOrganizations/hypersub.com/orderers/orderer.hypersub.com/msp/tlscacerts
  cp $HYPERSUB_BASE/organizations/ordererOrganizations/hypersub.com/orderers/orderer.hypersub.com/tls/tlscacerts/* $HYPERSUB_BASE/organizations/ordererOrganizations/hypersub.com/orderers/orderer.hypersub.com/msp/tlscacerts/tlsca.hypersub.com-cert.pem

  mkdir -p $HYPERSUB_BASE/organizations/ordererOrganizations/hypersub.com/msp/tlscacerts
  cp $HYPERSUB_BASE/organizations/ordererOrganizations/hypersub.com/orderers/orderer.hypersub.com/tls/tlscacerts/* $HYPERSUB_BASE/organizations/ordererOrganizations/hypersub.com/msp/tlscacerts/tlsca.hypersub.com-cert.pem

  mkdir -p $HYPERSUB_BASE/organizations/ordererOrganizations/hypersub.com/users
  mkdir -p $HYPERSUB_BASE/organizations/ordererOrganizations/hypersub.com/users/Admin@hypersub.com

  echo
  printSubtask "Generate the admin msp"
  echo
  set -x
	fabric-ca-client enroll -u https://ordereradmin:ordereradminpw@localhost:11054 --caname ca-orderer -M $HYPERSUB_BASE/organizations/ordererOrganizations/hypersub.com/users/Admin@hypersub.com/msp --tls.certfiles $HYPERSUB_BASE/organizations/fabric-ca/ordererOrg/tls-cert.pem
  set +x

  cp $HYPERSUB_BASE/organizations/ordererOrganizations/hypersub.com/msp/config.yaml $HYPERSUB_BASE/organizations/ordererOrganizations/hypersub.com/users/Admin@hypersub.com/msp/config.yaml


}

