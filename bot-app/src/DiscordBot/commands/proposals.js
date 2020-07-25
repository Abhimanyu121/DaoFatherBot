const firebaseUtil = require('../../Common/firebase');
const connectUtil = require('../../Common/connector');
const utils = require('../../Common/utils');
const moment = require('moment');
module.exports = {
	name: 'proposals',
	description: 'Get all the proposals from the aragon for the DAO!',
	args: false,
	usage: '',
	cooldown: 10,
	// eslint-disable-next-line no-unused-vars
	async execute(message, _args) {
		const id = message.guild.id;
		const doc = await firebaseUtil.getDaoById(id);
		const address = doc.get('org');
		console.log(address);
		const proposals = await connectUtil.fetchVotes(address);
		let completesProposalText = await Promise.all(
			proposals
				.filter((p) => p.executed)
				.map(async (p, i) => {
					return utils
						.getProposalLink(
							id,
							parseInt(p.id.split('-')[1].split(':')[1]),
							p.id.split('-')[0].split(':')[1],
						)
						.then((genLink) => {
							return (
								'\t\t**Proposal ' +
								(i + 1) +
								':** ' +
								p.metadata +
								' Started at `' +
								moment.unix(p.startDate).format('YYYY-MM-DD HH:mm') +
								'`\n\t\t(' +
								genLink +
								')'
							);
						});
				}),
		);
		completesProposalText = completesProposalText.join('\n');
		let ongoingProposalText = await Promise.all(
			proposals
				.filter((p) => !p.executed)
				.map(async (p, i) => {
					return utils
						.getProposalLink(
							id,
							parseInt(p.id.split('-')[1].split(':')[1]),
							p.id.split('-')[0].split(':')[1],
						)
						.then((genLink) => {
							return (
								'\t\t**Proposal ' +
								(i + 1) +
								':** ' +
								p.metadata +
								' Started at `' +
								moment.unix(p.startDate).format('YYYY-MM-DD HH:mm') +
								'`\n\t\t(' +
								genLink +
								')'
							);
						});
				}),
		);
		ongoingProposalText = ongoingProposalText.join('\n');

		const reply = `*Ongoing Proposals:*\n${ongoingProposalText}\n\n*Completed Proposals:*\n${completesProposalText}`;
		message.channel.send(reply, { split: true });
	},
};
