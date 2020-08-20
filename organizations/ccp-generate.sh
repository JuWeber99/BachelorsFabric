#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        $HYPERSUB_BASE/organizations/ccp-template.json
}

function yaml_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        $HYPERSUB_BASE/organizations/ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}

ORG=nexnet
P0PORT=7051
CAPORT=7054
PEERPEM=$HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/tlsca/tlsca.nexnet.hypersub.com-cert.pem
CAPEM=$HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/ca/ca.nexnet.hypersub.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/connection-nexnet.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > $HYPERSUB_BASE/organizations/peerOrganizations/nexnet.hypersub.com/connection-nexnet.yaml

ORG=xorg
P0PORT=8051
CAPORT=8054
PEERPEM=$HYPERSUB_BASE/organizations/peerOrganizations/xorg.hypersub.com/tlsca/tlsca.xorg.hypersub.com-cert.pem
CAPEM=$HYPERSUB_BASE/organizations/peerOrganizations/xorg.hypersub.com/ca/ca.xorg.hypersub.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > $HYPERSUB_BASE/organizations/peerOrganizations/xorg.hypersub.com/connection-xorg.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > $HYPERSUB_BASE/organizations/peerOrganizations/xorg.hypersub.com/connection-xorg.yaml

ORG=auditor
P0PORT=9051
CAPORT=9054
PEERPEM=$HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/tlsca/tlsca.auditor.hypersub.com-cert.pem
CAPEM=$HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/ca/ca.auditor.hypersub.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/connection-auditor.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > $HYPERSUB_BASE/organizations/peerOrganizations/auditor.hypersub.com/connection-auditor.yaml

ORG=debtcollector
P0PORT=10051
CAPORT=10054
PEERPEM=$HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/tlsca/tlsca.debtcollector.hypersub.com-cert.pem
CAPEM=$HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/ca/ca.debtcollector.hypersub.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/connection-debtcollector.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > $HYPERSUB_BASE/organizations/peerOrganizations/debtcollector.hypersub.com/connection-debtcollector.yaml

