#!/bin/bash

######## VARIABLE and PATH DEFINITIONS ########

export HYPERSUB_BASE=/home/balr/Developement/BachelorsFabric
export PATH=$HYPERSUB_BASE/bin:$PATH
export FABRIC_CFG_PATH=$HYPERSUB_BASE/config
export VERBOSE=true

COMPOSE_FILE_BASE=$HYPERSUB_BASE/docker/docker-compose-hypersub-net.yaml
COMPOSE_FILE_COUCH=$HYPERSUB_BASE/docker/docker-compose-db.yaml
COMPOSE_FILE_CA=$HYPERSUB_BASE/docker/docker-compose-ca.yaml
COMPOSE_FILES="-f $COMPOSE_FILE_BASE -f $COMPOSE_FILE_COUCH"
COMPOSE_FILE_CUSTOMER_APP=$HYPERSUB_BASE/docker/docker-compose-poc.yaml
IMAGETAG="latest"
CA_IMAGETAG="latest"
DATABASE="couchdb"

# source print script
. $HYPERSUB_BASE/scripts/printer.sh

### Functions to startup Docker-Containers ###

function startCA_Containers() {
  IMAGE_TAG=${CA_IMAGETAG}
  docker-compose -f $COMPOSE_FILE_CA up -d 2>&1
  sleep 5
}

function startNode_Containers() {
  IMAGE_TAG=$IMAGETAG

  docker-compose ${COMPOSE_FILES} up -d 2>&1
  docker ps -a

  if [ $? -ne 0 ]; then
    printError "ERROR !!!! Unable to start network"
    exit 1
  fi
}

function startApplication_Containers() {
  printTask "Starting Docker containers for the application"
  docker-compose -f $COMPOSE_FILE_CUSTOMER_APP up -d
  docker ps -a
  res=$?
  printError $res
}

function createOrganisations() {
  if [ -d "$HYPERSUB_BASE/organizations/peerOrganizations" ]; then
    rm -Rf $HYPERSUB_BASE/organizations/peerOrganizations && rm -Rf $HYPERSUB_BASE/organizations/ordererOrganizations
  fi

  startCA_Containers

  printTask "Creating Identities for organization: Nexnet"
  . $HYPERSUB_BASE/scripts/enrollRegisterNexnet.sh
  createNexnet

  printTask "Creating Identities for organization: Xorg"
  . $HYPERSUB_BASE/scripts/enrollRegisterXorg.sh
  createXorg

  printTask "Creating Identities for organization: Auditor"
  . $HYPERSUB_BASE/scripts/enrollRegisterAuditor.sh
  createAuditor

  printTask "Creating Identities for organization: DebtCollector"
  . $HYPERSUB_BASE/scripts/enrollRegisterDebtCollector.sh
  createDebtCollector

  printTask "Creating Identities for organization: Orderer"
  . $HYPERSUB_BASE/scripts/enrollRegisterOrderer.sh
  createOrderer

  printTask "Generate CCP-Connection Files"
  bash $HYPERSUB_BASE/organizations/ccp-generate.sh

}

# Generate orderer system channel genesis block.
function createConsortium() {

  which configtxgen
  if [ "$?" -ne 0 ]; then
    printError "configtxgen tool not found. exiting"
    exit 1
  fi

  printTask "#########  Generating Orderer Genesis block ##############"

  # Note: For some unknown reason (at least for now) the block file can't be
  # named orderer.genesis.block or the orderer will fail to launch!
  set -x
  configtxgen -profile HypersubGenesis -channelID orderer-system-channel -outputBlock $HYPERSUB_BASE/channel-artifacts/genesis_block.pb
  res=$?
  set +x
  if [ $res -ne 0 ]; then
    echo $'\e[1;32m'"Failed to generate orderer genesis block..."$'\e[0m'
    exit 1
  fi
}

function networkUp() {
  createOrganisations
  createConsortium
  startNode_Containers
  startApplication_Containers
}

### Application Flow ###

echo
. $HYPERSUB_BASE/network-cleaner.sh
echo

networkUp
$HYPERSUB_BASE/scripts/createChannels.sh
$HYPERSUB_BASE/scripts/deployChaincode.sh

PREV_DIR=${PWD}

export PATH=/home/balr/Developement/caching/.npm-global/bin/:$PATH
cd $HYPERSUB_BASE/hypersub/server/src
ts-node enrollAdmin.ts
ts-node enrollRegisterUser.ts
#npm start &
#cd $HYPERSUB_BASE/hypersub/poc-app/src
#npm start

