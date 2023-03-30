import React, { useEffect, useState } from "react";
import Game from "./Game";
import Web3 from "web3";

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

  // const [letsPlay, setLetsPlay] = useState(false);

  //* This function call the parent disconnect function and move the user to the home page
  function disconnectWallet() {
    setCanPlay(!canPlay);
    disconnect();
  }

  // This function shows to the user the input field to start
  function openInputField() {
    setShowInput(true);
  }

  // THIS FUNCTION NEEDS TO CALL THE SMART CONTRACT FUNCTION FOR CHECKING THE INPUT SUM AND UPDATE THE VIEW TO GAME OR NOT
  async function startGame() {
    const rs1 = await checkInput();
    console.log(rs1);
    if (rs1) {
      setGoToTable(true);
      // setLetsPlay(true);
    } else {
      setGoToTable(false);
      // setLetsPlay(false);
    }
  }

  // The function runs the smart contract balance checker once
  async function checkBalanceAgain() {
    await checkAnoughBalance(account);
  }

  async function checkInput() {
    const { contract, web3 } = web3Api;
    const sm = await web3.utils.toWei(sumtoPlay, "ether");
    const bal = await web3.utils.toWei(balance, "ether");
    const check = await contract.checkInput(String(bal), String(sm), {
      from: account,
    });
    const result = check.logs[0].args["inputChecked"];
    return result;
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
  );
};

export default StartGame;
