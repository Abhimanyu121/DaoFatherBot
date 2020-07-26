const firebaseUtil = require('../../Common/firebase');
const connectUtil = require('../../Common/connector');
const utils = require('../../Common/utils');
const moment = require('moment');

const votesSocket = {};
let currentBot = null;
const sendProposal = async (proposal, id) => {
	const link = await utils.getProposalLink(
		id,
		parseInt(proposal.id.split('-')[1].split(':')[1]),
		proposal.id.split('-')[0].split(':')[1],
	);
	const prop =
    `*Proposal:* ${proposal.metadata} Started at ${moment.unix(proposal.startDate).format('YYYY-MM-DD HH:mm')}\n[Click here to go to the proposal](${link})`;
	currentBot.sendMessage(id, prop);
	console.log(id);
	// console.log(vote);
};

const sendTx = async (tx, id) => {
	if(tx.isIncoming) {
		const prop =
		`New Transaction Recived:\nAmount:- ${tx.amount} ETH`;
		currentBot.sendMessage(id, prop);
	}
	else{
		const prop =
		`New Transaction Sent:\nAmount:- ${tx.amount} ETH`;
		currentBot.sendMessage(id, prop);
	}

	console.log(id);
	// console.log(vote);
};
module.exports = {
	name: 'register',
	description: 'Register DAO with Aragon!',
	prefixRequired: true,
	args: true,
	usage: '<DAO Name> <DAO Aragon Address>',
	execute: (bot) => {
		currentBot = bot;
		return async (msg) => {
			// console.log(msg);
			const id = msg.chat.id;

			const doc = await firebaseUtil.getDaoById(id);
			if (doc.exists) {
				if (votesSocket[id] === undefined) {
					const address = doc.get('org');
					votesSocket[id] = {};
					votesSocket[id].status = true;
					console.log(address);
					connectUtil.votesSocket(address, sendProposal, id);
					connectUtil.txSocket(address, sendTx, id);
				}
				return bot.sendMessage(
					id,
					'You have already registered your DAO in this group',
				);
			}
			else {
				const text = msg.text.trim();
				const arr = text.split(' ');
				const name = arr[1];
				const address = arr[2];
				// console.log(arr);
				if (address && name) {
					firebaseUtil.setDaoById(id, {
						org: address,
						name: name,
					});
					votesSocket[id].status = true;

					connectUtil.votesSocket(address, sendProposal, id);
					connectUtil.txSocket(address, sendTx, id);

					return bot.sendMessage(id, 'Registered Successfully');
				}
				else {
					return bot.sendMessage(id, 'Invalid address or name');
				}
			}
		};
	},
};
