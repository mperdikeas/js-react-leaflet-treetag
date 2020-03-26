#!/usr/bin/env bash

if [ "$#" -ne 1 ]; then
    echo "The program expects a single argument: the value of the bearer authorizatio header"
    echo "Example: ./example-get-tree-invocation.sh eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImluc3RhbGxhdGlvbiI6ImExIiwiZXhwIjoxNTg1MjE0OTY4fQ.ND3-Un0LMzPhe_gpax9xcNa0InjxJL-hA13wnlUWlo8"
fi

accessToken=$1

echo $accessToken

# to pass a cookie instead of an authorization header use: -b name=value
curl -k https://127.0.0.1:8445/tree-cadaster-backend/jax-rs/main/getTrees -H "Authorization: Bearer ${accessToken}"

echo
echo


curl -k https://127.0.0.1:8445/tree-cadaster-backend/jax-rs/main/getTreesConfiguration -H "Authorization: Bearer ${accessToken}"
