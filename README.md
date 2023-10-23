zkwasm solidity verifier
========================

## Basic

zkWasm is a virtual machine that:

1. Run the wasm bytecode
2. Prove the runing result of the bytecode using zero knowledge proofs

## Workflow

### 1. Compile or copy wasm image into wasm directory

```
brew install llvm
brew link --force llvm
clang -O3 --target=wasm32 -nostdlib \
  -fno-builtin -Wl,--export-all -Wl,--no-entry \
  -Wl,--allow-undefined -Wl,--export-dynamic \
  -owasm/fibonacci.wasm c/fibonacci.c
```

### 2. Trusted setup

```
./bin/delphinus-cli -o ./output --function zkmain --wasm ./wasm/fibonacci.wasm setup
```

### 3. Batch proof

```
./bin/delphinus-cli -o ./output --function zkmain --wasm ./wasm/fibonacci.wasm \
  aggregate-prove --public 5:i64
```

### 4. Generate solidity verifier

```
./bin/delphinus-cli -o ./output --function zkmain --wasm ./wasm/fibonacci.wasm \
  solidity-aggregate-verifier \
  --instances ./output/aggregate-circuit.0.instance.data \
  --proof ./output/aggregate-circuit.0.transcript.data \
  --sol_dir ./
```

### 5. Deploy contracts

```
# dev network
anvil
yarn hardhat run scripts/deploy.ts --network dev
export VERIFIER=<deployed contract address>
```

### 6. Verify proof

```
yarn hardhat run scripts/verify.ts --network dev
```

### 7. Repeat prove and verify

```
rm -f ./output/zkwasm.0.*
rm -f ./output/aggregate-circuit.0.*
./bin/delphinus-cli -o ./output --function zkmain --wasm ./wasm/fibonacci.wasm \
  aggregate-prove --public 6:i64
./bin/delphinus-cli -o ./output --function zkmain --wasm ./wasm/fibonacci.wasm \
  solidity-aggregate-verifier --auxonly \
  --instances ./output/aggregate-circuit.0.instance.data \
  --proof ./output/aggregate-circuit.0.transcript.data
yarn hardhat run scripts/verify.ts --network dev
```
