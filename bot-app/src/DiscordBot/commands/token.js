const firebaseUtil = require('../../Common/firebase');
const connectUtil = require('../../Common/connector');
const utils = require('../../Common/utils');
module.exports = {
	name: 'token',
	description: 'Show the token from the aragon for the DAO!',
	args: false,
	usage: '',
	cooldown: 10,
	// eslint-disable-next-line no-unused-vars
	async execute(message, _args) {
		const id = message.guild.id;
		const doc = await firebaseUtil.getDaoById(id);
		const address = doc.get('org');
		const token = await connectUtil.fetchTokenHolders(address);
		const tokenLink = await utils.getTokenLink(token.name, token.appAddress);
		console.log(token, tokenLink);
		const exampleEmbed = {
			color: 0x0099ff,
			title: 'Token Details',
			url: tokenLink,
			thumbnail: {
				url: 'https://cdn.freebiesupply.com/logos/large/2x/aragon-icon-logo-png-transparent.png',
			},
			fields: [
				{
					name: 'Token Name',
					value: `${token.name} - ${token.symbol}`,
				},
				{
					name: 'Token Address',
					value: `${token.address}`,
				},
				{
					name: 'Number of holders',
					value: `${token.totalSupply}`,
				},
				{
					name: 'Link to view all the token holders',
					value: `${tokenLink}`,
				},
			],
			timestamp: new Date(),
		};

		message.channel.send({ embed: exampleEmbed });
	},
};
