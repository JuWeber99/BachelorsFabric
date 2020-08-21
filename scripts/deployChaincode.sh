#!/bin/bash


CHANNEL_NAME=${1:-""}
CC_NAME=${2:-""}
CC_SRC_PATH=${3:-"$HYPERSUB_BASE/hypersub/chaincode"}
CC_VERSION=${5:-"1.0"}
CC_SEQUENCE=${6:-"1"}
CC_INIT_FCN=${7:-"NA"}
CC_END_POLICY=${8:-"NA"}
CC_COLL_CONFIG=${9:-"NA"}
DELAY=${10:-"3"}
MAX_RETRY=${11:-"5"}
VERBOSE=${12:-"false"}

CC_RUNTIME_LANGUAGE=node


## Make sure that the path the chaincode exists if provided
if [ ! -d "$CC_SRC_PATH" ]; then
	echo Path to chaincode does not exist. Please provide different path
	exit 1
fi

