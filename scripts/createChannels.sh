#!/bin/bash

# import utils
. $HYPERSUB_BASE/scripts/envVar.sh
. $HYPERSUB_BASE/scripts/printer.sh

if [ ! -d "channel-artifacts" ]; then
  mkdir channel-artifacts
fi

createChannelTx() {

  set -x
  configtxgen -profile "Channel$1" -outputCreateChannelTx $HYPERSUB_BASE/channel-artifacts/${CHANNEL_NAME}.tx -channelID $CHANNEL_NAME
  res=$?
  set +x
  if [ $res -ne 0 ]; then
    printError "Failed to generate channel configuration transaction..."
    exit 1
  fi
  echo

}

##### Anchor Peer Transactions for channel1 #####
createAncorPeerTxOne() {

  for orgname in Nexnet Xorg Auditor; do

    printTask "Generating anchor peer update transaction for ${orgname}"
    set -x
    configtxgen -profile Channel1 -outputAnchorPeersUpdate $HYPERSUB_BASE/channel-artifacts/${orgname}anchors.tx -channelID $CHANNEL_NAME -asOrg ${orgname}
    res=$?
    set +x
    if [ $res -ne 0 ]; then
      printError "Failed to generate anchor peer update transaction for ${orgname}..."
      exit 1
    fi
    echo
  done
}

##### Anchor Peer Transactions for channel2 #####
createAncorPeerTxTwo() {

  for orgname in Nexnet Xorg DebtCollector; do

    printTask "Generating anchor peer update transaction for ${orgname}"
    set -x
    configtxgen -profile Channel2 -outputAnchorPeersUpdate $HYPERSUB_BASE/channel-artifacts/${orgname}anchors.tx -channelID $CHANNEL_NAME -asOrg ${orgname}
    res=$?
    set +x
    if [ $res -ne 0 ]; then
      printError "Failed to generate anchor peer update transaction for ${orgname}..."
      exit 1
    fi
    echo
  done
}

##### creating a channel #####
createChannel() {
  setGlobals 1
  # Poll in case the raft leader is not set yet
  local rc=1
  local COUNTER=1
  while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ]; do
    if [ $COUNTER -gt 1 ]; then
      printError "waiting for retry for: $DELAY seconds"
    fi
    sleep $DELAY
    set -x
    peer channel create -o localhost:7050 -c $CHANNEL_NAME --ordererTLSHostnameOverride orderer.hypersub.com -f $HYPERSUB_BASE/channel-artifacts/${CHANNEL_NAME}.tx --outputBlock $HYPERSUB_BASE/channel-artifacts/${CHANNEL_NAME}.block.pb --tls --cafile $ORDERER_CA >&log.txt
    res=$?
    set +x
    let rc=$res
    COUNTER=$(expr $COUNTER + 1)
  done
  cat log.txt
  verifyResult $res "Channel creation failed"
  printInfo "===================== Channel '$CHANNEL_NAME' created ===================== "
}

# joining the peers to the channel
joinChannel() {
  ORG=$1
  setGlobals $ORG
  local rc=1
  local COUNTER=1
  ## Sometimes Join takes time, hence retry
  while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ]; do
    if [ $COUNTER -gt 1 ]; then
      printError "waiting for retry for: $DELAY seconds"
    fi
    sleep $DELAY
    set -x
    peer channel join -b $HYPERSUB_BASE/channel-artifacts/$CHANNEL_NAME.block.pb >&log.txt
    res=$?
    set +x
    let rc=$res
    COUNTER=$(expr $COUNTER + 1)
  done
  cat log.txt
  echo
  verifyResult $res "After $MAX_RETRY attempts, peer0.${ORG_NAME} has failed to join channel '$CHANNEL_NAME' "
}

updateAnchorPeers() {
  ORG=$1
  setGlobals $ORG
  local rc=1
  local COUNTER=1
  ## Sometimes Join takes time, hence retry
  while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ]; do
    sleep $DELAY
    set -x
    peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.hypersub.com -c $CHANNEL_NAME -f $HYPERSUB_BASE/channel-artifacts/${ORG_NAME}anchors.tx --tls --cafile $ORDERER_CA >&log.txt
    res=$?
    set +x
    let rc=$res
    COUNTER=$(expr $COUNTER + 1)
  done
  cat log.txt
  verifyResult $res "Anchor peer update failed"
  printInfo "===================== Anchor peers updated for org '$CORE_PEER_LOCALMSPID' on channel '$CHANNEL_NAME' ===================== "
  sleep $DELAY
  echo
}

verifyResult() {
  if [ $1 -ne 0 ]; then
    printError "!!!!!!!!!!!!!!! "$2" !!!!!!!!!!!!!!!!"
    echo
    exit 1
  fi
}

FABRIC_CFG_PATH=$HYPERSUB_BASE/config

CHANNEL_NAME="channel1"
DELAY="$2"
MAX_RETRY="$3"
VERBOSE="$4"
: ${CHANNEL_NAME:="channel1"}
: ${DELAY:="3"}
: ${MAX_RETRY:="5"}
: ${VERBOSE:="false"}

## Create channeltx for channel 1
printTask "Generating channel create transaction '${CHANNEL_NAME}.tx'"
createChannelTx "1"

## Create anchorpeertx
printTask "Generating anchor peer update transactions "
createAncorPeerTxOne

## Create channel
printTask "Creating channel "$CHANNEL_NAME
createChannel

## Join all the peers to the channel
printTask "Join nexnet peers to the channel..."
joinChannel 1
printTask "Join xorg peers to the channel..."
joinChannel 2
printTask "Join auditor peers to the channel"
joinChannel 3

## Set the anchor peers for each org in the channel
printTask "Updating anchor peers for nexnet..."
updateAnchorPeers 1
printTask "Updating anchor peers for xorg..."
updateAnchorPeers 2
printTask "Updating anchor peers for auditor..."
updateAnchorPeers 3

echo
printInfo "========= Channel1 successfully joined =========== "
echo

CHANNEL_NAME="channel2"

## Create channeltx for channel 1
printTask "Generating channel create transaction '${CHANNEL_NAME}.tx' "
createChannelTx "2"

## Create anchorpeertx
printTask "Generating anchor peer update transactions "
createAncorPeerTxTwo

## Create channel
printTask "Creating channel $CHANNEL_NAME"
createChannel

## Join all the peers to the channel
printTask "Join nexnet peers to the channel..."
joinChannel 1
printTask "Join xorg peers to the channel..."
joinChannel 2
printTask "Join debtcollector peers to the channel..."
joinChannel 4

## Set the anchor peers for each org in the channel
printTask "Updating anchor peers for nexnet ..."
updateAnchorPeers 1
printTask "Updating anchor peers for xorg..."
updateAnchorPeers 2
printTask "Updating anchor peers for xorg..."
updateAnchorPeers 4

printInfo " ========= Channel2 successfully joined =========== "

exit 0
