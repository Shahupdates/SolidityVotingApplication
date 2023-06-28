// Voting.sol

pragma solidity ^0.5.0;

contract Voting {
  struct Candidate {
    uint id;
    string name;
    uint voteCount;
  }

  mapping(address => bool) public voters;
  mapping(uint => Candidate) public candidates;
  uint public candidatesCount;

  address public owner;
  uint public votingEndTime;

  constructor() public {
    owner = msg.sender;
    votingEndTime = now + 86400; // Voting ends after 24 hours
  }

  function addCandidate(string memory _name) public {
    require(msg.sender == owner, "Only the owner can add a candidate.");
    candidatesCount++;
    candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
  }

  function vote(uint _candidateId) public {
    require(now <= votingEndTime, "Voting is already ended.");
    require(!voters[msg.sender], "You have already voted.");
    require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate.");

    voters[msg.sender] = true;
    candidates[_candidateId].voteCount++;
  }

  function endVoting() public view returns (uint) {
    require(msg.sender == owner, "Only the owner can end the voting.");
    require(now >= votingEndTime, "Voting is not yet finished.");

    uint winningVoteCount = 0;
    uint winningCandidate = 0;

    for (uint i = 0; i < candidates.length; i++) {
      if (candidates[i].voteCount > winningVoteCount) {
        winningVoteCount = candidates[i].voteCount;
        winningCandidate = i;
      }
    }

    return winningCandidate;
  }
}
