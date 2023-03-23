// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

contract Blackjack{

    //* Keep the owner address
    address public owner;
    //* keep the minimum balance to play

    uint private minBalance = 1000000000000000000000;
    //* this is the variable that is updated when the minimum balance function runs
    bool public balanceChecker = false;

    //* This constructor get the smart contract owner address
    constructor (){
        owner = msg.sender;
    }

    //* The modifier check if the user is the smart contract owner
    modifier onlyOwner(){
        require(msg.sender == owner,"Only the owner can do that!");
        _;
    }

    //* The function to transfer smart contract ownership
    function transferOwnerShip(address newOwner) external onlyOwner{
        owner = newOwner;
    }   

    //* This function getד the player address and check if he has anough balance in the wallet and returns true or false to the react code
    function checkBalance(uint balance) external returns(bool){
        // uint balance = address(addrs).balance;
        if(balance >= minBalance){
            balanceChecker = true;
        }else{
            balanceChecker = false;
        }
        return balanceChecker;
    }

    function balance() public view returns (uint) {
        return address(this).balance;
    }

    //* Check the balance
    // function getBalance(address address) external payable returns(uint){
    //     uint balance = addrs.balance;
    //     return balance;
    // }

    

}




