const { ethers } = require("hardhat");

async function main() {
    const [buyer] = await ethers.getSigners(); // Endereço do comprador
    console.log("Buying ticket with the account:", buyer.address);

    // Endereço do contrato de EventTicket
    const eventTicketAddress = "0xA9F8FeF0B3DF9159F1443427dAa79210fCEB009C"; // Substitua pelo endereço real do contrato
    const EventTicket = await ethers.getContractFactory("EventTicket");
    const eventTicket = EventTicket.attach(eventTicketAddress);

    // Obter preço do ingresso
    const ticketPrice = await eventTicket.ticketPrice();
    console.log("Ticket price:", ethers.formatEther(ticketPrice), "ETH");

    // Obter o ID do ingresso que será criado
    const currentTicketCount = await eventTicket.currentTicketCount();
    console.log("Ticket ID to be minted:", currentTicketCount.toString());

    // Comprar ingresso
    const tx = await eventTicket.mintTicket(buyer.address, { value: ticketPrice });
    console.log("Transaction hash:", tx.hash);

    // Aguardar a confirmação da transação
    const receipt = await tx.wait();

    // Nova tentativa de buscar o evento diretamente pela rede
    const eventFilter = eventTicket.filters.TicketMinted(buyer.address, null);
    const events = await eventTicket.queryFilter(eventFilter, receipt.blockNumber, receipt.blockNumber);
    
    if (events.length > 0) {
        const ticketId = events[0].args.tokenId.toString();
        console.log("Ticket successfully bought! Ticket ID:", ticketId);
    } else {
        console.log("TicketMinted event not found directly from query filter.");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
