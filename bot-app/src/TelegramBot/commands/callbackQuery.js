module.exports = {
	name: 'callbackQuery',
	description: 'Callback Query!',
	prefixRequired: false,
	args: false,
	usage: '',
	execute: (bot) => {
		return async (msg) => {
			// User message alert
			return bot.answerCallbackQuery(
				msg.id,
				`Inline button callback: ${msg.data}`,
				true,
			);
		};
	},
};