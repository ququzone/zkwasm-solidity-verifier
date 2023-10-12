import fs from "fs";
import BN from "bn.js";
import { ethers } from "hardhat";
import { AggregatorVerifier } from "../types";

function readBnLe(file: string) {
  let buffer = fs.readFileSync(file);
  let buffer256 = [];
  for (let i = 0; i < buffer.length / 32; i++) {
    let v = new BN(0);
    let shift = new BN(1);
    for (let j = 0; j < 32; j++) {
      v = v.add(shift.muln(buffer[i * 32 + j]));
      shift = shift.muln(256);
    }
    buffer256.push(BigInt(`0x${v.toString("hex")}`));
  }

  return buffer256;
}

async function main() {
  const verifierFactory = await ethers.getContractFactory("AggregatorVerifier");

  const verifier = verifierFactory.attach(process.env.VERIFIER!) as AggregatorVerifier;

  const target_instance0 = readBnLe(
    __dirname + "/../proof/zkwasm.0.instance.data"
  );
  const verify_instance = readBnLe(
    __dirname + "/../proof/aggregate-circuit.0.instance.data"
  );
  const proof = readBnLe(
    __dirname + "/../proof/aggregate-circuit.0.transcript.data"
  );
  const aux = readBnLe(
    __dirname + "/../proof/aggregate-circuit.0.aux.data"
  );

  const gas = await verifier.verify.estimateGas(
    proof, verify_instance, aux, [target_instance0]
  );
  console.log(`verify proof gas: ${gas}`);

  const success = await verifier.verify(
    proof, verify_instance, aux, [target_instance0]
  );
  console.log(`verify result: ${success}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
