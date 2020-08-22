#!/bin/bash


function checkPrereqs() {
  ## Check if your have cloned the peer binaries and configuration files.
  peer version >/dev/null 2>&1

  if [[ $? -ne 0 || ! -d "$HYPERSUB_BASE/config" ]]; then
    printError "ERROR! Peer binary and configuration files not found.."
    echo
    printInfo "Follow the instructions in the Fabric docs to install the Fabric Binaries:"
    printInfo "https://hyperledger-fabric.readthedocs.io/en/latest/install.html"
    exit 1
  fi
  LOCAL_VERSION=$(peer version | sed -ne 's/ Version: //p')
  DOCKER_IMAGE_VERSION=$(docker run --rm hyperledger/fabric-tools:$IMAGETAG peer version | sed -ne 's/ Version: //p' | head -1)

  printInfo "LOCAL_VERSION=$LOCAL_VERSION"
  printInfo "DOCKER_IMAGE_VERSION=$DOCKER_IMAGE_VERSION"

  if [ "$LOCAL_VERSION" != "$DOCKER_IMAGE_VERSION" ]; then
    printError "=================== WARNING ==================="
    printError "  Local fabric binaries and docker images are  "
    printError "  out of  sync. This may cause problems.       "
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
      printError "Follow the instructions in the Fabric docs to install the Fabric Binaries:"
      printInfo "https://hyperledger-fabric.readthedocs.io/en/latest/install.html"
      exit 1
    fi
    CA_LOCAL_VERSION=$(fabric-ca-client version | sed -ne 's/ Version: //p')
    CA_DOCKER_IMAGE_VERSION=$(docker run --rm hyperledger/fabric-ca:$CA_IMAGETAG fabric-ca-client version | sed -ne 's/ Version: //p' | head -1)
    printInfo "CA_LOCAL_VERSION=$CA_LOCAL_VERSION"
    printInfo "CA_DOCKER_IMAGE_VERSION=$CA_DOCKER_IMAGE_VERSION"

    if [ "$CA_LOCAL_VERSION" != "$CA_DOCKER_IMAGE_VERSION" ]; then
      printError "=================== WARNING ======================"
      printError "  Local fabric-ca binaries and docker images are  "
      printError "  out of sync. This may cause problems.           "
      printError "=================================================="
    fi
  fi
}