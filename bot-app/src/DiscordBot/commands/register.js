const firebaseUtil = require('../../Common/firebase');
// const connectUtil = require('../../Common/connector');
// const votesSocket = {};

module.exports = {
	name: 'register',
	description: 'register DAO with Aragon!',
	args: true,
	usage: '<DAO Name> <DAO Aragon Address>',
	cooldown: 5,
	async execute(message, args) {
		const id = message.guild.id;
		console.log(id, args);
		const doc = await firebaseUtil.getDaoById(id);
		let reply = '';
		if (doc.exists) {
			// if (votesSocket[id] === undefined) {
			// 	const address = doc.get('org');
			// 	votesSocket[id] = {};
			// 	votesSocket[id].status = true;
			// 	console.log(address);
			// 	connectUtil.votesSocket(address, sendProposal, id);
			// }
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
				// votesSocket[id].status = true;

				// connectUtil.votesSocket(address, sendProposal, id);

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