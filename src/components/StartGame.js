import React, { useEffect, useState } from "react";
import Game from "./Game";

import Web3 from "web3";

import "../App.css";
import Spinner from "./Spinner";

const StartGame = (props) => {
  //* Wallet account number variable prop from parent
  const account = props.account;
  //* Wallet account balance variable prop from parent
  const balance = props.balance;
  //* disconnect function to prop from parent
  const disconnect = props.disconnect;
  //* boolean value to check if can play to prop and update the view
  const canPlay = props.canPlay;
  //* usestate to canplay variable as props from parent to update the view
  const setCanPlay = props.setCanPlay;
  const checkAnoughBalance = props.checkAnoughBalance;

  const web3Api = props.web3Api;
  //* The input sum to play
  const [sumtoPlay, setSumToPlay] = useState("");
  //* The variable that update the view of the page (if we see the input field or not)
  const [showInput, setShowInput] = useState(false);
  // The variable check the input in each modification and get a boolean value to update show and hide of the start playing button
  let [inputChecker, setInputChecker] = useState(false);
  //* Start function is false when the page is loaded but turn to true when enterring input
  let [start, setStart] = useState(true);
  //* The variable update the state of the page and returns the table view
  let [goToTable, setGoToTable] = useState(false);

  const [loaded, setLoaded] = useState(true);
  const [playerCardsPics, setPlayerCardsPics] = useState();
  const [playerCount, setPlayerCount] = useState(0);
  const [dealerCardsPics, setDealerCardsPics] = useState();
  const [dealerCount, setDealerCount] = useState(0);
  const [index, setIndex] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);

  //* This function call the parent disconnect function and move the user to the home page
  async function disconnectWallet() {
    // const { contract } = web3Api;
    // await contract.finishTheGame({ from: account });
    setCanPlay(!canPlay);
    disconnect();
  }

  // This function shows to the user the input field to start
  function openInputField() {
    setShowInput(true);
  }

  // THIS FUNCTION NEEDS TO CALL THE SMART CONTRACT FUNCTION FOR CHECKING THE INPUT SUM AND UPDATE THE VIEW TO GAME OR NOT
  async function startGame() {
    setShowSpinner(true);
    const { contract, web3 } = web3Api;
    // if (loaded && inputChecker) {
    await contract.contribute({
      from: account,
      value: web3.utils.toWei(sumtoPlay, "ether"),
    });
    console.log("The payment has been made");
    // }
    const rs1 = true;
    if (rs1) {
      const distributCardToPlayer =
        await contract.generateTwoRandomNumbersToPlayer({
          from: account,
        });
      console.log(
        "Called the generate cards to player: ",
        distributCardToPlayer
      );
      const playerCountCards = await contract.showPlayerCounter({
        from: account,
      });
      console.log(
        "Player count cards",
        playerCountCards.logs[0].args[0].words[0]
      );

      setPlayerCount(playerCountCards.logs[0].args[0].words[0]);

      const showPlayerCardUrls = await contract.showPlayerCardUrls({
        from: account,
      });
      console.log("Called the show player cards URLs: ", showPlayerCardUrls);
      setPlayerCardsPics(showPlayerCardUrls);

      const distributCardToDealer =
        await contract.generateTwoRandomNumbersToDealer({
          from: account,
        });
      console.log(
        "Called the generate cards to dealer: ",
        distributCardToDealer
      );

      const dealerCountCards = await contract.showDealerCounter({
        from: account,
      });
      console.log(
        "dealer count cards",
        dealerCountCards.logs[0].args[0].words[0]
      );
      setDealerCount(dealerCountCards.logs[0].args[0].words[0]);

      const showDealerCardUrls = await contract.showDealerCardUrls({
        from: account,
      });
      setDealerCardsPics(showDealerCardUrls);
      console.log("Called the show dealer cards URLs: ", showDealerCardUrls);
      // ## WE NEED TO SET THE DEALER CARDS URLS!
      // setPlayerCardsPics(showDealerCardUrls);

      console.log("Player Cards Urls are: ", showPlayerCardUrls);

      // const totalNumOfPlayers = await contract.showTotalNumOfPlayers({
      //   from: account,
      // });
      // console.log("number of players:", totalNumOfPlayers);

      //##############################################################################
      // let len = distributCardToPlayer.logs[0].args[0];
      // let len1 = len.length;
      // for (let i = 0; i < len1; i++) {
      //   setPlayerCardsPics([
      //     playerCardsPics,
      //     ...distributCardToPlayer.logs[0].args[0][i],
      //   ]);
      //   console.log(distributCardToPlayer.logs[0].args[0][i]);
      // }
      //##############################################################################
      let temp = Math.ceil({ balance });

      const run = await contract.checkInput(
        web3.utils.toWei("15", "ether"),
        web3.utils.toWei(sumtoPlay, "ether"),
        { from: account }
      );
      console.log("run: ", run);
      setShowSpinner(false);

      setGoToTable(true);
    } else {
      setGoToTable(false);
    }
  }

  // The function runs the smart contract balance checker once
  async function checkBalanceAgain() {
    await checkAnoughBalance(account);
  }

  function checkIfInputIsGood(val) {
    if (Number(val) > 1 || Number(val) < 0.01) {
      setLoaded(false);
      setInputChecker(false);
    } else {
      setLoaded(true);
      setInputChecker(true);
    }
  }

  return (
    <div>
      {showSpinner ? (
        <Spinner />
      ) : (
        <div>
          {goToTable ? (
            <Game
              disconnectWallet={disconnectWallet}
              showPlayerCardUrls={playerCardsPics}
              showPlayerCount={playerCount}
              setPlayerCount={setPlayerCount}
              showDealerCardUrls={dealerCardsPics}
              showDealerCount={dealerCount}
              setDealerCount={setDealerCount}
              index={index}
              setIndex={setIndex}
              web3Api={web3Api}
              account={account}
              setDealerCardsPics={setDealerCardsPics}
              hitCard={""}
              sumtoPlay={sumtoPlay}
            />
          ) : (
            <div>
              <h2>We have found a wallet!</h2>
              <p>Account: {account}</p>
              <p>Balance: {balance} ETH</p>
              {canPlay ? (
                // If the balance is anough it shows the lets play button
                <button onClick={openInputField}>Let's Play</button>
              ) : (
                // If the balance is not anough it shows the check again btn and the error text
                <div>
                  <div id="low-balance-error">
                    You don't have anough balance in your metamask wallet to
                    play the blackjack game.
                  </div>
                  <button onClick={checkBalanceAgain}>Check Again</button>
                </div>
              )}
              {showInput ? (
                <div id="input-div">
                  <label htmlFor="sumToPlay">
                    Enter the sum of eth you want to play:
                  </label>
                  <input
                    type="number"
                    id="sumToPlay"
                    placeholder="0.01 Eth"
                    value={sumtoPlay}
                    onChange={async (e) => {
                      setStart(false);
                      setSumToPlay(e.target.value);
                      checkIfInputIsGood(e.target.value);
                    }}
                  />
                  {canPlay && inputChecker ? (
                    <button onClick={startGame}>Start Playing</button>
                  ) : (
                    <div></div>
                  )}

                  {start ? (
                    <div></div>
                  ) : (
                    <div>
                      {inputChecker ? (
                        <div>{console.log("The player can play")}</div>
                      ) : (
                        <div>
                          {loaded ? (
                            <div></div>
                          ) : (
                            <div>
                              You Cannot Play, change the sum your entered...
                              <div>
                                the min is 0.01eth and the max is 1eth to play
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div></div>
              )}
              {account ? (
                <button className="disconnect-btn" onClick={disconnectWallet}>
                  Disconnect
                </button>
              ) : (
                <div>No wallet connected.</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StartGame;
