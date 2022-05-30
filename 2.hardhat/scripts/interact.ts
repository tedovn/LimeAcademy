import hre from "hardhat";
import BookLibrary from "../artifacts/contracts/BookLibrary.sol/BookLibrary.json";

const CONTRACT_NAME = "BookLibrary";
const PROVIDER_BASE_URL = "http://localhost:8545";
const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const WALLET_PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const run = async() => {
  try {
    // connect to the node provider
    const provider = new hre.ethers.providers.JsonRpcProvider(PROVIDER_BASE_URL);

    // connect to specific Wallet from node
    // first way to connect
    const wallet = new hre.ethers.Wallet(WALLET_PRIVATE_KEY, provider);
    const electionContract = new hre.ethers.Contract(CONTRACT_ADDRESS, BookLibrary.abi, wallet);

    // second way to connect when we set hardhat configuration
    // const BookLibraryFactory = await hre.ethers.getContractFactory(CONTRACT_NAME);
    // const electionContract = await BookLibraryFactory.attach(CONTRACT_ADDRESS);

    const transactionBook = await electionContract.addBook('test2', 30);
    const transactionReceipt = await transactionBook.wait();
    
    console.log(transactionReceipt);

    if (transactionReceipt.status != 1) { // 1 means success
      console.log("Transaction was not successful")
      return 
    };

    const booksList = await electionContract.getBooks();
    const book = await electionContract.getBook('test2');
    console.log(booksList);
    console.log(book);
    
  } catch (e) {
    console.error(e);
  }
}

run()
