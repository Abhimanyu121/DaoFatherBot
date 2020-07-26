const firebaseUtil = require('../../Common/firebase');
const connectUtil = require('../../Common/connector');
const utils = require('../../Common/utils');
const moment = require('moment');

module.exports = {
	name: 'transactions',
	description: 'Shows all the transactions to and from DAO.',
	prefixRequired: true,
	args: false,
	usage: '',
	execute: (bot) => {
		return async (msg) => {
			const chatId = msg.chat.id;
			const doc = await firebaseUtil.getDaoById(chatId);
			const address = doc.get('org');
			const name = doc.get('name');
			const orgAddr = await connectUtil.orgAddressFinance(address);
			const link = await utils.txLink(name, orgAddr);
			const txList = await connectUtil.fetchTx(address);
			console.log(txList);
			let txText = txList
				.sort((a, b) => moment.utc(Number.parseInt(b.date)).diff(moment.utc(Number.parseInt(a.date))))
				.splice(0, 10)
				.map((tx, i) => {
					return (
						'\t\t\t\t\t*Transaction ' + (i + 1) + (tx.reference === '' ? '* ' : ':* ') + tx.reference +
						'\n\t\t\t\t\t*Amount:* ' + tx.amount + ' ETH' +
						'\n\t\t\t\t\t*Date:* `' + moment.unix(tx.date).format('YYYY-MM-DD HH:mm') + '`'
					);
				});
			txText = txText.join('\n\n');
			return bot.sendMessage(
				chatId,
				`*Transaction:*\n\n${txText}\n\n*View All Transactions:* [Click here to view all the transactions](${link})\n\nUse /menu to see menu again.`,
				{
					replyMarkup: 'hide',
					parseMode: 'Markdown',
				},
			);
		};
	},
};
