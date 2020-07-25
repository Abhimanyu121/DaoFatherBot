module.exports = {
	name: 'hide',
	description: 'Hide the menu!',
	prefixRequired: true,
	args: false,
	usage: '',
	execute: (bot) => {
		return (msg) => {
			return bot.sendMessage(msg.chat.id, 'Use /menu to see menu again.', {
				replyMarkup: 'hide',
			});
		};
	},
};