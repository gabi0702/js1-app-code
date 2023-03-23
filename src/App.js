import React, { useEffect, useState } from "react";
import Web3 from "web3";
import StartGame from "./components/StartGame";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "./utils/load-contract";
import gambling from "../src/assets/gambling1.png";

import "./App.css";

function App() {
  //* Wallet account number variable
  const [account, setAccount] = useState("");
  //* wallet balance sum variable
  const [balance, setBalance] = useState("");
  //* Boolean variable for switching between pages
  const [isConnected, setIsConnected] = useState(false);

  // The txt that the user see on the next page if he can play or not
  // const [example, setExample] = useState("");

  //* The variable that update the status of the button play
  //* accorded to the return of the balance checker function
  const [canPlay, setCanPlay] = useState(false);

  // #### SMART CONTRACT LOADER VARIABLE
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });

  // ### NEED TO BE ON THE SMART CONTRACT
  // const minimumBalance = 50;

  // #### SMART CONTRACT LOADER #####
  // // We need to check why it's not working
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
        console.log(contract);
      } else {
        console.log("Please install Metamask");
      }
    };
    loadProvider();
  }, [isConnected]);

  //* The function is disconnecting the Dapp from the userWallet and return the home page of the game
  async function disconnectWallet() {
    setAccount("");
    setBalance("");
    setIsConnected(false);
    // setExample("");
    // setIsConnected(false);
  }

  //* The function runs when the user want to connect his wallet to start playing
  function connectFunction() {
    if (isConnected === false) {
      async function loadWeb3() {
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          try {
            // This code is not asking the user to reconnect and it's not good
            // await window.ethereum.request({ method: "eth_requestAccounts" });
            // This code is asking the user to reconnect every-time
            await window.ethereum.request({
              method: "wallet_requestPermissions",
              params: [
                {
                  eth_accounts: {},
                },
              ],
            });
            // Get the wallet account number
            const accounts = await web3.eth.getAccounts();
            // Update the account variable
            setAccount(accounts[0]);
            // Get the wallet account balance
            //* We wanted to check balance on the smart contract but there is some issues.
            //* const getBalanceSum = async () => {
            //*   const { contract, web3 } = web3Api;
            //*   setBalance(await contract.getBalance({ value: accounts }));
            //* };
            //* getBalanceSum();
            const balance = await web3.eth.getBalance(accounts[0]);
            // Update the account balance
            setBalance(Web3.utils.fromWei(balance, "ether"));
            // Move the user to the next page
            setCanPlay(checkTheBalance());
            // #### IF THE BALANCE IS ANOUGH
            setIsConnected(true);
          } catch (error) {
            console.error(error);
          }
        } else {
          // If metamask pluggin was not found it return an alert to the user.
          alert("Please install MetaMask!");
        }
      }
      // Calls the connection funtion
      loadWeb3();
    } else {
      alert(
        "There is problem to connect to your wallet check if the truffle application is running"
      );
    }
  }

  // יש לבדוק איך לכבר את סולידיטי לריאקט
  async function checkTheBalance() {
    const web3 = new Web3(window.ethereum);

    const myContract = new web3.eth.Contract("Blackjack.abi", account);

    const getBalance = async () => {
      const balance1 = await myContract.methods.balance().call();
      console.log(balance1);
      alert(balance1);
    };
    setBalance(getBalance());
    // await contract.methods.checkBalance(balanceAccount).call();
  }

  // ############# THIS CODE NEED TO BE ON THE SMART CONTRACT #########
  // // This function checks if the balance is greater than the minimum to play and set the canplay variable true of false.
  // // WE NEED TO CALL THE SMART CONTRACT AND GET FROM IT true OR false
  // // THE RETURN IS UPDATING THE 'EXEMPLE' VARIABLE AND LET THE USER PLAY OR NOT
  // useEffect(() => {
  //   if (balance >= minimumBalance) {
  //     setCanPlay(true);
  //   }
  // }, [balance]);
  // ###################################################################

  // // This function checks if canPlay variable is true or false and return if can play.
  // function checkIfCanPlay() {
  //   if (canPlay) {
  //     if (account > 0) {
  //       console.log("Can Play");
  //       setExample("You Can Play!");
  //       return true;
  //     } else {
  //       console.log("Cannot Play...");
  //       setExample("You Cannot Play...");
  //       return false;
  //     }
  //   } else if (canPlay === false && balance !== "") {
  //     console.log("Cannot Play...");
  //     setExample("You Cannot Play...");
  //     return false;
  //   } else {
  //     console.log("Metamask wallet not detected.");
  //     setExample("Metamask wallet not detected.");
  //     return false;
  //   }
  // }

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
                  href="https://www.w3schools.com"
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
