#!/bin/bash

circom ./circuits/threshold.circom --r1cs --wasm || { exit 1; }
[ $? -eq 0 ] && echo "success: created threshold.r1cs & threshold.wasm"

snarkjs zkey new threshold.r1cs powersOfTau28_hez_final_14.ptau threshold_0000.zkey || { exit 1; }
[ $? -eq 0 ] && echo "success: created threshold_0000.zkey"

snarkjs zkey contribute threshold_0000.zkey threshold_final.zkey || { exit 1; }
[ $? -eq 0 ] && echo "success: created threshold_final.zkey"

snarkjs zkey export solidityverifier threshold_final.zkey Verifier.sol || { exit 1; }
[ $? -eq 0 ] && echo "success: created Verifier.sol"

mkdir -p ../webapp/utils/zkp/ && cp ./threshold_final.zkey ../webapp/utils/zkp/threshold_final.zkey || { exit 1; }
[ $? -eq 0 ] && echo "success: copied threshold_final.zkey"

cp ./threshold_js/threshold.wasm ../webapp/utils/zkp/threshold.wasm || { exit 1; }
[ $? -eq 0 ] && echo "success: copied threshold.wasm"

mkdir -p ../hardhat-project/contracts/ && cp ./Verifier.sol ../hardhat-project/contracts/Verifier.sol || { exit 1; }
[ $? -eq 0 ] && echo "success: copied Verifier.sol"
