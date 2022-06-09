require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: 'rinkeby',
  solidity: {
    compilers: [
      {
        version: "0.7.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/d77dbae43a53480a8070c0b79183c504",
      accounts: ['a07e9ad9e9574ed7898381d7a0356da3ab5226269a1caf2e0c790d6b35f420df']
    }
  }
};
