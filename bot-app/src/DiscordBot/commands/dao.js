const firebaseUtil = require('../../Common/firebase');
const utils = require('../../Common/utils');
module.exports = {
	name: 'dao',
	description: 'Show link to dao',
	args: false,
	usage: '',
	cooldown: 10,
	// eslint-disable-next-line no-unused-vars
	async execute(message, _args) {
		const id = message.guild.id;
		const doc = await firebaseUtil.getDaoById(id);
		const name = doc.get('name');
		const link = utils.daoLink(name);
		const exampleEmbed = {
			color: 0x0099ff,
			title: 'DAO Link',
			thumbnail: {
				url: 'https://cdn.freebiesupply.com/logos/large/2x/aragon-icon-logo-png-transparent.png',
			},
			fields: [
				{
					name: 'Link',
					value: `${link}`,
				},
			],
			timestamp: new Date(),
		};

		message.channel.send({ embed: exampleEmbed });
	},
};