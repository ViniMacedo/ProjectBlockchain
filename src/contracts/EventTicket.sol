// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Marketplace.sol";

contract EventTicket is ERC721, Ownable{
  uint256 public maxTickets;
  uint256 public currentTicketCount;
  uint256 public ticketPrice;
  address public marketplaceAddress;

  constructor(string memory eventName, string memory symbol, uint256 eventCapacity, uint256 price) ERC721(eventName, symbol) Ownable(msg.sender){
    maxTickets = eventCapacity;
    currentTicketCount = 1;
    ticketPrice = price;

    Marketplace marketplace = new Marketplace(address(this), price);
    marketplaceAddress = address(marketplace);
  }

  mapping(uint256 => bool) public validatedTickets; 

  event TicketMinted(address indexed buyer, uint256 tokenId);
  event TicketValidated(uint256 tokenId, address validator);

  function mintTicket(address to) external payable {
    require(currentTicketCount <= maxTickets, "Max ticket capacity reached");
    require(msg.value == ticketPrice, "Incorrect ticket price");
    _safeMint(to, currentTicketCount);
    emit TicketMinted(to, currentTicketCount);
    currentTicketCount++;

  }

  function withdraw() external onlyOwner {
    payable(owner()).transfer(address(this).balance);
  }

  function approveForMarketplace(uint256 tokenId) external {
    require(ownerOf(tokenId) == msg.sender, "Only the owner can approve the resell");
    approve(marketplaceAddress, tokenId);
  }

    function validateTicket(uint256 tokenId) external onlyOwner {
      require(ticketExists(tokenId), "Ticket does not exist");
      require(!validatedTickets[tokenId], "Ticket is already validated");

      validatedTickets[tokenId] = true;
      emit TicketValidated(tokenId, msg.sender);
    }

    function ticketExists(uint256 tokenId) public view returns (bool) {
      try this.ownerOf(tokenId) {
        return true;
      } catch {
        return false;
      }
    }

}
