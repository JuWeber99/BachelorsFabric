#!/bin/bash

######## VARIABLE and PATH DEFINITIONS ########

COMPOSE_FILE_BASE=docker/docker-compose-hypersub-net.yaml
COMPOSE_FILE_COUCH=docker/docker-compose-db.yaml
COMPOSE_FILE_CA=docker/docker-compose-ca.yaml
IMAGETAG="latest"
CA_IMAGETAG="latest"

export PROJECT_BASE=/home/balr/Developement/BachelorsFabric
# prepending $PWD/../bin to PATH to ensure we are picking up the correct binaries
export PATH=$PROJECT_BASE/bin:$PATH
#TODO correct path to production env
export FABRIC_CFG_PATH=$PROJECT_BASE/config
export VERBOSE=true

function clearContainers() {
  CONTAINER_IDS=$(docker ps -a | awk '($2 ~ /dev-peer.*/) {print $1}')
  if [ -z "$CONTAINER_IDS" -o "$CONTAINER_IDS" == " " ]; then
    echo "---- No containers available for deletion ----"
  else
    docker rm -f $CONTAINER_IDS
  fi
}

function removeUnwantedImages() {
  DOCKER_IMAGE_IDS=$(docker images | awk '($1 ~ /dev-peer.*/) {print $3}')
  if [ -z "$DOCKER_IMAGE_IDS" -o "$DOCKER_IMAGE_IDS" == " " ]; then
    echo "---- No images available for deletion ----"
  else
    docker rmi -f $DOCKER_IMAGE_IDS
  fi
}

function checkPrereqs() {
  ## Check if your have cloned the peer binaries and configuration files.
  peer version >/dev/null 2>&1

  if [[ $? -ne 0 || ! -d "../config" ]]; then
    echo "ERROR! Peer binary and configuration files not found.."
    echo
    echo "Follow the instructions in the Fabric docs to install the Fabric Binaries:"
    echo "https://hyperledger-fabric.readthedocs.io/en/latest/install.html"
    exit 1
  fi
  # use the fabric tools container to see if the samples and binaries match your
  # docker images
  LOCAL_VERSION=$(peer version | sed -ne 's/ Version: //p')
  DOCKER_IMAGE_VERSION=$(docker run --rm hyperledger/fabric-tools:$IMAGETAG peer version | sed -ne 's/ Version: //p' | head -1)

  echo "LOCAL_VERSION=$LOCAL_VERSION"
  echo "DOCKER_IMAGE_VERSION=$DOCKER_IMAGE_VERSION"

  if [ "$LOCAL_VERSION" != "$DOCKER_IMAGE_VERSION" ]; then
    echo "=================== WARNING ==================="
    echo "  Local fabric binaries and docker images are  "
    echo "  out of  sync. This may cause problems.       "
    echo "==============================================="
  fi

  for UNSUPPORTED_VERSION in $NONWORKING_VERSIONS; do
    echo "$LOCAL_VERSION" | grep -q $UNSUPPORTED_VERSION
    if [ $? -eq 0 ]; then
      echo "ERROR! Local Fabric binary version of $LOCAL_VERSION does not match the versions supported by the test network."
      exit 1
    fi

    echo "$DOCKER_IMAGE_VERSION" | grep -q $UNSUPPORTED_VERSION
    if [ $? -eq 0 ]; then
      echo "ERROR! Fabric Docker image version of $DOCKER_IMAGE_VERSION does not match the versions supported by the test network."
      exit 1
    fi
  done

  ## Check for fabric-ca
  if [ "$CRYPTO" == "Certificate Authorities" ]; then

    fabric-ca-client version >/dev/null 2>&1
    if [[ $? -ne 0 ]]; then
      echo "ERROR! fabric-ca-client binary not found.."
      echo
      echo "Follow the instructions in the Fabric docs to install the Fabric Binaries:"
      echo "https://hyperledger-fabric.readthedocs.io/en/latest/install.html"
      exit 1
    fi
    CA_LOCAL_VERSION=$(fabric-ca-client version | sed -ne 's/ Version: //p')
    CA_DOCKER_IMAGE_VERSION=$(docker run --rm hyperledger/fabric-ca:$CA_IMAGETAG fabric-ca-client version | sed -ne 's/ Version: //p' | head -1)
    echo "CA_LOCAL_VERSION=$CA_LOCAL_VERSION"
    echo "CA_DOCKER_IMAGE_VERSION=$CA_DOCKER_IMAGE_VERSION"

    if [ "$CA_LOCAL_VERSION" != "$CA_DOCKER_IMAGE_VERSION" ]; then
      echo "=================== WARNING ======================"
      echo "  Local fabric-ca binaries and docker images are  "
      echo "  out of sync. This may cause problems.           "
      echo "=================================================="
    fi
  fi
}

function createOrganisations() {

  if [ -d "$PROJECT_BASE/organizations/peerOrganizations" ]; then
    rm -Rf $PROJECT_BASE/organizations/peerOrganizations && rm -Rf $PROJECT_BASE/organizations/ordererOrganizations
  fi

  IMAGE_TAG=${CA_IMAGETAG} docker-compose -f $COMPOSE_FILE_CA up -d 2>&1
  sleep 10

  . $PROJECT_BASE/scripts/printEcho.sh

  printEcho Nexnet
  . $PROJECT_BASE/organizations/fabric-ca/enrollRegisterNexnet.sh
  createNexnetIdentities

  printEcho Xorg
  . $PROJECT_BASE/organizations/fabric-ca/enrollRegisterXorg.sh
  createXorgIdentities

  printEcho Auditor
  . $PROJECT_BASE/organizations/fabric-ca/enrollRegisterAuditor.sh
  createAuditorIdentities

  printEcho Debt collector
  . $PROJECT_BASE/organizations/fabric-ca/enrollRegisterDebtCollector.sh
  createDebtCollectorIdentities

  printEcho Orderer
  . $PROJECT_BASE/organizations/fabric-ca/enrollRegisterOrderer.sh
  createOrdererOrgIdentities

}
