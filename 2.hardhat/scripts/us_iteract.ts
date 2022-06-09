
import hre from "hardhat";
import USElection from "../artifacts/contracts/USElection.sol/USElection.json";

// const CONTRACT_NAME = "USElection";
const PROVIDER_BASE_URL = "http://localhost:8545";
const CONTRACT_ADDRESS = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
const WALLET_PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";


async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  await hre.run('compile');

  // We get the contract to deploy
  const USElection = await hre.ethers.getContractFactory("USElection");
  const usElection = await USElection.deploy();

  await usElection.deployed();

  console.log("USElection deployed to:", usElection.address);
}

const run = async() => {
  try {
    // connect to the node provider
    const provider = new hre.ethers.providers.JsonRpcProvider(PROVIDER_BASE_URL);

    // connect to specific Wallet from node
    // first way to connect
    const wallet = new hre.ethers.Wallet(WALLET_PRIVATE_KEY, provider);
    const electionContract = new hre.ethers.Contract(CONTRACT_ADDRESS, USElection.abi, wallet);

    // second way to connect when we set hardhat configuration
    // const BookLibraryFactory = await hre.ethers.getContractFactory(CONTRACT_NAME);
    // const electionContract = await BookLibraryFactory.attach(CONTRACT_ADDRESS);

    const stateResults = ["California",1000,900,32];
    const submitStateResultsTx = await electionContract.submitStateResult(stateResults);
    await submitStateResultsTx.wait();

    const currentLeaderTx = await electionContract.currentLeader();
    
    console.log("currentLeaderTx:: ",currentLeaderTx);
    
    
  } catch (e) {
    console.error(e);
  }
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });

run();

  
