const firebaseUtil = require('../../Common/firebase');
const connectUtil = require('../../Common/connector');
const utils = require('../../Common/utils');
const moment = require('moment');
const eventsSocket = {};
let msgInstance;

const sendProposal = async (proposal, id) =>{
	const link = await utils.getProposalLink(
		id,
		parseInt(proposal.id.split('-')[1].split(':')[1]),
		proposal.id.split('-')[0].split(':')[1],
	);
	const prop = {
		color: 0x0099ff,
		title: 'New Proposal Generated',
		url: link,
		thumbnail: {
			url: 'https://cdn.freebiesupply.com/logos/large/2x/aragon-icon-logo-png-transparent.png',
		},
		fields: [
			{
				name: 'Proposal',
				value: `${proposal.metadata}`,
			},
			{
				name: 'Started at',
				value: `${moment.unix(proposal.startDate).format('YYYY-MM-DD HH:mm')}`,
			},
			{
				name: 'Link to view the proposal',
				value: `${link}`,
			},
		],
		timestamp: new Date(),
	};
	msgInstance.channel.send({ embed: prop });
};

const sendTx = async (tx, id) => {
	let prop = {};
	if(tx.isIncoming) {
		prop = {
			color: 0x0099ff,
			title: 'New Transaction Received',
			thumbnail: {
				url: 'https://cdn.freebiesupply.com/logos/large/2x/aragon-icon-logo-png-transparent.png',
			},
			fields: [
				{
					name: 'Amount',
					value: `${tx.amount} ETH`,
				},
			],
			timestamp: new Date(),
		};
	}
	else{
		prop = {
			color: 0x0099ff,
			title: 'New Transaction Sent',
			thumbnail: {
				url: 'https://cdn.freebiesupply.com/logos/large/2x/aragon-icon-logo-png-transparent.png',
			},
			fields: [
				{
					name: 'Amount',
					value: `${tx.amount} ETH`,
				},
			],
			timestamp: new Date(),
		};
	}
	msgInstance.channel.send({ embed: prop });
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
		msgInstance = message;
		const id = message.guild.id;
		console.log(id, args);
		const doc = await firebaseUtil.getDaoById(id);
		let reply = '';
		if (doc.exists) {
			if (eventsSocket[id] === undefined) {
				const address = doc.get('org');

				eventsSocket[id] = {};
				eventsSocket[id].status = true;

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

				eventsSocket[id].status = true;

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
