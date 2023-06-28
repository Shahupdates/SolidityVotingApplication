// App.js

import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import VotingContract from './contracts/Voting.json';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()
    const networkData = VotingContract.networks[networkId]
    if(networkData) {
      const voting = new web3.eth.Contract(VotingContract.abi, networkData.address)
      this.setState({ voting })
      const candidatesCount = await voting.methods.candidatesCount().call()
      this.setState({ candidatesCount })

      for (let i = 1; i <= candidatesCount; i++) {
        const candidate = await voting.methods.candidates(i).call()
        this.setState({ 
          candidates: [...this.state.candidates, candidate] 
        })
      }
    } else {
      window.alert('Voting contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = { 
      account: '', 
      candidates: [], 
      candidatesCount: 0 
    }
  }

  render() {
    return (
      <div>
        <h1>Decentralized Voting Application</h1>
        { this.state.candidates.map((candidate, key) => {
          return(
            <div key={key}>
              <p>{candidate.name}</p>
              <p>{candidate.voteCount} votes</p>
            </div>
          )
        })}
      </div>
    );
  }
}

export default App;
