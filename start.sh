#! /bin/bash

read -p "Enter your private key: " PK
read -p "Enter your preferred Fusion RPC gateway: " RPC_URL

export PK=$PK
export RPC_URL=$RPC_URL

echo "Private key set to \"$PK\";
echo "RPC gateway set to \"$RPC_URL\";
