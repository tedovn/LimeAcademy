const hre = require("hardhat");
const ethers = hre.ethers;
const USElection = require("../artifacts/contracts/USElection.sol/USElection.json");

// const [owner, alice, bob] = await ethers.getSigners();
const CONTRACT_ADDRESS = "0x37AdDeE058634D6741f428e2337c92f6B8A52b4C";
const WALLET_PRIVATE_KEY = "a07e9ad9e9574ed7898381d7a0356da3ab5226269a1caf2e0c790d6b35f420df";

async function main() {
  await hre.run('compile'); // We are compiling the contracts using subtask
  const [deployer] = await ethers.getSigners(); // We are getting the deployer

  console.log('Deploying contracts with the account:', deployer.address); // We are printing the address of the deployer
  console.log('Account balance:', (await deployer.getBalance()).toString()); // We are printing the account balance

  const USElection = await ethers.getContractFactory("USElection"); // 
  const usElectionContract = await USElection.deploy();
  console.log('Waiting for USElection deployment...');
  await usElectionContract.deployed();

  console.log('USElection Contract address: ', usElectionContract.address);
  console.log('Done!');
}

const run = async () => {
  try {
    // connect to the node provider
    const provider = new hre.ethers.providers.InfuraProvider("rinkeby", "d77dbae43a53480a8070c0b79183c504");

    const wallet = new hre.ethers.Wallet(WALLET_PRIVATE_KEY, provider)
    const balance = await wallet.getBalance();
    console.log("Wallet Balance:: ", hre.ethers.utils.formatEther(balance, 18));

    const electionContract = new hre.ethers.Contract(CONTRACT_ADDRESS, USElection.abi, wallet);

    const hasEnded = await electionContract.electionEnded();
    console.log("The election has ended:", hasEnded);
    
    const haveResultsForOhio = await electionContract.resultsSubmitted("Ohio")
    console.log("Have results for Ohio:", haveResultsForOhio)
    
    // const transactionOhio = await electionContract.submitStateResult(["Ohio", 250, 150, 24]);
    // console.log("State Result Submission Transaction:", transactionOhio.hash);

    // const transactionReceipt = await transactionOhio.wait();
    // if (transactionReceipt.status != 1) {
    //   console.log("Transaction was not successful")
    //   return
    // }

    // const resultsSubmittedOhioNew = await electionContract.resultsSubmitted("Ohio")
    // console.log("Results submitted for Ohio", resultsSubmittedOhioNew);

    // const currentLeader = await electionContract.currentLeader();
    // console.log("Current leader", currentLeader);


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


