import React, { useEffect, useState } from "react";
import Game from "./Game";
import "../App.css";

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
  //* The input sum to play
  const [sumtoPlay, setSumToPlay] = useState();
  //* The variable that update the view of the page (if we see the input field or not)
  const [showInput, setShowInput] = useState(false);
  // The variable check the input in each modification and get a boolean value to update show and hide of the start playing button
  let [inputChecker, setInputChecker] = useState(false);
  //* Start function is false when the page is loaded but turn to true when enterring input
  let [start, setStart] = useState(true);
  //* The variable update the state of the page and returns the table view
  let [goToTable, setGoToTable] = useState(false);

  // const isConnected = props.isConnected;
  // const setIsConnected = props.setIsConnected;
  // const checkIfCanPlay = props.checkIfCanPlay;
  // const minSumForGame = 0.05;
  // const maxSumForGame = 2;
  // const [letsPlay, setLetsPlay] = useState(false);
  // const example = props.example;

  //* This function call the parent disconnect function and move the user to the home page
  function disconnectWallet() {
    setCanPlay(!canPlay);
    disconnect();
  }

  // This function shows to the user the input field to start
  function openInputField() {
    setShowInput(true);
  }

  // ##### THIS FUNCTION NEEDS TO CALL THE SMART CONTRACT FUNCTION FOR CHECKING THE INPUT SUM AND UPDATE THE VIEW TO GAME OR NOT
  function startGame() {
    if (
      true
      // THE SMART CONTRACT CHECK IF THE BALANCE IS OKAY AND UPDATE THE VIEW STATE VARIABLE
      // balance > 50 &&
    ) {
      setGoToTable(true);
      // setLetsPlay(true);
    } else {
      // setLetsPlay(false);
    }
  }

  // ###  THE FUNCTION RUNS THE SMART CONTRACT BALANCE CHECKER FUNCTION AND UPDATE THE VIEW STATE VARIABLE
  async function checkBalanceAgain() {}

  return (
    <div>
      {/* <Game /> */}
      {goToTable ? (
        <Game disconnectWallet={disconnectWallet} />
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
                You don't have anough balance in your metamask wallet to play
                the blackjack game.
              </div>
              <button onClick={checkBalanceAgain}>Check Again</button>
            </div>
          )}
          {showInput ? (
            <div id="input-div">
              {/* <h3>example</h3> */}
              <label htmlFor="sumToPlay">
                Enter the sum of eth you want to play:
              </label>
              <input
                type="number"
                id="sumToPlay"
                placeholder="0.01 Eth"
                value={sumtoPlay}
                // ### CONNECT TO SMART CONTRACT FOR CHECKING INPUT
                onChange={async (e) => {
                  setStart(false);
                  setSumToPlay(e.target.value);
                  if ("HERE THE FUNCTION TO CONTRACT and give it sumToPlay") {
                    setInputChecker(true);
                  } else {
                    setInputChecker(false);
                  }
                }}
              />
              {canPlay ? (
                <button onClick={startGame}>Start Playing</button>
              ) : (
                <div></div>
              )}

              {start ? (
                <div></div>
              ) : (
                <div>
                  {inputChecker ? (
                    <div>You Can Play Now</div>
                  ) : (
                    <div>
                      You Cannot Play, change the sum your entered...
                      <div>the min is 0.01eth and the max is 2eth to play</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div></div>
          )}
          {/* Check if account is not empty and show the disconnect button */}
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
  );
};

export default StartGame;
