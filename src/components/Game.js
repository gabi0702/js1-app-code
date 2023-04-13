import React, { useState, useEffect } from "react";
import "../App.css";
import reverse from "../assets/reverse1.png";

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

    const cards = await contract.dealerCardDistributer({ from: account });
    const dealerCountCards = await contract.showDealerCounter({
      from: account,
    });
    await delay(1500);
    console.log(cards.logs[0].args[0]);
    let temp = [];
    for (let i = 0; i < cards.logs[0].args[0].length; i++) {
      temp.push(cards.logs[0].args[0][i]);
    }
    console.log("final list: ", temp);
    setDealercards(temp);
    setDealerCount(dealerCountCards.logs[0].args[0].words[0]);
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
  async function sendMoney() {
    const { contract, web3 } = web3Api;
    let blc = web3.utils.toWei(String(sumToPlay), "ether");
    console.log(blc);
    await contract.contribute({ value: blc, from: account });
    console.log("the function was called.");
  }

  return (
    <div className="bg-game">
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
      <button onClick={stand}>Stand</button>
      <button onClick={hit}>Hit</button>
      <button onClick={sendMoney}>Send Money</button>
      <button onClick={disconnectWallet}>finish the game</button>
    </div>
  );
};

export default Game;
