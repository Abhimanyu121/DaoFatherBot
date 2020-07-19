import { connect, describeScript } from "@aragon/connect";
import {Voting} from '@aragon/connect-thegraph-voting'
const EMPTY_SCRIPT = "0x00000001";

const fetch = async () =>{
    const org = await connect('0xc2E7B13306a2f2b9dbE4149e6eA4eC30EaCa8e5C', 'thegraph', { chainId: 4 })
    const apps = await org.apps()
    const voting = new Voting(
        '0xf6d0a39082cf2b9589780bc8196701f9b13b0018',
        'https://api.thegraph.com/subgraphs/name/aragon/aragon-voting-rinkeby',false
      )
    const votes = await voting.votes()
    const processedVotes = await Promise.all(
      votes.map(async vote => processVote(vote, apps))
    );
    processedVotes.reverse()
    console.log(processedVotes  )

}
async function processVote(vote, apps) {
  if (vote.script === EMPTY_SCRIPT) {
    return vote;
  }

  const [{ description }] = await describeScript(vote.script, apps);
  return { ...vote, metadata: description };
}

fetch()
