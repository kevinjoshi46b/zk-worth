#!/bin/bash

rm -r "./artifacts"

rm -r "./cache"

yarn hardhat compile || { exit 1; }
[ $? -eq 0 ] && echo "success: compiled contracts"

yarn hardhat run --network goerli scripts/deployPriceConsumer.ts || { exit 1; }
[ $? -eq 0 ] && echo "success: deployed and verified PriceConsumer contract on goerli"

yarn hardhat run --network polygonMumbai scripts/deployPriceConsumer.ts || { exit 1; }
[ $? -eq 0 ] && echo "success: deployed and verified PriceConsumer contract on polygonMumbai"

yarn hardhat run --network polygonMumbai scripts/deployVerifier.ts || { exit 1; }
[ $? -eq 0 ] && echo "success: deployed and verified Verfier contract on polygonMumbai"

yarn hardhat run --network polygonMumbai scripts/deployZKWorth.ts || { exit 1; }
[ $? -eq 0 ] && echo "success: deployed and verified ZKWorth contract on polygonMumbai"

node ./scripts/setFeedsPolygonMumbai.mjs || { exit 1; }
[ $? -eq 0 ] && echo "success: set feeds on polygonMumbai"

mkdir "../webapp/utils/contracts"

cp ./data/priceConsumerGoerli.json ../webapp/utils/contracts/priceConsumerGoerli.json || { exit 1; }
[ $? -eq 0 ] && echo "success: copied priceConsumerGoerli.json to the backend"

cp ./data/priceConsumerPolygonMumbai.json ../webapp/utils/contracts/priceConsumerPolygonMumbai.json || { exit 1; }
[ $? -eq 0 ] && echo "success: copied priceConsumerPolygonMumbai.json to the backend"

cp ./data/zKWorthPolygonMumbai.json ../webapp/utils/contracts/zKWorthPolygonMumbai.json || { exit 1; }
[ $? -eq 0 ] && echo "success: copied zKWorthPolygonMumbai.json to the backend"

mkdir "../webapp/frontend/src/contracts"

cp ./data/zKWorthPolygonMumbai.json ../webapp/frontend/src/contracts/zKWorthPolygonMumbai.json || { exit 1; }
[ $? -eq 0 ] && echo "success: copied zKWorthPolygonMumbai.json to the frontend"

cp ./data/verifierPolygonMumbai.json ../webapp/frontend/src/contracts/verifierPolygonMumbai.json || { exit 1; }
[ $? -eq 0 ] && echo "success: copied verifierPolygonMumbai.json to the frontend"
