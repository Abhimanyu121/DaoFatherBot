const firebaseUtil = require('../../Common/firebase');
const utils = require('../../Common/utils');

module.exports = {
	name: 'dao',
	description: 'Shows balance of DAO!',
	prefixRequired: false,
	args: false,
	usage: '',
	execute: (bot) => {
		return async (msg) => {
			const chatId = msg.chat.id;
			const doc = await firebaseUtil.getDaoById(chatId);
			const name = doc.get('name');
			const link = utils.daoLink(name);
			return bot.sendMessage(
				chatId,
				`*You can access DAO here:*\n ${link}`,
				{
					replyMarkup: 'hide',
					parseMode: 'Markdown',
				},
			);
		};
	},
};