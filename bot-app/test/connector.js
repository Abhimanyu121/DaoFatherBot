const connect = require('@aragon/connect') ;
const TokenManager = require('@aragon/connect-thegraph-tokens');
const Voting = require('@aragon/connect-thegraph-voting');
const Finance = require('@aragon/connect-finance');
const Web3 = require('web3');
const { txLink } = require('../src/Common/utils');
const EMPTY_SCRIPT = '0x00000001';
const TOKENS_APP_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/aragon/aragon-tokens-rinkeby';

const fetchVotes = async () => {
	const org = await connect.connect(
		'0xc2E7B13306a2f2b9dbE4149e6eA4eC30EaCa8e5C',
		'thegraph',
		{ chainId: 4 },
	);
	const apps = await org.apps();
	// console.log(apps)
	const result = apps.find(obj => {
		return obj.name === 'voting';
	});

	const voting = new Voting.Voting(
		result.address,
		'https://api.thegraph.com/subgraphs/name/aragon/aragon-voting-rinkeby',
		false,
	);
	voting.onVotes(async (e)=>{
		const processedVotes = await Promise.all(
			e.map(async (e) => processVote(e, apps, org.provider)),
		);
		console.log(processedVotes);
	},
	);
	const votes = await voting.votes();
	const processedVotes = await Promise.all(
		votes.map(async (vote) => processVote(vote, apps, org.provider)),
	);
	// console.log(org)
	// processedVotes.reverse();
	// console.log(processedVotes);
	return processedVotes;
};

const processVote = async (vote, apps, provider) => {
	if (vote.script === EMPTY_SCRIPT) {
		return vote;
	}

	const [{ description }] = await connect.describeScript(vote.script, apps, provider);
	return { ...vote, metadata: description };
};

const fetchTokenHolders = async () => {
	const org = await connect.connect(
		'0xc2E7B13306a2f2b9dbE4149e6eA4eC30EaCa8e5C',
		'thegraph',
		{ chainId: 4 },
	);
	const apps = await org.apps();
	const result = apps.find(obj => {
		return obj.name === 'token-manager';
	});
	const tokenManager = new TokenManager.TokenManager(
		result.address,
		TOKENS_APP_SUBGRAPH_URL,
	);
	console.log(await tokenManager.token());
};
const fetchBalance = async () => {
	const org = await connect.connect(
		'0xc2E7B13306a2f2b9dbE4149e6eA4eC30EaCa8e5C',
		'thegraph',
		{ chainId: 4 },
	);
	const apps = await org.apps();
	const result = apps.find(obj => {
		return obj.name === 'finance';
	});
	const finance = new Finance.Finance(
		result.address,
		'https://api.thegraph.com/subgraphs/name/0xgabi/superdao-finance-rinkeby',
	);
	const wei = (await finance.balance('0x0000000000000000000000000000000000000000')).balance;
	const web3 = new Web3();
	const eth = web3.utils.fromWei(wei, 'ether');
	console.log(eth);
	return eth;
};
const fetchTx = async () => {
	const org = await connect.connect(
		'0xc2E7B13306a2f2b9dbE4149e6eA4eC30EaCa8e5C',
		'thegraph',
		{ chainId: 4 },
	);
	const apps = await org.apps();
	const result = apps.find(obj => {
		return obj.name === 'finance';
	});
	const finance = new Finance.Finance(
		result.address,
		'https://api.thegraph.com/subgraphs/name/0xgabi/superdao-finance-rinkeby',
	);
	console.log(await finance.transactions());
	const txlist = await finance.transactions();
	const web3 = new Web3();
	for (let i = 0; i < txlist.length; i++) {
		txlist[i].amount = web3.utils.fromWei(txlist[i].amount, 'ether');
	}
	console.log(txlist);
	return txlist;
};
const txSocket = async () => {
	let status = false;
	const org = await connect.connect(
		'0xc2E7B13306a2f2b9dbE4149e6eA4eC30EaCa8e5C',
		'thegraph',
		{ chainId: 4 },
	);
	const apps = await org.apps();
	const result = apps.find(obj => {
		return obj.name === 'finance';
	});
	const finance = new Finance.Finance(
		result.address,
		'https://api.thegraph.com/subgraphs/name/0xgabi/superdao-finance-rinkeby',
	);
	await finance.onTransactions((txlist)=>{
		if (!status) {
			status = true;
			return;
		}
		processTx(txlist);
	});

};
const processTx = (txlist) => {

	const web3 = new Web3();
	txlist[txlist.length - 1].amount = web3.utils.fromWei(txlist[txlist.length - 1].amount, 'ether');
	console.log(txlist[txlist.length - 1]);
	return txlist[txlist.length - 1];
};
fetchVotes();
