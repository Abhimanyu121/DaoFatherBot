const firebaseUtil = require('../../Common/firebase');
const connectUtil = require('../../Common/connector');
module.exports = {
	name: 'balance',
	description: 'Show the token from the aragon for the DAO!',
	args: false,
	usage: '',
	cooldown: 10,
	// eslint-disable-next-line no-unused-vars
	async execute(message, _args) {
		const id = message.guild.id;
		const doc = await firebaseUtil.getDaoById(id);
		const address = doc.get('org');
		const bal = await connectUtil.fetchBalance(address);
		console.log(bal);
		const exampleEmbed = {
			color: 0x0099ff,
			title: 'Balance',
			thumbnail: {
				url: 'https://cdn.freebiesupply.com/logos/large/2x/aragon-icon-logo-png-transparent.png',
			},
			fields: [
				{
					name: 'Amount',
					value: `${bal}`,
				},
			],
			timestamp: new Date(),
		};

		message.channel.send({ embed: exampleEmbed });
	},
};