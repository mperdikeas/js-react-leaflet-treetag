#!/usr/bin/env bash

if [ "$#" -ne 3 ]; then
    echo "The program expects three (3) arguments: installation, username, password"
    echo "Example: ./example-get-tree-invocation-login.sh a1 admin pass"
    exit 1
fi

installation=$1
username=$2
password=$3


echo
echo
echo
echo "logging-in as user ${username} (password: ${password}) at installation ${installation}"
echo '---------------------------------'

curl -g -v -k -d "{\"installation\":\"${installation}\", \"username\":\"${username}\", \"password\": \"${password}\"}" https://127.0.0.1:8445/tree-cadaster-backend/jax-rs/main/login




