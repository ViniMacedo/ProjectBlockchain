const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const EventTicket = await ethers.getContractFactory("EventTicket");

    const eventName = "Tusca";
    const symbol = "TSC";
    const eventCapacity = 10000;
    const ticketPrice = ethers.parseEther("0.5"); // Exemplo de preço do ingresso: 0.5 ETH

    const eventTicket = await EventTicket.deploy(eventName, symbol, eventCapacity, ticketPrice);
    console.log("EventTicket contract deployed to:", eventTicket.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
