const { ethers } = require("hardhat");

async function main() {
    const [buyer] = await ethers.getSigners();
    console.log("Buying ticket with the account:", buyer.address);

    const eventTicketAddress = "0x66D5dD63fC9655a36B0bAe3BA619B7Cc2eCd6507"; // Replace with the real adress
    const EventTicket = await ethers.getContractFactory("EventTicket");
    const eventTicket = EventTicket.attach(eventTicketAddress);

    const ticketPrice = await eventTicket.ticketPrice();
    console.log("Ticket price:", ethers.formatEther(ticketPrice), "ETH");

    const currentTicketCount = await eventTicket.currentTicketCount();
    console.log("Ticket ID to be minted:", currentTicketCount.toString());

    const tx = await eventTicket.mintTicket(buyer.address, { value: ticketPrice });
    console.log("Transaction hash:", tx.hash);

    const receipt = await tx.wait();

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
