import React, { useState, useEffect } from "react";
import Web3 from "web3";
import StartGame from "./components/StartGame";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "./utils/load-contract";
import gambling from "../src/assets/gambling1.png";

import "./App.css";
import contract from "@truffle/contract";

function App() {
  //* Wallet account number variable
  const [account, setAccount] = useState("");
  //* wallet balance sum variable
  const [balance, setBalance] = useState("");
  //* Boolean variable for switching between pages
  const [isConnected, setIsConnected] = useState(false);
  const [index, setIndex] = useState(false);

  //* The variable that update the status of the button play accorded to the return of the balance checker function
  const [canPlay, setCanPlay] = useState(false);

  // SMART CONTRACT LOADER VARIABLE
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });

  // SMART CONTRACT LOADER
  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      const contract = await loadContract("Blackjack", provider);
      if (provider) {
        setWeb3Api({
          provider: provider,
          web3: new Web3(provider),
          contract: contract,
        });
        console.log("Contract Details: ", contract);
        console.log("The web3API: ", web3Api);
      } else {
        console.log("Please install Metamask");
      }
    };
    loadProvider();
  }, [index]);

  //* The function is disconnecting the Dapp from the userWallet and return the home page of the game
  async function disconnectWallet() {
    const { contract } = web3Api;
    await contract.finishTheGame({ from: account });
    console.log("the function for reseting the cards has been activated");
    setAccount("");
    setBalance(0);
    setIsConnected(false);
  }

  //* The function runs when the user want to connect his wallet to start playing
  function connectFunction() {
    if (isConnected === false) {
      async function loadWeb3() {
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          try {
            // This code is asking the user to reconnect every-time
            await window.ethereum.request({
              method: "wallet_requestPermissions",
              params: [
                {
                  eth_accounts: {},
                },
              ],
            });
            const accounts = await web3.eth.getAccounts(); // Get the wallet account address
            setIndex(true);
            const acc = accounts[0]; // Update the account variable
            console.log("account number", acc);

            checkAnoughBalance(acc);
            // setBalance(bal);
          } catch (error) {
            console.error(error);
          }
        } else {
          alert("Please install MetaMask!"); // If metamask pluggin was not found it return an alert to the user.
        }
      }
      loadWeb3(); // Calls the connection funtion
    } else {
      alert(
        "There is problem connecting to your wallet. Check if the truffle application is running."
      );
    }
  }

  async function loadBalance(acc2) {
    const { contract, web3 } = web3Api;
    let blc1 = await web3.eth.getBalance(acc2);
    let blc = web3.utils.fromWei(blc1, "ether");
    setBalance(blc);
    console.log(String(Math.ceil(blc1)) + typeof String(Math.ceil(blc1)));
    return String(Math.ceil(blc1));
  }

  async function checkAnoughBalance(acc1) {
    const { contract, web3 } = web3Api;
    console.log("check balance function ", acc1);
    setAccount(acc1);
    const bal = await contract.checkBalance(await loadBalance(acc1), {
      from: acc1,
    });
    setIsConnected(true);
    const result = bal.logs[0].args["balanceChecker"];
    console.log(result);
    console.log(acc1);
    setCanPlay(result);
  }

  return (
    <div className="App">
      <div className="container">
        {isConnected ? (
          <StartGame
            account={account}
            balance={balance}
            isConnected={isConnected}
            setIsConnected={setIsConnected}
            disconnect={disconnectWallet}
            canPlay={canPlay}
            setCanPlay={setCanPlay}
            checkAnoughBalance={checkAnoughBalance}
            web3Api={web3Api}
            // checkIfCanPlay={checkIfCanPlay}
            // example={example}
          />
        ) : (
          <div>
            <div className="title">Blackjack Game</div>
            <div className="subtitle">
              Play your <p className="txt-subtitle">online casino</p> easily
            </div>
            <div>
              <p className="txt">
                In connecting your Metamask wallet you agree to{" "}
                <a
                  href="https://iclg.com/practice-areas/gambling-laws-and-regulations/israel"
                  rel="noreferrer"
                  target="_blank"
                >
                  Terms of use and State regulations
                </a>
                . <br></br>To prevent you to loose too much in this gambling
                game the maximum bet is 1 Eth and the minimum bet is 0.01 Eth.
              </p>
            </div>
            <img src={gambling} alt="gambling" width="220" height="150" />
            <div>
              <button id="btn" onClick={connectFunction}>
                Connect
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
