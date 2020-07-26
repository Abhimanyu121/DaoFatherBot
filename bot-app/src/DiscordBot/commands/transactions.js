const firebaseUtil = require('../../Common/firebase');
const connectUtil = require('../../Common/connector');
const utils = require('../../Common/utils');
const moment = require('moment');

module.exports = {
	name: 'transactions',
	description: 'Shows all the transactions.',
	args: false,
	usage: '',
	cooldown: 10,
	// eslint-disable-next-line no-unused-vars
	async execute(message, _args) {
		const id = message.guild.id;
		const doc = await firebaseUtil.getDaoById(id);
		const address = doc.get('org');
		const name = doc.get('name');
		const orgAddr = await connectUtil.orgAddressFinance(address);
		const link = await utils.txLink(name, orgAddr);
		const txList = await connectUtil.fetchTx(address);
		console.log(txList);
		let txText = txList
			.sort((a, b) => moment.utc(Number.parseInt(b.date)).diff(moment.utc(Number.parseInt(a.date))))
			.splice(0, 10)
			.map((tx, i)=>{
				return (
					'\t\t**Transaction ' + (i + 1) + (tx.reference === '' ? '** ' : ':** ') + tx.reference +
                    '\n\t\t**Amount:** ' + tx.amount + ' ETH' +
                    '\n\t\t**Date:** `' + moment.unix(tx.date).format('YYYY-MM-DD HH:mm') + '`'
				);
			});
		txText = txText.join('\n\n');
		const reply = `*Transaction:*\n\n${txText}\n\n**View All Transactions:** ${link}`;

		message.channel.send(reply, { split: true });
	},
};
