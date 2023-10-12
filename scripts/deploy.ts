import { ethers } from "hardhat";

async function main() {
  let steps = [];
  for (let index = 1; true; index++) {
    let contract = `AggregatorVerifierCoreStep${index}`
    try {
      await ethers.getContractFactory(contract);
    } catch(e) {
      break;
    }
    console.log(`Deploy ${contract}...`);
    const step = await ethers.deployContract(contract);
    await step.waitForDeployment();
    steps.push(step.target);
  }

  console.log(`Deploy AggregatorVerifier...`);
  const aggregatorVerifier = await ethers.deployContract("AggregatorVerifier", [steps]);
  await aggregatorVerifier.waitForDeployment();

  console.log(
    `AggregatorVerifier deployed to ${aggregatorVerifier.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
