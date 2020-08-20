#!/bin/bash

export HYPERSUB_BASE=/home/balr/Developement/BachelorsFabric

COMPOSE_FILE_BASE=$HYPERSUB_BASE/docker/docker-compose-hypersub-net.yaml
COMPOSE_FILE_COUCH=$HYPERSUB_BASE/docker/docker-compose-db.yaml
COMPOSE_FILE_CA=$HYPERSUB_BASE/docker/docker-compose-ca.yaml

function networkDown() {
  docker-compose -f $COMPOSE_FILE_BASE -f $COMPOSE_FILE_COUCH -f $COMPOSE_FILE_CA down --volumes --remove-orphans
  rm -rf $HYPERSUB_BASE/organizations/peerOrganizations
  rm -rf $HYPERSUB_BASE/organizations/ordererOrganizations
  rm -rf $HYPERSUB_BASE/organizations/fabric-ca/auditor
  rm -rf $HYPERSUB_BASE/organizations/fabric-ca/debtcollector
  rm -rf $HYPERSUB_BASE/organizations/fabric-ca/xorg
  rm -rf $HYPERSUB_BASE/organizations/fabric-ca/ordererOrg
  rm -rf $HYPERSUB_BASE/organizations/fabric-ca/nexnet
}

networkDown
