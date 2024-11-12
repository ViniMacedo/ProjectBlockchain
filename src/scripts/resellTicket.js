async function main() {
    const [seller, buyer] = await ethers.getSigners(); // Pegando o endereço do vendedor e comprador
    console.log("Seller:", seller.address);
    console.log("Buyer:", buyer.address);

    // Endereço do contrato de EventTicket
    const eventTicketAddress = "0xA9F8FeF0B3DF9159F1443427dAa79210fCEB009C"; // Substitua com o endereço real do contrato de EventTicket
    const EventTicket = await ethers.getContractFactory("EventTicket");

    const eventTicket = EventTicket.attach(eventTicketAddress);

    // Recuperando o endereço do Marketplace do contrato EventTicket
    const marketplaceAddress = await eventTicket.marketplaceAddress();
    console.log("Marketplace Address:", marketplaceAddress);

    // Vendedor possui o ingresso com tokenId 5
    const tokenId = 5;

    // Vender o ingresso - Vendedor aprova a transferência do ingresso para o Marketplace
    await eventTicket.connect(seller).approveForMarketplace(tokenId);
    console.log(`Ticket ${tokenId} approved for resell in the marketplace`);

    // Instanciar o contrato do Marketplace
    const Marketplace = await ethers.getContractFactory("Marketplace");
    const marketplace = Marketplace.attach(marketplaceAddress);

    // Listar ingresso no Marketplace - Definir o preço da revenda
    const resellPrice = ethers.parseEther("0.7"); // Preço de revenda do ingresso
    const tx = await marketplace.listTicket(eventTicketAddress, tokenId, resellPrice);
    console.log("Transaction hash for listing the ticket:", tx.hash);

    // Aguardar a confirmação da transação
    await tx.wait();
    console.log(`Ticket ${tokenId} successfully listed for sale at ${ethers.formatEther(resellPrice)} ETH`);

    // Comprar ingresso - Comprador envia o valor correto para o Marketplace
    const purchaseTx = await marketplace.purchaseTicket(eventTicketAddress, tokenId, { value: resellPrice });
    console.log("Transaction hash for purchasing the ticket:", purchaseTx.hash);

    // Aguardar a confirmação da transação
    await purchaseTx.wait();
    console.log(`Ticket ${tokenId} successfully purchased by buyer!`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
