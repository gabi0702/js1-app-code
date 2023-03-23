import React, { useState, useEffect } from "react";
import "../App.css";

const Game = (props) => {
  const disconnectWallet = props.disconnectWallet;
  const [notFinded, setNotFinded] = useState(false);
  const [deckID, setDeckID] = useState("");
  const [playerCards, setPlayerCards] = useState([]);

  async function getPic(cardNum) {
    while (!notFinded) {
      await fetch(
        "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
      )
        .then((res) => res.json())
        .then((data) => {
          setDeckID(data.deck_id);
          console.log(deckID);
        })
        .catch((err) => {
          console.log(err.message);
        });
      imageFinder(deckID, cardNum);
    }
  }
  async function imageFinder(deckID, cardNum) {
    await fetch(
      "https://deckofcardsapi.com/api/deck/" + { deckID } + "/draw/?count=1"
    )
      .then((res) => res.json())
      .then((data) => {
        const len = data.cards.length();
        console.log({ len } + data.deck_id);
        for (let i = 0; i < len; i++) {
          if (cardNum === data.cards[i].value) {
            console.log("FINDED" + data.cards[i].images.png);
            setNotFinded(true);
            break;
          }
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  function getPic1() {
    getPic("7");
  }
  useEffect(() => {
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
  }, []);
  return (
    <div className="bg-game">
      <div>
        Let's play on the table
        <button onClick={getPic1}>Click me to find the 5 card</button>
        <button onClick={disconnectWallet}>finish the game</button>
      </div>
    </div>
  );
};

export default Game;
