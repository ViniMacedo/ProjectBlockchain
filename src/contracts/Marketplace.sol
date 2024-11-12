// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract Marketplace{
    using Address for address payable;

    address public eventAddress;  // (EventTicket)
    uint256 public ticketPrice;

    constructor(address _eventAddress, uint256 _ticketPrice) {
        eventAddress = _eventAddress; 
        ticketPrice = _ticketPrice;
    }

    // Struct to storage the ticket list
    struct Listing {
        address seller;
        uint256 price;
        bool active;
    }

    // Map tokenId to list
    mapping(address => mapping(uint256 => Listing)) public listings;

    event TicketListed(address indexed nftAddress, uint256 indexed tokenId, uint256 price, address indexed seller);

    event TicketPurchased(address indexed nftAddress, uint256 indexed tokenId, uint256 price, address indexed buyer);

    event TicketDelisted(address indexed nftAddress, uint256 indexed tokenId, address indexed seller);

    function listTicket(address nftAddress, uint256 tokenId, uint256 price) external {
        require(price > 0, "The price must be grater than 0");
        require(price <= ticketPrice + (ticketPrice / 2), "Price cannot exceed 50% above the original price");
        IERC721 nft = IERC721(nftAddress);
        address seller = msg.sender;

        // verify if the msg sender is the owner
        require(nft.ownerOf(tokenId) == seller, "Only the owner can list the ticket.");

        // transfer the NFT to the marketplace contract
        nft.transferFrom(seller, address(this), tokenId);

        //Do the listing
        listings[nftAddress][tokenId] = Listing({
            seller: seller,
            price: price,
            active: true
        });

        emit TicketListed(nftAddress, tokenId, price, seller);
    }

    function purchaseTicket(address nftAddress, uint256 tokenId) external payable {
        Listing storage listing = listings[nftAddress][tokenId];
        require(listing.active, "This ticket is unavailable");
        require(msg.value == listing.price, "Wrong price");

        address seller = listing.seller;

        // Transfer the value to the seller
        payable(seller).sendValue(msg.value);

        // Transfer NFTto buyer
        IERC721(nftAddress).safeTransferFrom(address(this), msg.sender, tokenId);

        // Remove the ticker from the selllist
        delete listings[nftAddress][tokenId];

        emit TicketPurchased(nftAddress, tokenId, listing.price, msg.sender);
    }

    function delistTicket(address nftAddress, uint256 tokenId) external {
        Listing storage listing = listings[nftAddress][tokenId];
        require(listing.seller == msg.sender, "Only the vendor  can delist the ticket");

        require(listing.active, "This ticker is already unavailable.");

        IERC721(nftAddress).safeTransferFrom(address(this), msg.sender, tokenId);

        listing.active = false;

        emit TicketDelisted(nftAddress, tokenId, msg.sender);
    }

}
