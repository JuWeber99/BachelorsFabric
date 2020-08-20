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
IMAGETAG="latest"
CA_IMAGETAG="latest"
DATABASE="couchdb"

# source print script
. $HYPERSUB_BASE/scripts/printer.sh

function clearContainers() {
  CONTAINER_IDS=$(docker ps -a | awk '($2 ~ /dev-peer.*/) {print $1}')
  if [ -z "$CONTAINER_IDS" -o "$CONTAINER_IDS" == " " ]; then
    printInfo "---- No containers available for deletion ----"
  else
    docker rm -f $CONTAINER_IDS
  fi
}

function removeUnwantedImages() {
  DOCKER_IMAGE_IDS=$(docker images | awk '($1 ~ /dev-peer.*/) {print $3}')
  if [ -z "$DOCKER_IMAGE_IDS" -o "$DOCKER_IMAGE_IDS" == " " ]; then
    printInfo "---- No images available for deletion ----"
  else
    docker rmi -f $DOCKER_IMAGE_IDS
  fi
}

function checkPrereqs() {
  ## Check if your have cloned the peer binaries and configuration files.
  peer version >/dev/null 2>&1

  if [[ $? -ne 0 || ! -d "$HYPERSUB_BASE/config" ]]; then
    printError "ERROR! Peer binary and configuration files not found.."
    echo
    echo "Follow the instructions in the Fabric docs to install the Fabric Binaries:"
    echo "https://hyperledger-fabric.readthedocs.io/en/latest/install.html"
    exit 1
  fi
  LOCAL_VERSION=$(peer version | sed -ne 's/ Version: //p')
  DOCKER_IMAGE_VERSION=$(docker run --rm hyperledger/fabric-tools:$IMAGETAG peer version | sed -ne 's/ Version: //p' | head -1)

  printInfo "LOCAL_VERSION=$LOCAL_VERSION"
  printInfo "DOCKER_IMAGE_VERSION=$DOCKER_IMAGE_VERSION"

  if [ "$LOCAL_VERSION" != "$DOCKER_IMAGE_VERSION" ]; then
    printError "=================== WARNING ==================="
    echo "  Local fabric binaries and docker images are  "
    echo "  out of  sync. This may cause problems.       "
    printError "==============================================="
  fi

  for UNSUPPORTED_VERSION in $NONWORKING_VERSIONS; do
    printInfo "$LOCAL_VERSION" | grep -q $UNSUPPORTED_VERSION
    if [ $? -eq 0 ]; then
      printError "ERROR! Local Fabric binary version of $LOCAL_VERSION does not match the versions supported by the test network."
      exit 1
    fi

    printInfo "$DOCKER_IMAGE_VERSION" | grep -q $UNSUPPORTED_VERSION
    if [ $? -eq 0 ]; then
      printError "ERROR! Fabric Docker image version of $DOCKER_IMAGE_VERSION does not match the versions supported by the test network."
      exit 1
    fi
  done

  ## Check for fabric-ca
  if [ "$CRYPTO" == "Certificate Authorities" ]; then

    fabric-ca-client version >/dev/null 2>&1
    if [[ $? -ne 0 ]]; then
      printError "ERROR! fabric-ca-client binary not found.."
      echo
      echo "Follow the instructions in the Fabric docs to install the Fabric Binaries:"
      echo "https://hyperledger-fabric.readthedocs.io/en/latest/install.html"
      exit 1
    fi
    CA_LOCAL_VERSION=$(fabric-ca-client version | sed -ne 's/ Version: //p')
    CA_DOCKER_IMAGE_VERSION=$(docker run --rm hyperledger/fabric-ca:$CA_IMAGETAG fabric-ca-client version | sed -ne 's/ Version: //p' | head -1)
    printInfo "CA_LOCAL_VERSION=$CA_LOCAL_VERSION"
    printInfo "CA_DOCKER_IMAGE_VERSION=$CA_DOCKER_IMAGE_VERSION"

    if [ "$CA_LOCAL_VERSION" != "$CA_DOCKER_IMAGE_VERSION" ]; then
      printError "=================== WARNING ======================"
      echo "  Local fabric-ca binaries and docker images are  "
      echo "  out of sync. This may cause problems.           "
      printError "=================================================="
    fi
  fi
}

function createOrganisations() {

  if [ -d "$HYPERSUB_BASE/organizations/peerOrganizations" ]; then
    rm -Rf $HYPERSUB_BASE/organizations/peerOrganizations && rm -Rf $HYPERSUB_BASE/organizations/ordererOrganizations
  fi

  IMAGE_TAG=${CA_IMAGETAG}
  docker-compose -f $COMPOSE_FILE_CA up -d 2>&1
  sleep 10

  printTask "Creating Identities for organization: Nexnet"
  . $HYPERSUB_BASE/organizations/fabric-ca/enrollRegisterNexnet.sh
  createNexnet

  printTask "Creating Identities for organization: Xorg"
  . $HYPERSUB_BASE/organizations/fabric-ca/enrollRegisterXorg.sh
  createXorg

  printTask "Creating Identities for organization: Auditor"
  . $HYPERSUB_BASE/organizations/fabric-ca/enrollRegisterAuditor.sh
  createAuditor

  printTask "Creating Identities for organization: DebtCollector"
  . $HYPERSUB_BASE/organizations/fabric-ca/enrollRegisterDebtCollector.sh
  createDebtCollector

  printTask "Creating Identities for organization: Orderer"
  . $HYPERSUB_BASE/organizations/fabric-ca/enrollRegisterOrderer.sh
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
  configtxgen -profile HypersubGenesis -channelID orderer-system-channel -outputBlock $HYPERSUB_BASE/system-genesis-block/genesis.block.pb
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

  IMAGE_TAG=$IMAGETAG docker-compose ${COMPOSE_FILES} up -d 2>&1

  docker ps -a
  if [ $? -ne 0 ]; then
    printError "ERROR !!!! Unable to start network"
    exit 1
  fi
}

echo
checkPrereqs
networkUp
sleep 5
$HYPERSUB_BASE/scripts/createChannels.sh
