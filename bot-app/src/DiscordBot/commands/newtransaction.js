const firebaseUtil = require('../../Common/firebase');
const utils = require('../../Common/utils');
const connectUtil = require('../../Common/connector');


module.exports = {
	name: 'newproposal',
	description: 'Create new Transaction.',
	args: false,
	usage: '',
	cooldown: 10,
	// eslint-disable-next-line no-unused-vars
	async execute(message, _args) {
		const id = message.guild.id;
		const doc = await firebaseUtil.getDaoById(id);
		const name = doc.get('name');
		const org_addr = doc.get('org');
		const address = await connectUtil.orgAddressFinance(org_addr);
		const link = await utils.txLink(name, address);
		const text = `*You can create new transaction here:*\n ${link}`;

		message.channel.send(text, { split: true });
	},
};