#!/bin/bash

export HYPERSUB_BASE=/home/balr/Developement/BachelorsFabric

COMPOSE_FILE_BASE=$HYPERSUB_BASE/docker/docker-compose-hypersub-net.yaml
COMPOSE_FILE_COUCH=$HYPERSUB_BASE/docker/docker-compose-db.yaml
COMPOSE_FILE_CA=$HYPERSUB_BASE/docker/docker-compose-ca.yaml

. $HYPERSUB_BASE/scripts/printer.sh

function clearContainers() {
  PEER_CONTAINER_IDS=$(docker ps -a | awk '($2 ~ /ca.*/) {print $1}')
  ORDERER_CONTAINER_IDS=$(docker ps -a | awk '($2 ~ /orderer.*/) {print $1}')
  CA_CONTAINER_IDS=$(docker ps -a | awk '($2 ~ /peer.*/) {print $1}')
#
#  if [ -z "$CA_CONTAINER_IDS" -o "$CA_CONTAINER_IDS" == " " ] ||
#    [ -z "$PEER_CONTAINER_IDS" -o "$PEER_CONTAINER_IDS" == " " ] ||
#    [ -z "$ORDERER_CONTAINER_IDS" -o "$ORDERER_CONTAINER_IDS" == " " ]; then
#    printInfo "---- No containers available for deletion ----"
#  else
    printTask "cleanup containers:"
#    printInfo "$PEER_CONTAINER_IDS"
#    docker rm -f $PEER_CONTAINER_IDS

#    printInfo "$ORDERER_CONTAINER_IDS"
#    docker rm -f $ORDERER_CONTAINER_IDS

#    printInfo "$CA_CONTAINER_IDS"
#    docker rm -f $CA_CONTAINER_IDS

    docker-compose -f $COMPOSE_FILE_BASE -f $COMPOSE_FILE_COUCH -f $COMPOSE_FILE_CA down --volumes --remove-orphans 2>/dev/null
    printInfo "pruning docker networks"
    docker network prune -f
#  fi
}

function removeUnwantedImages() {
  DOCKER_IMAGE_IDS=$(docker images | awk '($1 ~ /dev-peer.*/) {print $3}')
  if [ -z "$DOCKER_IMAGE_IDS" -o "$DOCKER_IMAGE_IDS" == " " ]; then
    printInfo "---- No images available for deletion ----"
  else
    docker rmi -f $DOCKER_IMAGE_IDS
  fi
}

function networkDown() {
  clearContainers

  #clean up files
  rm -rf $HYPERSUB_BASE/organizations/peerOrganizations
  rm -rf $HYPERSUB_BASE/organizations/ordererOrganizations
  rm -rf $HYPERSUB_BASE/organizations/fabric-ca/auditor
  rm -rf $HYPERSUB_BASE/organizations/fabric-ca/debtcollector
  rm -rf $HYPERSUB_BASE/organizations/fabric-ca/xorg
  rm -rf $HYPERSUB_BASE/organizations/fabric-ca/ordererOrg
  rm -rf $HYPERSUB_BASE/organizations/fabric-ca/nexnet
  rm -rf $HYPERSUB_BASE/channel-artifacts
  rm -rf $HYPERSUB_BASE/system-genesis-block
  rm -rf $HYPERSUB_BASE/customeraccountcc.tar.gz
  rm -rf $HYPERSUB_BASE/hypersub/sserver/src/wallet
}

networkDown
