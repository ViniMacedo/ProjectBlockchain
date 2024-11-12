async function main() {
    const [seller, buyer] = await ethers.getSigners();
    console.log("Seller:", seller.address);
    console.log("Buyer:", buyer.address);

    const eventTicketAddress = "0x66D5dD63fC9655a36B0bAe3BA619B7Cc2eCd6507"; // Replace with the real adress
    const EventTicket = await ethers.getContractFactory("EventTicket");

    const eventTicket = EventTicket.attach(eventTicketAddress);

    const marketplaceAddress = await eventTicket.marketplaceAddress();
    console.log("Marketplace Address:", marketplaceAddress);

    const tokenId = 1;

    await eventTicket.connect(seller).approveForMarketplace(tokenId);
    console.log(`Ticket ${tokenId} approved for resell in the marketplace`);

    const Marketplace = await ethers.getContractFactory("Marketplace");
    const marketplace = Marketplace.attach(marketplaceAddress);

    const resellPrice = ethers.parseEther("0.7");
    const tx = await marketplace.connect(seller).listTicket(eventTicketAddress, tokenId, resellPrice, { gasLimit: 1000000 });
    console.log("Transaction hash for listing the ticket:", tx.hash);

    await tx.wait();
    console.log(`Ticket ${tokenId} successfully listed for sale at ${ethers.formatEther(resellPrice)} ETH`);

    const purchaseTx = await marketplace.connect(buyer).purchaseTicket(eventTicketAddress, tokenId, { value: resellPrice });
    console.log("Transaction hash for purchasing the ticket:", purchaseTx.hash);

    await purchaseTx.wait();
    console.log(`Ticket ${tokenId} successfully purchased by buyer!`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
