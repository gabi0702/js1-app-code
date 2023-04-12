// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;


contract Blackjack{
   address payable public playerAddress;
    //* Keep the owner address
    address public owner;
    //* keep the minimum balance to play
    uint private minBalance = 10000000000000000000;

    //* this is the minimum sum to play
    uint private minimum = 10000000000000000;
    //* this is the maximum sum to play
    uint private maximum = 1000000000000000000;
    //* this is the suits (each of the value represent a suit)
    string[] suits = ["H", "S", "D", "C"];
    //* this is the card values
    // prettier-ignore
    string[] ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "0", "J", "Q", "K"];

    uint[] playerCardValues;
    string[] playerCardsUrls;
    uint[] dealercardValues;
    string[] dealerCardsUrls;

    bool isBlackForPlayer = false;
    bool isBlackForDealer = false;

    bool finishGame = false;
    //* this is the variable that is updated when the minimum balance function runs
    bool public balanceChecker;
  
    //* this is the variable that check the number in the input is more than the minimum to play and less than the maximum to play
    bool public inputChecked = true;

    uint playerCounter = 0;
    uint dealerCounter = 0;

    bool loosedPlayer = false;
    bool loosedDealer = false;

    bool canTakeNewCardPlayer = true;
    bool canTakeNewCardDealer = false;

    bool gameFinished = false;

    uint payment = 1;
    uint paymentSum = 0 ; 
    uint public balance;

    //* This constructor get the smart contract owner address
    constructor (){
        owner = msg.sender;
        balance = 0;
        // We want to call this function when the player want to play a new game
        //   deckcard = createDeck();
    }

    function startGame() external {
        givetwoCardsToPlayer();
        givetwoCardsToDealer();
        if(isBlackForDealer && isBlackForPlayer){
            // NEED TO WORK ON THE END OF THE GAME
            finishGame = true;
            loosedPlayer = false;
            loosedDealer = false;
        }    
        if(isBlackForDealer && isBlackForPlayer == false ){ 
            finishGame = true;
            loosedDealer = false;
            loosedPlayer = true;
        }
        if(isBlackForPlayer && isBlackForDealer == false){ 
            finishGame = true;
            loosedDealer = true;
            loosedPlayer = false;        
        }     
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

    // We need to check why it's not rendering the balance value
    uint public playerBalance = 0;
    event initBalance(uint playerBalance);
    //* This function gets the player address and returns the player balance
    function getBalance(address payable addrs) public  returns(uint){
        playerAddress = addrs;
        playerBalance = playerAddress.balance;
        emit initBalance(playerBalance);        
        return playerAddress.balance;

    }   

    event initchecker(bool balanceChecker);
    //* This function get the player address and check if he has anough balance in the wallet and returns true or false to the react code
    function checkBalance(uint bal) public returns(bool){
        if(bal >= minBalance){
            balanceChecker = true;
        }
        else{
            balanceChecker = false;
        }
        emit initchecker(balanceChecker);
        return balanceChecker;
    }

    event inpuchecker(bool inputChecked);
    //* The function gets from the frontend sum entered to play and verify if it's more than the minimum and less than the maximum
    function checkInput(uint bal, uint input) public returns (bool){
        playerBalance = bal;
        if((input < minimum || input > maximum)){
            inputChecked = false;
        } 
        if(input >= minimum && input <= maximum && input < bal)
        {
            inputChecked = true;
            paymentSum = input;
        }
        emit inpuchecker(inputChecked);
        return inputChecked;
    }

    //* Checks if 2 strings are equals (helper function)
    function compareStrings(string memory a, string memory b) public pure returns (bool) {
    return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    //* gets a string and return a interger (helper function)
    function stringToUint(string memory s) public pure returns (uint) {
        bytes memory b = bytes(s);
        uint result = 0;
        for (uint256 i = 0; i < b.length; i++) {
            uint256 c = uint256(uint8(b[i]));
            if (c >= 48 && c <= 57) {
                result = result * 10 + (c - 48);
            }
        }
        return result;
    }

    // The function creates URL for the ui
    function createUrlForUI(string memory card) public pure returns (string memory) {
        string memory cardLink = "https://deckofcardsapi.com/static/img/";
        string memory cardType = ".png";
        string memory cardLinkNew = string.concat(cardLink,card,cardType);
        return cardLinkNew;
    }

    // This function returns the cards of the player
    event returnPlayerCardvale(uint[]);
    function showPlayerCardvalue() public returns(uint[] memory){
        emit returnPlayerCardvale(playerCardValues);
        // return playerCardValues;
    }
    function showPlayerCardUrls() public view returns(string[] memory){
        return playerCardsUrls;
    }
    // This function returns the cards of the dealer
    
    event returnDealerCardvale(uint[]);
    function showDealerCardvalue() public returns(uint[] memory){
        emit returnDealerCardvale( dealercardValues);
        // return dealercardValues;
    }
    function showDealerCardUrls() public view returns(string[] memory){
        return dealerCardsUrls;
    }
    // It starts the game and give to the player 2 cards
    function givetwoCardsToPlayer() public {
        generateTwoRandomNumbersToPlayer();
    }
    // It starts the game and give to the dealer 2 cards
    function givetwoCardsToDealer() public {
        generateTwoRandomNumbersToDealer();
    }
    event returnDealerCounter(uint);
    function showDealerCounter() public returns(uint ){
        emit returnDealerCounter(dealerCounter);
        // return dealerCounter;
    }
    event returnPlayerCounter(uint);
    function showPlayerCounter() public returns(uint ){
        emit returnPlayerCounter(playerCounter);
        // return playerCounter;
    }

    //* The function sums the cards values for dealer and player
    function sumOfCardsPlayer() public{
        uint lenOfPlayerCards = playerCardValues.length;
        // uint lenOfDealerCards = dealercardValues.length;

        playerCounter = 0;
        // uint playerCounter = 0;
        for(uint i = 0; i < lenOfPlayerCards; i++){
            playerCounter += playerCardValues[i];
        }
        
        // dealerCounter = 0;
        // uint dealerCounter = 0;
        // for(uint i = 0; i < lenOfDealerCards; i++){
        //     dealerCounter += dealercardValues[i];
        // }
    } 
    function sumOfCardsDealer() public{
        // uint lenOfPlayerCards = playerCardValues.length;
        uint lenOfDealerCards = dealercardValues.length;

        // playerCounter = 0;
        // uint playerCounter = 0;
        // for(uint i = 0; i < lenOfPlayerCards; i++){
        //     playerCounter += playerCardValues[i];
        // }
        
        dealerCounter = 0;
        // uint dealerCounter = 0;
        for(uint j = 0; j < lenOfDealerCards; j++){
            dealerCounter += dealercardValues[j];
        }
    }

    // The function convert value that are more than 10 to be 10
    function checkValue(uint num) public pure returns(uint){
        if(num >= 10)return 10;
        return num;
        
    }

    event returnPlayerUrls(string[]);
    // The function generate 2 random cards to the player
    function generateTwoRandomNumbersToPlayer() public returns( string[] memory) {
        uint randomNumber1 = uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % 13;
        uint randomNumber2 = uint(keccak256(abi.encodePacked(block.gaslimit, block.number))) % 13;
        
        uint randomSuit1 = uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % 4;
        uint randomSuit2 = uint(keccak256(abi.encodePacked(block.gaslimit, block.number))) % 4;

        string memory rankNumber1 = ranks[randomNumber1];
        string memory rankNumber2 = ranks[randomNumber2];
        playerCardValues.push(checkValue(randomNumber1+1));
        playerCardValues.push(checkValue(randomNumber2+1));
        if((playerCardValues[0] == 1 && playerCardValues[1]==10) ||
            (playerCardValues[1] == 1 && playerCardValues[0]==10)){
                isBlackForPlayer = true;
                loosedPlayer = false;
                loosedDealer = true;
                gameFinished = true;
                payment = 3/uint256(2);
                finishTheGame();
        }
        string memory suitNumber1 = suits[randomSuit1];
        string memory suitNumber2 = suits[randomSuit2];

        string memory card1 = createUrlForUI(string.concat(rankNumber1,suitNumber1));
        string memory card2 = createUrlForUI(string.concat(rankNumber2,suitNumber2));

        playerCardsUrls.push(card1);
        playerCardsUrls.push(card2);

        sumOfCardsPlayer();
        emit returnPlayerUrls(playerCardsUrls);
        // return playerCardsUrls;
        
    }

    event returnDealerUrls(string[]);

    // The function generate 2 random cards to the dealer
    function generateTwoRandomNumbersToDealer() public returns( string[] memory) {
        uint randomNumber11 = uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % 13;
        uint randomNumber22 = uint(keccak256(abi.encodePacked(block.gaslimit, block.number))) % 13;

        uint randomSuit11 = uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % 4;
        uint randomSuit22 = uint(keccak256(abi.encodePacked(block.gaslimit, block.number))) % 4;

        string memory rankNumber11 = ranks[randomNumber11];
        string memory rankNumber22 = ranks[randomNumber22];
        dealercardValues.push(checkValue(randomNumber11+1));
        dealercardValues.push(checkValue(randomNumber22+1));
        if((dealercardValues[0] == 1 && dealercardValues[1]==10) ||
            (dealercardValues[1] == 1 && dealercardValues[0]==10)){
                isBlackForDealer = true;
                loosedPlayer = true;
                loosedDealer = false;
                gameFinished = true;
                payment = 1;
                finishTheGame();

        }
        string memory suitNumber11 = suits[randomSuit11];
        string memory suitNumber22 = suits[randomSuit22];

        string memory card1 = createUrlForUI(string.concat(rankNumber11,suitNumber11));
        string memory card2 = createUrlForUI(string.concat(rankNumber22,suitNumber22));

        dealerCardsUrls.push(card1);
        dealerCardsUrls.push(card2);

        sumOfCardsDealer();
        emit returnDealerUrls( dealerCardsUrls);
    }
   
    //* The function add to the player a new random card
    function getRandomCardValueToPlayer() public {
        string memory rankNumber = ranks[getRandomRank()];
        string memory suitNumber = suits[getRandomSuit()];
        string memory card = createUrlForUI(string.concat(rankNumber,suitNumber));
        uint  cardVal = getRankNum(rankNumber);
        playerCardValues.push(cardVal);
        playerCardsUrls.push(card);
        sumOfCardsPlayer();
        if(playerCounter > 21){
            loosedPlayer = true;
            loosedDealer = false;
            gameFinished = true;
            payment = 0;
            finishTheGame();
            
        }
    }

    // event showDealerCardPics()
    //* The function adds to the dealer cards while he arrives to 17 or more
    function dealerCardDistributer() public{
        while(dealerCounter < 17){
            getRandomCardValueToDealer();
        }
        canTakeNewCardDealer = false;
        gameFinished = true;
        // emit showDealerCardPics(dealerCardsUrls);
        finishTheGame();        
    }

    //* The function add to the dealer a new random card
    function getRandomCardValueToDealer() public {
        
        string memory rankNumber = ranks[getRandomRank()];
        string memory suitNumber = suits[getRandomSuit()];
        string memory card = string.concat(rankNumber,suitNumber);
        dealercardValues.push(getRankNum(rankNumber));
        dealerCardsUrls.push(card);
        sumOfCardsDealer();
         if(dealerCounter > 21){
            loosedDealer = true;
            loosedPlayer = false;
            payment = 1;
        }
    }

    //* The function gets a random number from 0 to 12
    function getRandomRank() public view returns (uint256) {
        uint256 _randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % 13; // Generate random number between 0 to 12
        return (_randomNumber); 
    }

    //* The function get a random number from 0 to 3
    function getRandomSuit() public view returns (uint256) {
        uint256 _randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % 4; // Generate random number between 0 to 12
        return (_randomNumber); 
    }



    // The function gets the rank (string - first value) of a certain card in the deck and returns the number of card
    function getRankNum(string memory rank) internal pure returns (uint){
        if(compareStrings(rank,"A")){
            return 1;
        }
        if( compareStrings(rank,"0") || compareStrings(rank,"J") || compareStrings(rank,"Q") || compareStrings(rank, "K" )){
            return 10;
        }
        else{
            return stringToUint(rank);
        }
    }

    function finishGiveCard() external{
        canTakeNewCardPlayer = false;
        canTakeNewCardDealer = true;
        dealerCardDistributer();
    }
    
    // The function returns if the player won or lost
    function finishTheGame() public returns(string memory){
       delete playerCardValues;
    delete playerCardsUrls;
   delete dealercardValues;
  delete dealerCardsUrls;
        if(dealerCounter == playerCounter){
            loosedDealer = false;
            loosedPlayer = false;
            payment = 0; 
        }
        else if((dealerCounter > playerCounter) && dealerCounter < 21 ){
            loosedDealer = false;
            loosedPlayer = true;
            payment = 1;
        }else if((dealerCounter < playerCounter) && playerCounter < 21 ){
            loosedDealer = true;
            loosedPlayer = false;
            payment = 1;
        }
         else if((dealerCounter > playerCounter) && dealerCounter == 21 ){
            loosedDealer = false;
            loosedPlayer = true;
            payment = 1;
        }else if((dealerCounter < playerCounter) && playerCounter == 21 ){
            loosedDealer = true;
            loosedPlayer = false;
            payment = 3/uint256(2);
        }

        if(finishGame && loosedDealer == false && loosedPlayer == false){
            // don't do anything
            return "PUSH!!";
        }
        else if(finishGame && loosedDealer == true && loosedPlayer == false){
            // The dealer payes to the player
            paymentToPlayer();
            return "WIN!!!";
        }
        else if(finishGame && loosedDealer == false && loosedPlayer == true){
            // The player payes to the dealer
            contribute();
            return "LOSE!!!";
        }
      
    }
    function paymentToPlayer() public payable{
        require(address(this).balance >= paymentSum*payment, "Insufficient balance in the contract");
        playerAddress.transfer(paymentSum * payment);
    }

    function contribute() public payable{
        // msg.value is the value of Ether sent in a transaction
        balance += msg.value;
    }
}

    // mapping(address => uint256) public balances;

    // function deposit() public payable {
    //     balances[msg.sender] += msg.value;
    // }

    // function collect() public {
    //     uint256 amount = balances[msg.sender];
    //     require(amount > 0, "No balance to withdraw");

    //     balances[msg.sender] = 0;
    //     payable(address(this)).transfer(amount);
    // }


    // function paymentToDealer() public payable{
    //     require(address(this).balance >= paymentSum*payment, "Insufficient balance in the contract");
    //     playerAddress.transfer(paymentSum * payment);
    // }
// }