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

			const replyMarkup = bot.keyboard([['/proposals', '/token'], ['/balance', '/transactions'], ['/newproposal', '/newtransaction'], ['/dao', '/hide']], {
				resize: true,
			});

			return bot.sendMessage(id, 'Proposals:- /proposals\nToken Info:- /token\nDAO Balance:- /balance\nTransactions List:- /transactions\nLink to DAO:- /dao\nCreate new proposal:-  /newproposal\nCreate new transaction :- /newtransaction', {
				replyMarkup,
			});
		};
	},
};