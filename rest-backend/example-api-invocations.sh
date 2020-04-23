#!/usr/bin/env bash

if [ "$#" -ne 1 ]; then
    echo "The program expects a single argument: the value of the bearer authorizatio header"
    echo "Example: ./example-get-tree-invocation.sh eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImluc3RhbGxhdGlvbiI6ImExIiwiZXhwIjoxNTg1MjE0OTY4fQ.ND3-Un0LMzPhe_gpax9xcNa0InjxJL-hA13wnlUWlo8"
    exit 1
fi

accessToken=$1


echo
echo
echo
echo 'SUMMARY INFORMATION FOR ALL TREES'
echo '---------------------------------'

curl -k https://127.0.0.1:8445/tree-cadaster-backend/jax-rs/main/getTrees -H "Authorization: Bearer ${accessToken}"

echo
echo
echo
echo 'global configuration and List of Values for all trees'
echo '-----------------------------------------------------'
curl -k https://127.0.0.1:8445/tree-cadaster-backend/jax-rs/main/getConfiguration -H "Authorization: Bearer ${accessToken}"


echo
echo
echo
echo 'DETAIL INFORMATION FOR SINGLE TREE (EXCEPT PHOTOS) - 42 is the tree id'
echo '---------------------------------------------------------------------'

curl -k https://127.0.0.1:8445/tree-cadaster-backend/jax-rs/main/feature/42/data -H "Authorization: Bearer ${accessToken}"



echo
echo
echo
echo '# of PHOTOS FOR SINGLE TREE - 42 is the tree id'
echo '-----------------------------------------------'
curl -k https://127.0.0.1:8445/tree-cadaster-backend/jax-rs/main/feature/42/photos/num -H "Authorization: Bearer ${accessToken}"

echo
echo
echo
echo 'specific PHOTO FOR SINGLE TREE - 42 is the tree id, 0 is the photo num'
echo '----------------------------------------------------------------------'
curl -k https://127.0.0.1:8445/tree-cadaster-backend/jax-rs/main/feature/42/photos/elem/0 -H "Authorization: Bearer ${accessToken}"


