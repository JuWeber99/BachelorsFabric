#!/bin/bash

CHANNEL_NAME=${1:-"channel1"}
CC_NAME=${2:-"mychaincode"}
CC_SRC_PATH=${3:-"$HYPERSUB_BASE/hypersub/chaincode"}
CC_VERSION=${5:-"1.0"}
CC_SEQUENCE=${6:-"1"}
CC_INIT_FCN=${7:-"TRUE"}
CC_END_POLICY=${8:-""}
CC_COLL_CONFIG=${9:-""}
DELAY=${10:-"3"}
MAX_RETRY=${11:-"5"}
VERBOSE=${12:-"true"}

CC_RUNTIME_LANGUAGE="node"
INIT_REQUIRED="--init-required"
INIT_REQUIRED=""
CC_SEQUENCE="1"

## Make sure that the path the chaincode exists if provided
if [ ! -d "$CC_SRC_PATH" ]; then
  echo Path to chaincode does not exist. Please provide different path
  exit 1
fi

. $HYPERSUB_BASE/scripts/envVar.sh
. $HYPERSUB_BASE/scripts/printer.sh

setup() {
  echo Compiling TypeScript code into JavaScript ...
  pushd $CC_SRC_PATH
  npm install
  npm run build
  popd
  echo Finished compiling TypeScript code into JavaScript
}

packageChaincode() {
  ORG=$1
  setGlobals $ORG
  set -x
  peer lifecycle chaincode package ${CC_NAME}.tar.gz --path ${CC_SRC_PATH} --lang ${CC_RUNTIME_LANGUAGE} --label ${CC_NAME}_${CC_VERSION} >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Chaincode packaging on peer0${ORG} has failed"
  printInfo "Chaincode is packaged on peer0${ORG}"
  echo
}

# installChaincode PEER ORG
installChaincode() {
  ORG=$1
  setGlobals $ORG
  set -x
  peer lifecycle chaincode install ${CC_NAME}.tar.gz >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Chaincode installation on peer0${ORG} has failed"
  echo "===================== Chaincode is installed on peer0${ORG} ===================== "
  echo
}

# queryInstalled PEER ORG
queryInstalled() {
  ORG=$1
  setGlobals $ORG
  set -x
  peer lifecycle chaincode queryinstalled >&log.txt
  res=$?
  set +x
  cat log.txt
  PACKAGE_ID=$(sed -n "/${CC_NAME}_${CC_VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
  verifyResult $res "Query installed on peer0${ORG} has failed"
  echo "===================== Query installed successful on peer0${ORG} on channel ===================== "
  echo
}

# approveForMyOrg VERSION PEER ORG
approveForNexnet() {
  setNexnetGlobals
  peer lifecycle chaincode approveformyorg -o localhost:7050 \
    --ordererTLSHostnameOverride orderer.hypersub.com --tls "$CORE_PEER_TLS_ENABLED" \
    --cafile "$ORDERER_CA" --channelID $CHANNEL_NAME --name "${CC_NAME}" --version ${CC_VERSION} \
    --init-required --package-id "${PACKAGE_ID}" --sequence "${CC_SEQUENCE}" >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Chaincode definition approved on peer0.$ORG_NAME on channel '$CHANNEL_NAME' failed"
  echo "===================== Chaincode definition approved on peer0.$ORG_NAME on channel '$CHANNEL_NAME' ===================== "
  echo
}

commitChaincodeDefinitionFromNexnet() {
  setNexnetGlobals
  set -x
  peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.hypersub.com \
    --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
    --channelID $CHANNEL_NAME --name ${CC_NAME} \
    --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_NEXNET_CA \
    --peerAddresses localhost:8051 --tlsRootCertFiles $PEER0_XORG_CA \
    --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_AUDITOR_CA \
    --version ${CC_VERSION} --sequence ${CC_SEQUENCE} --init-required
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Chaincode definition commit failed on peer0${ORG} on channel '$CHANNEL_NAME' failed"
  echo "===================== Chaincode definition approved on peer0.$ORG_NAME on channel '$CHANNEL_NAME' ===================== "
  echo
}



approveForXorg() {
  setXorgGlobals
  peer lifecycle chaincode approveformyorg -o localhost:7050 \
    --ordererTLSHostnameOverride orderer.hypersub.com --tls "$CORE_PEER_TLS_ENABLED" \
    --cafile "$ORDERER_CA" --channelID $CHANNEL_NAME --name "${CC_NAME}" --version ${CC_VERSION} \
    --init-required --package-id "${PACKAGE_ID}" --sequence "${CC_SEQUENCE}" >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Chaincode definition approved on peer0.$ORG_NAME on channel '$CHANNEL_NAME' failed"
  echo "===================== Chaincode definition approved on peer0.$ORG_NAME on channel '$CHANNEL_NAME' ===================== "
  echo
}

commitChaincodeDefinitionXorg() {
  setXorgGlobals
  set -x
  peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.hypersub.com \
    --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
    --channelID $CHANNEL_NAME --name ${CC_NAME} \
    --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_NEXNET_CA \
    --peerAddresses localhost:8051 --tlsRootCertFiles $PEER0_XORG_CA \
    --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_AUDITOR_CA \
    --version ${VERSION} --sequence ${CC_SEQUENCE} --init-required
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Chaincode definition commit failed on peer0${ORG} on channel '$CHANNEL_NAME' failed"
  echo "===================== Chaincode definition approved on peer0.$ORG_NAME on channel '$CHANNEL_NAME' ===================== "
  echo
}

approveForAuditor() {
  setAuditorGlobals
  peer lifecycle chaincode approveformyorg -o localhost:7050 \
    --ordererTLSHostnameOverride orderer.hypersub.com --tls "$CORE_PEER_TLS_ENABLED" \
    --cafile "$ORDERER_CA" --channelID $CHANNEL_NAME --name "${CC_NAME}" --version ${CC_VERSION} \
    --init-required --package-id "${PACKAGE_ID}" --sequence "${CC_SEQUENCE}" >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Chaincode definition approved on peer0${ORG} on channel '$CHANNEL_NAME' failed"
  echo "===================== Chaincode definition approved on peer0${ORG} on channel '$CHANNEL_NAME' ===================== "
  echo
}

commitChaincodeDefinitionAuditor() {
  setAuditorGlobals
  set -x
  peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.hypersub.com \
    --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
    --channelID $CHANNEL_NAME --name ${CC_NAME} \
    --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_NEXNET_CA \
    --peerAddresses localhost:8051 --tlsRootCertFiles $PEER0_XORG_CA \
    --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_AUDITOR_CA \
    --version ${VERSION} --sequence ${CC_SEQUENCE} --init-required

  res=$?
  set +x
  cat log.txt
  verifyResult $res "Chaincode definition approved on peer0${ORG} on channel '$CHANNEL_NAME' failed"
  echo "===================== Chaincode definition approved on peer0.$ORG_NAME on channel '$CHANNEL_NAME' ===================== "
  echo
}

checkCommitReadiness() {
  ORG=$1
  shift 1
  setGlobals $ORG
  echo "===================== Checking the commit readiness of the chaincode definition on peer0${ORG} on channel '$CHANNEL_NAME'... ===================== "
  local rc=1
  local COUNTER=1
  # continue to poll
  # we either get a successful response, or reach MAX RETRY
  while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ]; do
    sleep $DELAY
    echo "Attempting to check the commit readiness of the chaincode definition on peer0${ORG}, Retry after $DELAY seconds."
    set -x
    peer lifecycle chaincode checkcommitreadiness --channelID $CHANNEL_NAME \
      --name ${CC_NAME} --version ${CC_VERSION} --sequence ${CC_SEQUENCE} \
      --init-required --output json >&log.txt
    res=$?
    set +x
    let rc=0
    for var in "$@"; do
      grep "$var" log.txt &>/dev/null || let rc=1
    done
    COUNTER=$(expr $COUNTER + 1)
  done
  cat log.txt
  if test $rc -eq 0; then
    echo "===================== Checking the commit readiness of the chaincode definition successful on peer0${ORG} on channel '$CHANNEL_NAME' ===================== "
  else
    echo
    echo $'\e[1;31m'"!!!!!!!!!!!!!!! After $MAX_RETRY attempts, Check commit readiness result on peer0${ORG} is INVALID !!!!!!!!!!!!!!!!"$'\e[0m'
    echo
    exit 1
  fi
}

commitChaincodeDefinition() {
  parsePeerConnectionParameters $@
  res=$?
  verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer org and  parameters "

  # while 'peer chaincode' command can get the orderer endpoint from the
  # peer (if join was successful), let's supply it directly as we know
  # it using the "-o" option
  set -x
  peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride /
  orderer.hypersub.com --tls --cafile $ORDERER_CA --channelID $CHANNEL_NAME /
  --name ${CC_NAME} $PEER_CONN_PARMS --version ${CC_VERSION} --init-required --sequence /
  ${CC_SEQUENCE} >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Chaincode definition commit failed on peer0${ORG} on channel '$CHANNEL_NAME' failed"
  echo "===================== Chaincode definition committed on channel '$CHANNEL_NAME' ===================== "
  echo
}

queryCommitted() {
  ORG=$1
  setGlobals $ORG
  EXPECTED_RESULT="Version: ${CC_VERSION}, Sequence: ${CC_SEQUENCE}, Endorsement Plugin: escc, Validation Plugin: vscc"
  echo "===================== Querying chaincode definition on peer0${ORG} on channel '$CHANNEL_NAME'... ===================== "
  local rc=1
  local COUNTER=1
  # continue to poll
  # we either get a successful response, or reach MAX RETRY
  while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ]; do
    sleep $DELAY
    echo "Attempting to Query committed status on peer0${ORG}, Retry after $DELAY seconds."
    set -x
    peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME --name ${CC_NAME} >&log.txt
    res=$?
    set +x
    test $res -eq 0 && VALUE=$(cat log.txt | grep -o '^Version: '$CC_VERSION', Sequence: [0-9]*, Endorsement Plugin: escc, Validation Plugin: vscc')
    test "$VALUE" = "$EXPECTED_RESULT" && let rc=0
    COUNTER=$(expr $COUNTER + 1)
  done
  echo
  cat log.txt
  if test $rc -eq 0; then
    echo "===================== Query chaincode definition successful on peer0${ORG} on channel '$CHANNEL_NAME' ===================== "
    echo
  else
    echo
    echo $'\e[1;31m'"!!!!!!!!!!!!!!! After $MAX_RETRY attempts, Query chaincode definition result on peer0${ORG} is INVALID !!!!!!!!!!!!!!!!"$'\e[0m'
    echo
    exit 1
  fi
}

chaincodeInvokeInit() {
  parsePeerConnectionParameters $@
  res=$?
  verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters "

  # while 'peer chaincode' command can get the orderer endpoint from the
  # peer (if join was successful), let's supply it directly as we know
  # it using the "-o" option
  set -x
  fcn_call='{"function":"'${CC_INIT_FCN}'","Args":[]}'
  echo invoke fcn call:${fcn_call}
  peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.hypersub.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n ${CC_NAME} $PEER_CONN_PARMS --isInit -c ${fcn_call} >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Invoke execution on $PEERS failed "
  echo "===================== Invoke transaction successful on $PEERS on channel '$CHANNEL_NAME' ===================== "
  echo
}

chaincodeQuery() {
  ORG=$1
  setGlobals $ORG
  printInfo " Querying on peer0${ORG} on channel '$CHANNEL_NAME'...  "
  local rc=1
  local COUNTER=1
  # continue to poll
  # we either get a successful response, or reach MAX RETRY
  while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ]; do
    sleep $DELAY
    printSubtask "Attempting to Query peer0${ORG}, Retry after $DELAY seconds."
    set -x
    peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"Args":["queryAllCars"]}' >&log.txt
    res=$?
    set +x
    let rc=$res
    COUNTER=$(expr $COUNTER + 1)
  done
  echo
  cat log.txt
  if test $rc -eq 0; then
    echo "===================== Query successful on peer0${ORG} on channel '$CHANNEL_NAME' ===================== "
    echo
  else
    echo
    echo $'\e[1;31m'"!!!!!!!!!!!!!!! After $MAX_RETRY attempts, Query result on peer0${ORG} is INVALID !!!!!!!!!!!!!!!!"$'\e[0m'
    echo
    exit 1
  fi
}

setup
packageChaincode 1
printTask "Installing chaincode on peer0.nexnet..."
installChaincode 1
printTask "Install chaincode on peer0.xorg..."
installChaincode 2
printTask "Install chaincode on peer0.auditor..."
installChaincode 3

queryInstalled 1
queryInstalled 2
queryInstalled 3

approveForNexnet
approveForXorg
approveForAuditor

printTask "CHECKING COMMIT READINESS"
checkCommitReadiness 1
checkCommitReadiness 2
checkCommitReadiness 3

printTask "commit the chaincode-definition"
commitChaincodeDefinitionFromNexnet
printTask "query on orgs to see that the definition has committed successfully"
queryCommitted 1
queryCommitted 2
queryCommitted 3

## Invoke the chaincode - this does require that the chaincode have the 'initLedger'
## method defined
if [ "$CC_INIT_FCN" = "NA" ]; then
  printInfo "===================== Chaincode initialization is not required ===================== "
  echo
else
  printTask " Invoking the chaincodes for all peers on channel 1"
  chaincodeInvokeInit 1 2 3
fi

exit 0
