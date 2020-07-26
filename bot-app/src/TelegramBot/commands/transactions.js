const firebaseUtil = require('../../Common/firebase');
const connectUtil = require('../../Common/connector');
const utils = require('../../Common/utils');

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
			const txText = await Promise.all(
				txList
					.map(async (tx, i)=>{
						return (
							'\n*Transaction ' +
                        (i + 1) +
                       (tx.reference == '' ? '' : ':\n* ') +
                        tx.reference +
                        '\n' +
                        '*Amount:*\n' +
                        tx.amount +
                        'ETH'
						);
					}),
			);
			return bot.sendMessage(
				chatId,
				`*Transaction:*\n${txText}\n*All Transactions:* ${link}`,
				{
					replyMarkup: 'hide',
					parseMode: 'Markdown',
				},
			);
		};
	},
};