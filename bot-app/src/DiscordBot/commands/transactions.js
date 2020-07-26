const firebaseUtil = require('../../Common/firebase');
const connectUtil = require('../../Common/connector');
const utils = require('../../Common/utils');
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
		const reply = `*Transaction:*\n${txText}\n*All Transactions:* ${link}`;

		message.channel.send(reply, { split: true });
	},
};
