#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

# This is a collection of bash functions used by different scripts

export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=$HYPERSUB_BASE/organizations/ordererOrganizations/hypersub.com/orderers/orderer.hypersub.com/msp/tlscacerts/tlsca.hypersub.com-cert.pem
export PEER0_NEXNET_CA=$HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/peers/peer0.nexnet.hypersub.com/tls/ca.crt
export PEER0_XORG_CA=$HYPERSUB_BASE/organizations/peerOrganizations/xorg.hypersub.com/peers/peer0.xorg.hypersub.com/tls/ca.crt
export PEER0_AUDITOR_CA=$HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/peers/peer0.auditor.hypersub.com/tls/ca.crt
export PEER0_DEBTCOLLECTOR_CA=$HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/peers/peer0.debtcollector.hypersub.com/tls/ca.crt

. $HYPERSUB_BASE/scripts/printer.sh

# Set OrdererOrg.Admin globals
setOrdererGlobals() {
  export CORE_PEER_LOCALMSPID="ordererMSP"
  export CORE_PEER_TLS_ROOTCERT_FILE=$HYPERSUB_BASE/organizations/ordererOrganizations/hypersub.com/orderers/orderer.hypersub.com/msp/tlscacerts/tlsca.hypersub.com-cert.pem
  export CORE_PEER_MSPCONFIGPATH=$HYPERSUB_BASE/organizations/ordererOrganizations/hypersub.com/users/Admin@hypersub.com/msp
}

# Set environment variables for the peer org
setGlobals() {
  local USING_ORG=""
  if [ -z "$OVERRIDE_ORG" ]; then
    USING_ORG=$1
  else
    USING_ORG="${OVERRIDE_ORG}"
  fi

  if [ $USING_ORG -eq 1 ]; then
    export ORG_NAME="Nexnet"
    export CORE_PEER_LOCALMSPID="nexnetMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_NEXNET_CA
    export CORE_PEER_MSPCONFIGPATH=$HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/users/Admin@nexnet.hypersub.com/msp
    export CORE_PEER_ADDRESS=localhost:7051
  elif [ $USING_ORG -eq 2 ]; then
    export ORG_NAME="Xorg"
    export CORE_PEER_LOCALMSPID="xorgMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_XORG_CA
    export CORE_PEER_MSPCONFIGPATH=$HYPERSUB_BASE/organizations/peerOrganizations/xorg.hypersub.com/users/Admin@xorg.hypersub.com/msp
    export CORE_PEER_ADDRESS=localhost:8051

  elif [ $USING_ORG -eq 3 ]; then
    export ORG_NAME="Auditor"
    export CORE_PEER_LOCALMSPID="auditorMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_AUDITOR_CA
    export CORE_PEER_MSPCONFIGPATH=$HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/users/Admin@auditor.hypersub.com/msp
    export CORE_PEER_ADDRESS=localhost:9051

  elif [ $USING_ORG -eq 4 ]; then
    export ORG_NAME="DebtCollector"
    export CORE_PEER_LOCALMSPID="debtcollectorMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_DEBTCOLLECTOR_CA
    export CORE_PEER_MSPCONFIGPATH=$HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/users/Admin@debtcollector.hypersub.com/msp
    export CORE_PEER_ADDRESS=localhost:10051

  else
    printError "================== ERROR !!! ORG Unknown =================="
  fi

  printInfo "Using organization ${ORG_NAME}"
  echo

  if [ "$VERBOSE" == "true" ]; then
    env | grep CORE
  fi
}

# parsePeerConnectionParameters $@
# Helper function that sets the peer connection parameters for a chaincode
# operation
parsePeerConnectionParameters() {

  PEER_CONN_PARMS=""
  PEERS=""
  while [ "$#" -gt 0 ]; do
    setGlobals $1
    PEER="peer0.$1"
    ## Set peer adresses
    PEERS="$PEERS $PEER"
    PEER_CONN_PARMS="$PEER_CONN_PARMS --peerAddresses $CORE_PEER_ADDRESS"
    ## Set path to TLS certificate
    TLSINFO=$(eval echo "--tlsRootCertFiles \$PEER0_$1_CA")
    PEER_CONN_PARMS="$PEER_CONN_PARMS $TLSINFO"
    # shift by one to get to the next organization
    shift
  done
  # remove leading space for output
  PEERS="$(echo -e "$PEERS" | sed -e 's/^[[:space:]]*//')"
}

verifyResult() {
  if [ $1 -ne 0 ]; then
    printError "!!!!!!!!!!!!!!! $2 !!!!!!!!!!!!!!!!"
    echo
    exit 1
  fi
}
