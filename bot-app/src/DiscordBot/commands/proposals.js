const firebaseUtil = require('../../Common/firebase');
const connectUtil = require('../../Common/connector');
const utils = require('../../Common/utils');
const moment = require('moment');
module.exports = {
	name: 'proposals',
	description: 'Show all the proposals from the aragon for the DAO!',
	args: false,
	usage: '',
	cooldown: 10,
	// eslint-disable-next-line no-unused-vars
	async execute(message, _args) {
		const id = message.guild.id;
		const doc = await firebaseUtil.getDaoById(id);
		const address = doc.get('org');
		const name = doc.get('name');
		const orgAddr = await connectUtil.orgAddressVoting(address);
		const link = await utils.txLink(name, orgAddr);
		const proposals = await connectUtil.fetchVotes(address);
		console.log(proposals);
		let completesProposalText = await Promise.all(
			proposals
				.filter((p) => p.executed)
				.sort((a, b) => moment.utc(Number.parseInt(b.startDate)).diff(moment.utc(Number.parseInt(a.startDate))))
				.splice(0, 5)
				.map(async (p, i) => {
					return utils
						.getProposalLink(
							id,
							parseInt(p.id.split('-')[1].split(':')[1]),
							p.id.split('-')[0].split(':')[1],
						)
						.then((genLink) => {
							return (
								'\t\t**Proposal ' + (i + 1) + ':** ' + p.metadata +
								'\n\t\t**Started at:** `' + moment.unix(p.startDate).format('YYYY-MM-DD HH:mm') + '`' +
								'\n\t\t**Votes till now:** ' + `${p.yea} Yes & ${p.nay} No` +
								'\n\t\t**Link to view:** ' + genLink
							);
						});
				}),
		);
		completesProposalText = completesProposalText.join('\n\n');

		let rejectedProposalText = await Promise.all(
			proposals
				.filter((p) => !p.executed)
				.sort((a, b) => moment.utc(Number.parseInt(b.startDate)).diff(moment.utc(Number.parseInt(a.startDate))))
				.splice(0, 5)
				.map(async (p, i) => {
					return utils
						.getProposalLink(
							id,
							parseInt(p.id.split('-')[1].split(':')[1]),
							p.id.split('-')[0].split(':')[1],
						)
						.then((genLink) => {
							return (
								'\t\t**Proposal ' + (i + 1) + ':** ' + p.metadata +
								'\n\t\t**Started at:** `' + moment.unix(p.startDate).format('YYYY-MM-DD HH:mm') + '`' +
								'\n\t\t**Votes till now:** ' + `${p.yea} Yes & ${p.nay} No` +
								'\n\t\t**Link to view:** ' + genLink
							);
						});
				}),
		);
		rejectedProposalText = rejectedProposalText.join('\n\n');

		const reply = `*Completed Proposals:*\n\n${completesProposalText}\n\n*Rejected Proposals:*\n\n${rejectedProposalText}\n\n*Link to all the proposals:*\n\n${link}`;
		message.channel.send(reply, { split: true });
	},
};
