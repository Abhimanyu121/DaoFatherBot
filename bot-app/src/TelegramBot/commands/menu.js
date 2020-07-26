module.exports = {
	name: 'menu',
	description: 'Show Menu!',
	prefixRequired: true,
	args: false,
	usage: '',
	execute: (bot) => {
		return (msg) => {
			// console.log(msg);
			const id = msg.chat.id;

			const replyMarkup = bot.keyboard([['/proposals', '/token', '/balance'], ['/hide']], {
				resize: true,
			});

			return bot.sendMessage(id, 'Proposals:- /proposals\nToken Info:- /tokens\nDAO Balance:- /balance', {
				replyMarkup,
			});
		};
	},
};