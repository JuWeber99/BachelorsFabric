#!/bin/bash

# import utils
. $HYPERSUB_BASE/scripts/envVar.sh

if [ ! -d "channel-artifacts" ]; then
  mkdir channel-artifacts
fi

createChannelTx() {

  set -x
  configtxgen -profile "Channel$1" -outputCreateChannelTx $HYPERSUB_BASE/channel-artifacts/${CHANNEL_NAME}.tx -channelID $CHANNEL_NAME
  res=$?
  set +x
  if [ $res -ne 0 ]; then
    echo "Failed to generate channel configuration transaction..."
    exit 1
  fi
  echo

}


createChannelTwoTx() {

  set -x
  configtxgen -profile "Channel2" -outputCreateChannelTx $HYPERSUB_BASE/channel-artifacts/${CHANNEL_NAME}.tx -channelID $CHANNEL_NAME
  res=$?
  set +x
  if [ $res -ne 0 ]; then
    echo "Failed to generate channel configuration transaction..."
    exit 1
  fi
  echo

}

createAncorPeerTxOne() {

  for orgmsp in Nexnet Xorg Auditor; do

    echo "#######    Generating anchor peer update transaction for ${orgmsp}  ##########"
    set -x
    configtxgen -profile Channel1 -outputAnchorPeersUpdate ./channel-artifacts/${orgmsp}anchors.tx -channelID $CHANNEL_NAME -asOrg ${orgmsp}
    res=$?
    set +x
    if [ $res -ne 0 ]; then
      echo "Failed to generate anchor peer update transaction for ${orgmsp}..."
      exit 1
    fi
    echo
  done
}

createChannel() {
  setGlobals 1
  # Poll in case the raft leader is not set yet
  local rc=1
  local COUNTER=1
  while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ]; do
    echo "waiting for retry for: $DELAY seconds"
    sleep $DELAY
    set -x
    peer channel create -o localhost:7050 -c $CHANNEL_NAME --ordererTLSHostnameOverride orderer.hypersub.com -f ./channel-artifacts/${CHANNEL_NAME}.tx --outputBlock ./channel-artifacts/${CHANNEL_NAME}.block.pb --tls --cafile $ORDERER_CA >&log.txt
    res=$?
    set +x
    let rc=$res
    COUNTER=$(expr $COUNTER + 1)
  done
  cat log.txt
  verifyResult $res "Channel creation failed"
  echo
  echo "===================== Channel '$CHANNEL_NAME' created ===================== "
  echo
}

# queryCommitted ORG
joinChannel() {
  ORG=$1
  setGlobals $ORG
  local rc=1
  local COUNTER=1
  ## Sometimes Join takes time, hence retry
  while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ]; do
    sleep $DELAY
    set -x
    peer channel join -b ./channel-artifacts/$CHANNEL_NAME.block.pb >&log.txt
    res=$?
    set +x
    let rc=$res
    COUNTER=$(expr $COUNTER + 1)
  done
  cat log.txt
  echo
  verifyResult $res "After $MAX_RETRY attempts, peer0.${ORG} has failed to join channel '$CHANNEL_NAME' "
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
    peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.hypersub.com -c $CHANNEL_NAME -f ./channel-artifacts/${CORE_PEER_LOCALMSPID}anchors.tx --tls --cafile $ORDERER_CA >&log.txt
    res=$?
    set +x
    let rc=$res
    COUNTER=$(expr $COUNTER + 1)
  done
  cat log.txt
  verifyResult $res "Anchor peer update failed"
  echo "===================== Anchor peers updated for org '$CORE_PEER_LOCALMSPID' on channel '$CHANNEL_NAME' ===================== "
  sleep $DELAY
  echo
}

verifyResult() {
  if [ $1 -ne 0 ]; then
    echo "!!!!!!!!!!!!!!! "$2" !!!!!!!!!!!!!!!!"
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
echo "### Generating channel create transaction '${CHANNEL_NAME}.tx' ###"
createChannelTx "1"


## Create anchorpeertx
echo "### Generating anchor peer update transactions ###"
createAncorPeerTxOne


## Create channel
echo "Creating channel "$CHANNEL_NAME
createChannel

## Join all the peers to the channel
echo "Join nexnet peers to the channel..."
joinChannel 1
echo "Join xorg peers to the channel..."
joinChannel 2
echo "Join auditor peers to the channel"
joinChannel 3

## Set the anchor peers for each org in the channel
 echo "Updating anchor peers for nexnet..."
 updateAnchorPeers 1
 echo "Updating anchor peers for xorg..."
 updateAnchorPeers 2
 echo "Updating anchor peers for auditor..."
 updateAnchorPeers 3

echo
echo "========= Channel successfully joined =========== "
echo


#CHANNEL_NAME="channel2"
#
### Create channeltx for channel 1
#echo "### Generating channel create transaction '${CHANNEL_NAME}.tx' ###"
#createChannelTx "2"
#
#
### Create anchorpeertx
#echo "### Generating anchor peer update transactions ###"
#createAncorPeerTxOne
#
#
### Create channel
#echo "Creating channel "$CHANNEL_NAME
#createChannel
#
### Join all the peers to the channel
#echo "Join nexnet peers to the channel..."
#joinChannel 1
#echo "Join xorg peers to the channel..."
#joinChannel 2
#echo "Join debtcollector peers to the channel..."
#joinChannel 4
#
### Set the anchor peers for each org in the channel
## echo "Updating anchor peers for org1..."
## updateAnchorPeers 1
## echo "Updating anchor peers for org2..."
## updateAnchorPeers 2
#
#echo
#echo "========= Channel successfully joined =========== "
#echo


exit 0
