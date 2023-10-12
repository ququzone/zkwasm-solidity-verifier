zkwasm solidity verifier
========================

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
./bin/delphinus-cli -o ./output --function zkmain --wasm ./wasm/fibonacci.wasm \
  aggregate-prove --public 6:i64
./bin/delphinus-cli -o ./output --function zkmain --wasm ./fibonacci.wasm \
  solidity-aggregate-verifier --auxonly \
  --instances ./A7A440B07EB714094B2F91BD7DA82949/aggregate-circuit.0.instance.data \
  --proof ./A7A440B07EB714094B2F91BD7DA82949/aggregate-circuit.0.transcript.data 
```
