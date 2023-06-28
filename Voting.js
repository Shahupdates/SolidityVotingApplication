const Voting = artifacts.require("Voting");

contract("Voting", accounts => {
  it("should be initialized with zero candidates", async () => {
    let instance = await Voting.deployed();
    let count = await instance.candidatesCount();
    assert.equal(count, 0);
  });

  it("should allow the owner to add a candidate", async () => {
    let instance = await Voting.deployed();
    await instance.addCandidate("Candidate 1", {from: accounts[0]});
    let count = await instance.candidatesCount();
    assert.equal(count, 1);
  });

  it("should only allow owner to add a candidate", async () => {
    let instance = await Voting.deployed();
    try {
      await instance.addCandidate("Candidate 2", {from: accounts[1]});
      assert.fail();
    } catch (err) {
      assert.ok(/revert/.test(err.message));
    }
  });

  it("should allow a user to get the candidate by id", async () => {
    let instance = await Voting.deployed();
    let candidate = await instance.candidates(0);
    assert.equal(candidate.name, "Candidate 1");
  });
});
