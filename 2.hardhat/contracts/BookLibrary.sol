// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import { Owner } from "./Owner.sol";

contract BookLibrary is Owner {
    string[] bookTitles;
    mapping(string => Book) books;
    mapping(string => bool) bookExistance;
    mapping(address => mapping(string => bool)) customerAddressExistance;
    mapping(address => mapping(string => uint8)) customerRental;
    mapping(address => mapping(string => uint256)) customerIndex;

    struct Book {
        string title;
        uint8 copies;
        address[] addresses;
    }

    event AddBookLog(string title, uint8 availableCopies);
    event BuyBookLog(string title, uint8 leftCopies);
    event ReturnBookLog(string title, uint8 availableCopies);

    function addBook(string memory _title, uint8 _copies) public isOwner {
        require(_copies > 0, "Copies must be greater than 0");

        address[] memory addresses;

        if(!bookExistance[_title]) {
            bookExistance[_title] = true;
            bookTitles.push(_title);
        }
         
        books[_title] = Book({ title: _title, copies: books[_title].copies + _copies, addresses: addresses });

        emit AddBookLog(_title, books[_title].copies);
    }

    function getBooks() public view returns (string[] memory) {
        return bookTitles;
    }

    function getBook(string memory _title) external view returns (Book memory){
        require(bookExistance[_title], "Book don`t exist!");

        return books[_title];
    }

    function rentBook(string memory _title) public {
        require(bookExistance[_title], "Book don`t exist!");
        require(books[_title].copies > 0, "Not enough copies!");

        // decrease copies by 1
        books[_title].copies -= 1;

        if (!customerAddressExistance[msg.sender][_title]) {
            // add book renter in the address list if not exist
            books[_title].addresses.push(msg.sender);
            customerAddressExistance[msg.sender][_title] = true;
        }

        // store book renter index for current book
        customerIndex[msg.sender][_title] = books[_title].addresses.length - 1;

        // store copies of books for each customer
        customerRental[msg.sender][_title] += 1;

        emit BuyBookLog(_title, books[_title].copies);
    }

    function returnBook(string memory _title, uint8 _copies) public {
        require(_copies > 0, "Copies must be greater than 0");
        require(customerRental[msg.sender][_title] > 0, "You haven`t rent this book!");
        require(_copies <= customerRental[msg.sender][_title], "The copies which you are trying to return are more from what you`ve rented!");

        // check if customer has more copies of this book
        if (customerRental[msg.sender][_title] > 0) {
            // decrease returned copies from customer rental history
            customerRental[msg.sender][_title] -= _copies;
        }

        if (customerRental[msg.sender][_title] == 0) {
            if (books[_title].addresses.length > 1) {
                // get renter index for specific book rental
                uint256 index = customerIndex[msg.sender][_title];

                // remove / replace renter from address book
                books[_title].addresses[index] = books[_title].addresses[books[_title].addresses.length - 1];
                // remove last renter address
                books[_title].addresses.pop();
                // delete last renter index
                delete customerIndex[books[_title].addresses[books[_title].addresses.length - 1]][_title];
            } else {
                // remove renter from addresses
                books[_title].addresses.pop();
                // delete renter index
                delete customerIndex[msg.sender][_title];
            }
            
            customerAddressExistance[msg.sender][_title] = false;
        }

        // add returned book copies
        books[_title].copies += _copies;

        emit ReturnBookLog(_title, books[_title].copies);
    }
}