const firebaseUtil = require('../../Common/firebase');
const connectUtil = require('../../Common/connector');

module.exports = {
	name: 'balance',
	description: 'Shows balance of DAO!',
	prefixRequired: true,
	args: false,
	usage: '',
	execute: (bot) => {
		return async (msg) => {
			const chatId = msg.chat.id;
			const doc = await firebaseUtil.getDaoById(chatId);
			const address = doc.get('org');
			const balance = await connectUtil.fetchBalance(address);
			console.log(balance);
			return bot.sendMessage(
				chatId,
				`*DAO Balance:*\nDAO currently holds ${balance} ETH\n\nUse /menu to see menu again.`,
				{
					replyMarkup: 'hide',
					parseMode: 'Markdown',
				},
			);
		};
	},
};