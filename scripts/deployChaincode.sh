#!/bin/bash

CHANNEL_NAME=${1:-"channel1"}
CC_NAME=${2:-"customeraccountcc"}
CC_SRC_PATH=${3:-"$HYPERSUB_BASE/hypersub/chaincode"}
CC_VERSION=${5:-"1.0"}
CC_SEQUENCE=${6:-"1"}
CC_INIT_FCN=${7:-"Init"}
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

packageChaincodeNexnet() {
  setNexnetGlobals
  set -x
  peer lifecycle chaincode package ${CC_NAME}.tar.gz --path ${CC_SRC_PATH} --lang ${CC_RUNTIME_LANGUAGE} --label ${CC_NAME}_${CC_VERSION} >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Chaincode packaging on peer0${ORG_NAME} has failed"
  printInfo "Chaincode is packaged on peer0${ORG_NAME}"
  echo
}
packageChaincodeAuditor() {
  setAuditorGlobals
  set -x
  peer lifecycle chaincode package ${CC_NAME}.tar.gz --path ${CC_SRC_PATH} --lang ${CC_RUNTIME_LANGUAGE} --label ${CC_NAME}_${CC_VERSION} >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Chaincode packaging on peer0${ORG_NAME} has failed"
  printInfo "Chaincode is packaged on peer0${ORG_NAME}"
  echo
}
packageChaincodeXorg() {
  setXorgGlobals
  set -x
  peer lifecycle chaincode package ${CC_NAME}.tar.gz --path ${CC_SRC_PATH} --lang ${CC_RUNTIME_LANGUAGE} --label ${CC_NAME}_${CC_VERSION} >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Chaincode packaging on peer0${ORG_NAME} has failed"
  printInfo "Chaincode is packaged on peer0${ORG_NAME}"
  echo
}

installChaincodeNexnet() {
  setNexnetGlobals
  set -x
  peer lifecycle chaincode install ${CC_NAME}.tar.gz >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Chaincode installation on peer0${ORG_NAME} has failed"
  printInfo "===================== Chaincode is installed on peer0${ORG_NAME} ===================== "
  echo
}

installChaincodeXorg() {
  setXorgGlobals
  set -x
  peer lifecycle chaincode install ${CC_NAME}.tar.gz >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Chaincode installation on peer0${ORG_NAME} has failed"
  printInfo "===================== Chaincode is installed on peer0${ORG_NAME} ===================== "
  echo
}

installChaincodeAuditor() {
  setAuditorGlobals
  peer lifecycle chaincode install ${CC_NAME}.tar.gz >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Chaincode installation on peer0${ORG_NAME} has failed"
  printInfo "===================== Chaincode is installed on peer0${ORG_NAME} ===================== "
  echo
}

queryInstalledNexnet() {
  setNexnetGlobals
  set -x
  peer lifecycle chaincode queryinstalled >&log.txt
  res=$?
  set +x
  cat log.txt
  PACKAGE_ID=$(sed -n "/${CC_NAME}_${CC_VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
  verifyResult $res "Query installed on peer0${ORG_NAME} has failed"
  printInfo "===================== Query installed successful on peer0${ORG_NAME} on channel ===================== "
  echo
}

queryInstalledXorg() {
  setXorgGlobals
  set -x
  peer lifecycle chaincode queryinstalled >&log.txt
  res=$?
  set +x
  cat log.txt
  PACKAGE_ID=$(sed -n "/${CC_NAME}_${CC_VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
  verifyResult $res "Query installed on peer0${ORG_NAME} has failed"
  printInfo "===================== Query installed successful on peer0${ORG_NAME} on channel ===================== "
  echo
}
queryInstalledAuditor() {
  setAuditorGlobals
  set -x
  peer lifecycle chaincode queryinstalled >&log.txt
  res=$?
  set +x
  cat log.txt
  PACKAGE_ID=$(sed -n "/${CC_NAME}_${CC_VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
  verifyResult $res "Query installed on peer0${ORG_NAME} has failed"
  printInfo "===================== Query installed successful on peer0${ORG_NAME} on channel ===================== "
  echo
}

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
  printInfo "===================== Chaincode definition approved on peer0.$ORG_NAME on channel '$CHANNEL_NAME' ===================== "
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
  verifyResult $res "Chaincode definition commit failed on peer0${ORG_NAME} on channel '$CHANNEL_NAME' failed"
  printInfo "===================== Chaincode definition approved on peer0.$ORG_NAME on channel '$CHANNEL_NAME' ===================== "
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
  printInfo "===================== Chaincode definition approved on peer0.$ORG_NAME on channel '$CHANNEL_NAME' ===================== "
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
  verifyResult $res "Chaincode definition commit failed on peer0${ORG_NAME} on channel '$CHANNEL_NAME' failed"
  printInfo "===================== Chaincode definition approved on peer0.$ORG_NAME on channel '$CHANNEL_NAME' ===================== "
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
  verifyResult $res "Chaincode definition approved on peer0${ORG_NAME} on channel '$CHANNEL_NAME' failed"
  printInfo "===================== Chaincode definition approved on peer0${ORG} on channel '$CHANNEL_NAME' ===================== "
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
  verifyResult $res "Chaincode definition approved on peer0${ORG_NAME} on channel '$CHANNEL_NAME' failed"
  printInfo "===================== Chaincode definition approved on peer0.$ORG_NAME on channel '$CHANNEL_NAME' ===================== "
  echo
}

checkCommitReadinessNexnet() {
  setNexnetGlobals
  printTask "===================== Checking the commit readiness of the chaincode definition on peer0${ORG} on channel '$CHANNEL_NAME'... ===================== "
  local rc=1
  local COUNTER=1
  # continue to poll
  # we either get a successful response, or reach MAX RETRY
  while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ]; do
    sleep $DELAY
    printSubtask "Attempting to check the commit readiness of the chaincode definition on peer0${ORG}, Retry after $DELAY seconds."
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
    printSubtask "===================== Checking the commit readiness of the chaincode definition successful on peer0${ORG} on channel '$CHANNEL_NAME' ===================== "
  else
    echo
    printError $'\e[1;31m'"!!!!!!!!!!!!!!! After $MAX_RETRY attempts, Check commit readiness result on peer0${ORG} is INVALID !!!!!!!!!!!!!!!!"$'\e[0m'
    echo
    exit 1
  fi
}

checkCommitReadinessXorg() {
  setXorgGlobals
  printTask "===================== Checking the commit readiness of the chaincode definition on peer0${ORG} on channel '$CHANNEL_NAME'... ===================== "
  local rc=1
  local COUNTER=1
  # continue to poll
  # we either get a successful response, or reach MAX RETRY
  while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ]; do
    sleep $DELAY
    printSubtask "Attempting to check the commit readiness of the chaincode definition on peer0${ORG}, Retry after $DELAY seconds."
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
    printSubtask "===================== Checking the commit readiness of the chaincode definition successful on peer0${ORG} on channel '$CHANNEL_NAME' ===================== "
  else
    echo
    printError $'\e[1;31m'"!!!!!!!!!!!!!!! After $MAX_RETRY attempts, Check commit readiness result on peer0${ORG} is INVALID !!!!!!!!!!!!!!!!"$'\e[0m'
    echo
    exit 1
  fi
}

checkCommitReadinessAuditor() {
  setAuditorGlobals
  printTask "===================== Checking the commit readiness of the chaincode definition on peer0${ORG} on channel '$CHANNEL_NAME'... ===================== "
  local rc=1
  local COUNTER=1
  # continue to poll
  # we either get a successful response, or reach MAX RETRY
  while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ]; do
    sleep $DELAY
    printSubtask "Attempting to check the commit readiness of the chaincode definition on peer0${ORG}, Retry after $DELAY seconds."
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
    printSubtask "===================== Checking the commit readiness of the chaincode definition successful on peer0${ORG} on channel '$CHANNEL_NAME' ===================== "
  else
    echo
    printError $'\e[1;31m'"!!!!!!!!!!!!!!! After $MAX_RETRY attempts, Check commit readiness result on peer0${ORG} is INVALID !!!!!!!!!!!!!!!!"$'\e[0m'
    echo
    exit 1
  fi
}

queryCommittedAuditor() {
  setAuditorGlobals
  EXPECTED_RESULT="Version: ${CC_VERSION}, Sequence: ${CC_SEQUENCE}, Endorsement Plugin: escc, Validation Plugin: vscc"
  printTask "===================== Querying chaincode definition on peer0${ORG} on channel '$CHANNEL_NAME'... ===================== "
  local rc=1
  local COUNTER=1
  # continue to poll
  # we either get a successful response, or reach MAX RETRY
  while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ]; do
    sleep $DELAY
    printSubtask "Attempting to Query committed status on peer0${ORG}, Retry after $DELAY seconds."
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
    printInfo "= Query chaincode definition successful on peer0${ORG} on channel '$CHANNEL_NAME' = "
    echo
  else
    echo
    printError $'\e[1;31m'"!!!!!!!!!!!!!!! After $MAX_RETRY attempts, Query chaincode definition result on peer0${ORG} is INVALID !!!!!!!!!!!!!!!!"$'\e[0m'
    echo
    exit 1
  fi
}
queryCommittedXorg() {
  setXorgGlobals
  EXPECTED_RESULT="Version: ${CC_VERSION}, Sequence: ${CC_SEQUENCE}, Endorsement Plugin: escc, Validation Plugin: vscc"
  printTask "===================== Querying chaincode definition on peer0${ORG} on channel '$CHANNEL_NAME'... ===================== "
  local rc=1
  local COUNTER=1
  # continue to poll
  # we either get a successful response, or reach MAX RETRY
  while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ]; do
    sleep $DELAY
    printSubtask "Attempting to Query committed status on peer0${ORG}, Retry after $DELAY seconds."
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
    printInfo "= Query chaincode definition successful on peer0${ORG} on channel '$CHANNEL_NAME' = "
    echo
  else
    echo
    printError $'\e[1;31m'"!!!!!!!!!!!!!!! After $MAX_RETRY attempts, Query chaincode definition result on peer0${ORG} is INVALID !!!!!!!!!!!!!!!!"$'\e[0m'
    echo
    exit 1
  fi
}

queryCommittedNexnet() {
  setNexnetGlobals
  EXPECTED_RESULT="Version: ${CC_VERSION}, Sequence: ${CC_SEQUENCE}, Endorsement Plugin: escc, Validation Plugin: vscc"
  printTask "===================== Querying chaincode definition on peer0${ORG} on channel '$CHANNEL_NAME'... ===================== "
  local rc=1
  local COUNTER=1
  # continue to poll
  # we either get a successful response, or reach MAX RETRY
  while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ]; do
    sleep $DELAY
    printSubtask "Attempting to Query committed status on peer0${ORG}, Retry after $DELAY seconds."
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
    printInfo "= Query chaincode definition successful on peer0${ORG} on channel '$CHANNEL_NAME' = "
    echo
  else
    echo
    printError $'\e[1;31m'"!!!!!!!!!!!!!!! After $MAX_RETRY attempts, Query chaincode definition result on peer0${ORG} is INVALID !!!!!!!!!!!!!!!!"$'\e[0m'
    echo
    exit 1
  fi
}

chaincodeInvokeInitFromNexnet() {

  setNexnetGlobals
  printSubtask "invoke $CC_NAME from organization: $ORG_NAME"
  peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.hypersub.com \
    --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA -C $CHANNEL_NAME -n ${CC_NAME} \
    --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_NEXNET_CA \
    --peerAddresses localhost:8051 --tlsRootCertFiles $PEER0_XORG_CA \
    --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_AUDITOR_CA \
    -I -c '{"Function":"initLedger","Args":[]}' >&log.txt

  res=$?
  set +x
  cat log.txt
  verifyResult $res "Invoke execution on $PEERS failed "
  printInfo "= Invoke transaction successful on $PEERS on channel '$CHANNEL_NAME' = "
  echo ""
}

testInvalidSignatureSecond() {
  setNexnetGlobals
  peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.hypersub.com \
    --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA -C $CHANNEL_NAME -n ${CC_NAME} \
    --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_NEXNET_CA \
    --peerAddresses localhost:8051 --tlsRootCertFiles $PEER0_XORG_CA \
    --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_NEXNET_CA \
    -I -c '{"Function":"createCustomerTestAccount","Args":[]}'
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
    printInfo "===================== Query successful on peer0${ORG} on channel '$CHANNEL_NAME' ===================== "
    echo
  else
    echo
    printError $'\e[1;31m'"!!!!!!!!!!!!!!! After $MAX_RETRY attempts, Query result on peer0${ORG} is INVALID !!!!!!!!!!!!!!!!"$'\e[0m'
    echo
    exit 1
  fi
}

setup
packageChaincodeNexnet
printTask "Installing chaincode on peer0.nexnet..."
installChaincodeNexnet
printTask "Install chaincode on peer0.xorg..."
installChaincodeXorg
printTask "Install chaincode on peer0.auditor..."
installChaincodeAuditor

queryInstalledNexnet
queryInstalledXorg
queryInstalledAuditor

approveForNexnet
approveForXorg
approveForAuditor

printTask "CHECKING COMMIT READINESS"
checkCommitReadinessNexnet
checkCommitReadinessXorg
checkCommitReadinessAuditor

printTask "commit the chaincode-definition"
commitChaincodeDefinitionFromNexnet
printTask "query on orgs to see that the definition has committed successfully"
queryCommittedNexnet
queryCommittedXorg
queryCommittedAuditor

## Invoke the chaincode - this does require that the chaincode have the 'initLedger'
## method defined
if [ "$CC_INIT_FCN" = "NA" ]; then
  printInfo "===================== Chaincode initialization is not required ===================== "
  echo
else
  printTask " Invoking the chaincodes for all peers on channel 1"
  chaincodeInvokeInitFromNexnet
fi
testInvalidSignature
exit 0
