import React, { useState, useEffect } from "react";
import "../App.css";
import reverse from "../assets/reverse1.png";
import exit from "../assets/exit.png";
const Game = (props) => {
  const disconnectWallet = props.disconnectWallet;
  const [notFinded, setNotFinded] = useState(false);
  const [deckID, setDeckID] = useState("");
  const [playerCards, setPlayerCards] = useState(props.showPlayerCardUrls);

  const [text, setText] = useState("");

  const playerCount = props.showPlayerCount;
  const setPlayerCount = props.setPlayerCount;
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

  const delay = (ms) =>
    new Promise((resolve) => {
      setIndex1(!index1);
      setTimeout(resolve, ms);
    });

  async function stand() {
    // await standFunc;
    const { contract } = web3Api;
    console.log(contract);
    const cards = await contract.dealerCardDistributer({ from: account });
    const dealerCountCards = await contract.showDealerCounter({
      from: account,
    });
    console.log("dealer Cards after stand: ", cards);
    console.log("dealer Counter after stand: ", dealerCountCards);
    await delay(1000);
    console.log(cards.logs[0].args[0]);
    let temp = [];
    for (let i = 0; i < cards.logs[0].args[0].length; i++) {
      temp.push(cards.logs[0].args[0][i]);
    }
    console.log("final list: ", temp);
    setDealercards(temp);
    setDealerCount(dealerCountCards.logs[0].args[0].words[0]);
    await delay(2500);
    if (dealerCount > 21) {
      setText("You Won! The transfer have been made");
    }
    if (playerCount > 21) {
      setText("You lost...");
    }
    if (dealerCount <= 21 && playerCount <= 21 && dealerCount > playerCount) {
      setText("You lost...");
    }
    if (playerCount <= 21 && dealerCount <= 21 && dealerCount < playerCount) {
      setText("You Won! The transfer have been made");
    }
    if (playerCount <= 21 && dealerCount <= 21 && dealerCount === playerCount) {
      setText("Push...!");
    }
  }

  async function hit() {
    if (playerCount <= 21) {
      const { contract } = web3Api;
      const cards = await contract.getRandomCardValueToPlayer({
        from: account,
      });
      const playerCounterCards = await contract.showPlayerCounter({
        from: account,
      });
      console.log(cards);
      let temp = [];
      for (let i = 0; i < cards.logs[0].args[0].length; i++) {
        temp.push(cards.logs[0].args[0][i]);
      }
      console.log("final list: ", temp);
      setPlayerCards(temp);
      setPlayerCount(playerCounterCards.logs[0].args[0].words[0]);
      if (playerCounterCards.logs[0].args[0].words[0] > 21) {
        setText("You lost...");
        setIndex1(!index1);
      }
    }
  }
  // async function finish() {
  //   const { contract } = web3Api;
  //   const res = await contract.finishTheGame({
  //     from: account,
  //   });
  //   console.log("Finish function result: ", res);
  // }

  return (
    <div className="bg-game">
      <button className="btn-game1" id="finish-btn" onClick={disconnectWallet}>
        <div id="box">
          <img src={exit} alt="" width="20" height="20" />
          Leave the game
        </div>
      </button>
      <h3>Dealer</h3>
      {index1 ? <div></div> : <h3>{dealerCount}</h3>}
      {dealercards.map((card, index) =>
        index === 1 && index1 === true ? (
          <img key={index} src={reverse} alt="" width="40" height="60" />
        ) : (
          <img key={index} src={card} alt="" width="40" height="60" />
        )
      )}
      <div className="dist"></div>{" "}
      {playerCards.map((card) => (
        <img src={card} alt="" width="40" height="60" />
      ))}
      <h3>{playerCount}</h3>
      <div>{text}</div>
      <button className="btn-game" id="stand-btn" onClick={stand}>
        Stand
      </button>
      <button className="btn-game" id="hit-btn" onClick={hit}>
        Hit New Card
      </button>
    </div>
  );
};

export default Game;
