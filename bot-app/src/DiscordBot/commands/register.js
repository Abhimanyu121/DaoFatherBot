const firebaseUtil = require('../../Common/firebase');
const connectUtil = require('../../Common/connector');
const utils = require('../../Common/utils');
const moment = require('moment');
const votesSocket = {};
let instance;
const sendProposal = async (proposal, id) =>{
	const link = await utils.getProposalLink(
		id,
		parseInt(proposal.id.split('-')[1].split(':')[1]),
		proposal.id.split('-')[0].split(':')[1],
	);
	const prop =
	`*Proposal:* ${proposal.metadata} Started at ${moment.unix(proposal.startDate).format('YYYY-MM-DD HH:mm')}\n[Click here to go to the proposal](${link})`;
	instance.channel.send(prop, { split: true });
};
const sendTx = async (tx, id) => {
	if(tx.isIncoming) {
		const prop =
		`New Transaction Recived:\nAmount:- ${tx.amount} ETH`;
		instance.channel.send(prop, { split: true });	}
	else{
		const prop =
		`New Transaction Sent:\nAmount:- ${tx.amount} ETH`;
		instance.channel.send(prop, { split: true });
	}

	console.log(id);
	// console.log(vote);
};
module.exports = {
	name: 'register',
	description: 'Register DAO with Aragon!',
	args: true,
	usage: '<DAO Name> <DAO Aragon Address>',
	cooldown: 5,
	async execute(message, args) {
		instance = message;
		const id = message.guild.id;
		console.log(id, args);
		const doc = await firebaseUtil.getDaoById(id);
		let reply = '';
		if (doc.exists) {
			if (votesSocket[id] === undefined) {
				const address = doc.get('org');
				votesSocket[id] = {};
				votesSocket[id].status = true;
				console.log(address);
				connectUtil.votesSocket(address, sendProposal, id);
				connectUtil.txSocket(address, sendTx, id);

			}
			reply = 'You have already registered your DAO in this group';
		}
		else {
			const name = args[0];
			const address = args[1];
			// console.log(arr);
			if (address && name) {
				firebaseUtil.setDaoById(id, {
					org: address,
					name: name,
				});
				votesSocket[id].status = true;

				connectUtil.votesSocket(address, sendProposal, id);
				connectUtil.txSocket(address, sendTx, id);


				reply = 'DAO Registered Successfully';
			}
			else if(!address) {
				reply = 'Invalid address! Please enter a valid address';
			} else if(!name) {
				reply = 'Invalid name! Please enter a valid name';
			}
		}
		message.channel.send(reply, { split: true });
	},
};
