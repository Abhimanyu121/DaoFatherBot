const firebaseUtil = require('../../Common/firebase');
const connectUtil = require('../../Common/connector');
const utils = require('../../Common/utils');
const moment = require('moment');

module.exports = {
	name: 'proposals',
	description: 'Show all the proposals from the aragon for the DAO!',
	prefixRequired: true,
	args: false,
	usage: '',
	execute: (bot) => {
		return async (msg) => {
			const chatId = msg.chat.id;
			const doc = await firebaseUtil.getDaoById(chatId);
			const address = doc.get('org');
			const name = doc.get('name');
			const orgAddr = await connectUtil.orgAddressVoting(address);
			const link = await utils.txLink(name, orgAddr);
			const proposals = await connectUtil.fetchVotes(address);
			let completesProposalText = await Promise.all(
				proposals
					.filter((p) => p.executed)
					.sort((a, b) => moment.utc(Number.parseInt(b.startDate)).diff(moment.utc(Number.parseInt(a.startDate))))
					.splice(0, 5)
					.map(async (p, i) => {
						return utils.getProposalLink(
							msg.chat.id,
							parseInt(p.id.split('-')[1].split(':')[1]),
							p.id.split('-')[0].split(':')[1],
						).then((genLink) => {
							return (
								'\t\t\t\t\t*Proposal ' + (i + 1) + ':* ' + p.metadata +
                                '\n\t\t\t\t\t*Started at:* ' + moment.unix(p.startDate).format('YYYY-MM-DD HH:mm') +
                                '\n\t\t\t\t\t*Votes till now:* ' + `${p.yea} Yes & ${p.nay} No` +
                                '\n\t\t\t\t\t*Link to view:* [Click here to go to the proposal](' + genLink + ')'
							);
						});
					}),
			);
			completesProposalText = completesProposalText.join('\n\n');
			let ongoingProposalText = await Promise.all(
				proposals
					.filter((p) => !p.executed)
					.sort((a, b) => moment.utc(Number.parseInt(b.startDate)).diff(moment.utc(Number.parseInt(a.startDate))))
					.splice(0, 5)
					.map(async (p, i) => {
						return utils.getProposalLink(
							msg.chat.id,
							parseInt(p.id.split('-')[1].split(':')[1]),
							p.id.split('-')[0].split(':')[1],
						).then((genLink) => {
							return (
								'\t\t\t\t\t*Proposal ' + (i + 1) + ':* ' + p.metadata +
                                '\n\t\t\t\t\t*Started at:* ' + moment.unix(p.startDate).format('YYYY-MM-DD HH:mm') +
                                '\n\t\t\t\t\t*Votes till now:* ' + `${p.yea} Yes & ${p.nay} No` +
                                '\n\t\t\t\t\t*Link to view:* [Click here to go to the proposal](' + genLink + ')'
							);
						});
					}),
			);
			ongoingProposalText = ongoingProposalText.join('\n\n');

			return bot.sendMessage(
				chatId,
				`*Completed Proposals:*\n\n${completesProposalText}\n\n*Rejected Proposals:*\n\n${ongoingProposalText}\n\n*Link to all the proposals:*${link}\nUse /menu to see menu again.`,
				{
					replyMarkup: 'hide',
					parseMode: 'Markdown',
				},
			);
		};
	},
};