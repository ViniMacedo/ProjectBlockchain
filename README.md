# ProjectBlockchain
A blockchain project developed as part of the Blockchain and Crypto discipline, aiming to tackle issues related to ticket scalping and fake tickets by utilizing blockchain technology for secure, transparent, and decentralized ticket trading.

## Objective
The goal of this project is to create a smart contract-powered marketplace for trading event tickets securely. The project comprises two key smart contracts:
1. **EventTicket Contract**: Manages the issuance of NFTs representing event tickets. Each ticket is an NFT, providing a unique and verifiable proof of ownership.
2. **Marketplace Contract**: Creates a secure, decentralized environment where users can buy and resell event tickets, with mechanisms to prevent scalping, restrict price gouging, and provide authenticity guarantees.

This project addresses significant problems in the Brazilian event ticketing market, where "cambistas" (scalpers) frequently buy tickets in bulk and resell them at inflated prices. Moreover, the prevalence of counterfeit tickets makes it difficult for fans to purchase genuine tickets with confidence. The blockchain-based marketplace offers fans a secure resale environment, prevents price inflation, and ensures the authenticity of tickets, creating a fairer experience for all.

---

## Project Setup and Execution

### Step 1 - Setting Up Besu, a Private Blockchain
[Hyperledger Besu](https://besu.hyperledger.org/private-networks) is a robust enterprise-grade Ethereum client designed for both public and private blockchain applications. 

#### Why Use Hyperledger Besu?
- **Privacy and Control**: Besu allows for a fully private, permissioned blockchain network, enabling complete control over network participants and node settings, which is ideal for testing and enterprise applications.
- **Compatibility with Ethereum Tools**: Being an Ethereum client, Besu is compatible with the Ethereum ecosystem, including Solidity, Truffle, Hardhat, and MetaMask. This compatibility ensures a smooth development experience and allows for seamless integration with Ethereum-compatible tools and libraries.
- **Performance**: Besu offers efficient consensus algorithms and optimized network configurations, making it suitable for private blockchain applications that require high transaction throughput and low latency.

#### Besu Setup Instructions
1. Follow the [Hyperledger Besu installation guide](https://besu.hyperledger.org/en/stable/HowTo/Get-Started/Install-Binaries/) for your OS.
2. Initialize the Besu network by creating a `genesis.json` file (example provided above) to configure chain parameters.
3. Start the network by running the following commands to start the nodes.
4. Connect the Besu network to your Hardhat environment by specifying the RPC URL in your `hardhat.config.js`.

---

### Step 2 - Deploying and Testing with Hardhat
[Hardhat](https://hardhat.org/) is a development environment for Ethereum-compatible blockchains, enabling developers to compile, deploy, test, and debug their Ethereum software efficiently.

#### Why Use Hardhat?
- **Comprehensive Testing**: Hardhat provides a suite of tools for deploying and testing smart contracts, enabling fast iteration during development.
- **Ease of Integration**: It integrates seamlessly with Solidity, Ethereum libraries, and Hyperledger Besu, allowing for a streamlined development process.
- **Rich Developer Tooling**: Hardhat offers debugging capabilities, stack traces, and other features, making it easier to identify and resolve issues.
  
#### Hardhat Setup Instructions
1. Clone the repository and navigate to the `src` folder:

    ```bash
    cd src
    ```

2. Install all dependencies:

    ```bash
    npm install
    ```

3. Compile the smart contracts:

    ```bash
    npx hardhat compile
    ```

4. Deploy the **EventTicket** smart contract on the Besu network:

    ```bash
    npx hardhat run scripts/deploy.js --network besu
    ```

5. To test ticket purchases, run the buy script:

    ```bash
    npx hardhat run scripts/buyTicket.js --network besu
    ```

6. To test the resale functionality, run the resell script:

    ```bash
    npx hardhat run scripts/resellTicket.js --network besu
    ```

---

### Important Notes
- Ensure you configure multiple accounts in `hardhat.config.js` to simulate different buyers and sellers in the marketplace environment. This is necessary for testing ticket resale functionalities effectively.
