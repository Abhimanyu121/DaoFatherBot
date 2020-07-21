const connect = require("@aragon/connect");
const TokenManager = require("@aragon/connect-thegraph-tokens");
const Voting = require("@aragon/connect-thegraph-voting");
const EMPTY_SCRIPT = "0x00000001";
const TOKENS_APP_ADDRESS = "0x459af03894cb2ed9bfad56c9bfeb4e63ad182736";
const TOKENS_APP_SUBGRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/aragon/aragon-tokens-rinkeby";

const fetchVotes = async () => {
  const org = await connect.connect(
    "0xc2E7B13306a2f2b9dbE4149e6eA4eC30EaCa8e5C",
    "thegraph",
    { chainId: 4 }
  );
  const apps = await org.apps();
  // apps.forEach(console.log)
  const voting = new Voting.Voting(
    "0xf6d0a39082cf2b9589780bc8196701f9b13b0018",
    "https://api.thegraph.com/subgraphs/name/aragon/aragon-voting-rinkeby",
    false
  );
  const votes = await voting.votes();
  const processedVotes = await Promise.all(
    votes.map(async (vote) => processVote(vote, apps, org.provider))
  );
  //console.log(org)
  processedVotes.reverse();
  return processedVotes;
};

const processVote = async (vote, apps, provider) => {
  if (vote.script === EMPTY_SCRIPT) {
    return vote;
  }

  const [{ description }] = await connect.describeScript(
    vote.script,
    apps,
    provider
  );
  return { ...vote, metadata: description };
};

const fetchTokenHolders = async () => {

  const tokenManager = new TokenManager.TokenManager(
    TOKENS_APP_ADDRESS,
    TOKENS_APP_SUBGRAPH_URL
  );
  return await tokenManager.token();
};

module.exports = {
  fetchVotes,
  fetchTokenHolders,
};
