#!/bin/bash

export HYPERSUB_BASE=/home/balr/Developement/BachelorsFabric

COMPOSE_FILE_BASE=$HYPERSUB_BASE/docker/docker-compose-hypersub-net.yaml
COMPOSE_FILE_COUCH=$HYPERSUB_BASE/docker/docker-compose-db.yaml
COMPOSE_FILE_CA=$HYPERSUB_BASE/docker/docker-compose-ca.yaml

function networkDown() {
  killall npm
  killall node
  #clean up containers
  docker-compose -f $COMPOSE_FILE_BASE -f $COMPOSE_FILE_COUCH -f $COMPOSE_FILE_CA down --volumes --remove-orphans
  docker network prune -f

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
  rm -rf $HYPERSUB_BASE/mychaincode.tar.gz
  rm -rf $HYPERSUB_BASE/customeraccountcc.tar.gz
  rm -rf $HYPERSUB_BASE/hypersub/chaincode/dist
  rm -rf $HYPERSUB_BASE/hypersub/server/wallet
  rm -rf $HYPERSUB_BASE/hypersub/server/dist
  rm -rf $HYPERSUB_BASE/hypersub/server/gateway
#
#  CURRENT_DIR=${PWD}
#
#  cd $HYPERSUB_BASE/hypersub/server/src && npm stop
#  cd $HYPERSUB_BASE/hypersub/poc-app && npm stop

pkill --signal SIGINT poc-server

}

networkDown
