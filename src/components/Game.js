import React, { useState, useEffect } from "react";
import "../App.css";
import reverse from "../assets/reverse1.png";

const Game = (props) => {
  const disconnectWallet = props.disconnectWallet;
  const [notFinded, setNotFinded] = useState(false);
  const [deckID, setDeckID] = useState("");
  const [playerCards, setPlayerCards] = useState(props.showPlayerCardUrls);

  const playerCount = props.showPlayerCount;
  const [dealercards, setDealercards] = useState(props.showDealerCardUrls);
  const [dealerCount, setDealerCount] = useState(props.showDealerCount);
  // const setDealerCount = props.setDealerCount;
  const index1 = props.index;
  const setIndex1 = props.setIndex;
  const account = props.account;
  const web3Api = props.web3Api;
  const setDealerCardsPics = props.setDealerCardsPics;
  const standFunc = props.standFunc;
  // const hitCard = props.hitCard;
  const sumToPlay = props.sumToPlay;

  async function stand() {
    // await standFunc;
    setIndex1(!index1);
    // const { contract } = web3Api;
    // await contract.dealerCardDistributer({ from: account });
    // const showDealerCardUrls = await contract.showDealerCardUrls({
    //   from: account,
    // });
    // // setDealerCardsPics(showDealerCardUrls);
    // setDealercards(showDealerCardUrls);
    // console.log("dealer cards: ", dealercards);

    // // setDealerCardsPics(showDealerCardUrls);
    // const dealerCountCards = await contract.showDealerCounter({
    //   from: account,
    // });
    // setDealerCount(dealerCountCards.logs[0].args[0].words[0]);
    // console.log(dealerCountCards.logs[0].args[0].words[0]);
    // setDealerCount(dealerCountCards);
  }

  // async function getPic(cardNum) {
  //   while (!notFinded) {
  //     await fetch(
  //       "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
  //     )
  //       .then((res) => res.json())
  //       .then((data) => {
  //         setDeckID(data.deck_id);
  //         console.log(deckID);
  //       })
  //       .catch((err) => {
  //         console.log(err.message);
  //       });
  //     imageFinder(deckID, cardNum);
  //   }
  // }
  // async function imageFinder(deckID, cardNum) {
  //   await fetch(
  //     "https://deckofcardsapi.com/api/deck/" + { deckID } + "/draw/?count=1"
  //   )
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const len = data.cards.length();
  //       console.log({ len } + data.deck_id);
  //       for (let i = 0; i < len; i++) {
  //         if (cardNum === data.cards[i].value) {
  //           console.log("FINDED" + data.cards[i].images.png);
  //           setNotFinded(true);
  //           break;
  //         }
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //     });
  // }

  // function getPic1() {
  //   getPic("7");
  // }
  // useEffect(() => {
  // 1. call the card distribution function - it will distribut 4 cards (num 1 and 3 for the player and 2 and 4 for the dealer)
  // 2. get the array of all the cards
  // 3. get the sum of the cards for the player and the dealer and the result of the game.
  // 4.1. call https://deckofcardsapi.com/ to get the card picture
  // 4.2. arrange the ui of the cards on the table
  // 5.1. if the dealer won with 21 contract paye from the player to the dealer.
  // 5.2. if the player won with 21 contract paye from the contract to the player.
  // 6. show player hit and stay buttons
  // 6.1. if player clicks on stay button: it runs the function of dealer card distribution that runs the end game result function
  // 6.2. if player clicks on hit button: it runs the count function.
  // 7. if th
  // }, []);
  async function sendMoney() {
    const { contract, web3 } = web3Api;
    let blc = web3.utils.toWei(String(sumToPlay), "ether");
    console.log(blc);
    await contract.contribute({ value: blc, from: account });
    console.log("the function was called.");
  }
  return (
    <div className="bg-game">
      {/* {playerCards} */}
      {index1 ? <div></div> : <h3>{dealerCount}</h3>}
      {dealercards.map((card, index) =>
        index === 1 && index1 === true ? (
          <img key={index} src={reverse} alt="" width="80" height="120" />
        ) : (
          <img key={index} src={card} alt="" width="80" height="120" />
        )
      )}
      <div></div>{" "}
      {playerCards.map((card) => (
        <img src={card} alt="" width="80" height="120" />
      ))}
      <h3>{playerCount}</h3>
      <div></div>
      <button onClick={stand}>Stand</button>
      <button>Hit</button>
      <button onClick={sendMoney}>Send Money</button>
      <button onClick={disconnectWallet}>finish the game</button>
    </div>
  );
};

export default Game;
