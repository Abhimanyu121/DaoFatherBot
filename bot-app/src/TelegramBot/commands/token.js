const firebaseUtil = require('../../Common/firebase');
const connectUtil = require('../../Common/connector');
const utils = require('../../Common/utils');

module.exports = {
	name: 'token',
	description: 'Show the token from the aragon for the DAO!',
	prefixRequired: true,
	args: false,
	usage: '',
	execute: (bot) => {
		return async (msg) => {
			const chatId = msg.chat.id;
			const doc = await firebaseUtil.getDaoById(chatId);
			const address = doc.get('org');
			const token = await connectUtil.fetchTokenHolders(address);
			console.log(token);
			const tokenLink = await utils.getTokenLink(token.name, token.appAddress);
			console.log(tokenLink);
			return bot.sendMessage(
				chatId,
				`*Token Details:*\n\n*Token Name:* ${token.name} - ${token.symbol}\n*Token Address:* ${token.address}\n*Number of holders:* ${token.totalSupply}\n\n[Click here to see all the holders](${tokenLink})\n\nUse /menu to see menu again.`,
				{
					replyMarkup: 'hide',
					parseMode: 'Markdown',
				},
			);
		};
	},
};