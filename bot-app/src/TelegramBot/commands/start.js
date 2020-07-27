const firebaseUtil = require('../../Common/firebase');

module.exports = {
	name: 'start',
	description: 'Start DAO!',
	prefixRequired: true,
	args: false,
	usage: '',
	execute: (bot) => {
		return async (msg) => {
			// console.log(msg);
			const id = msg.chat.id;
			// console.log(id);
			const doc = await firebaseUtil.getDaoById(id);
			if (doc.exists) {
				return bot.sendMessage(
					id,
					'You have already registered your DAO in this group.\nUse /menu to see options.',
				);
			}
			else {
				return bot.sendMessage(
					id,
					'Send\n/register <DAO Name> <DAO Aragon Address>\nExample:\n/register SuperDAO 0xc2E7B13306a2f2b9dbE4149e6eA4eC30EaCa8e5C\nIf you want to make a new DAO head over to https://rinkeby.aragon.org/#/',
				);
			}
		};
	},
};