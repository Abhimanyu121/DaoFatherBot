const firebaseUtil = require('./firebase');
const ethAddressVerify = (address) => {
	return /^(0x){1}[0-9a-fA-F]{40}$/i.test(address);
};
const getProposalLink = async (chatId, number, address) => {
	const doc = await firebaseUtil.getDaoById(chatId);
	const name = doc.get('name');
	return (
		'https://rinkeby.aragon.org/#/' + name + '/' + address + '/vote/' + number
	);
};

const getTokenLink = async (chatId, address) => {
	return 'https://rinkeby.aragon.org/#/' + chatId + '/' + address;
};
const txLink = async (name, address) => {
	return 'https://rinkeby.aragon.org/#/' + name + '/' + address;
};
const daoLink = (name) => {
	return 'https://rinkeby.aragon.org/#/' + name + '/';
};
module.exports = {
	ethAddressVerify,
	getProposalLink,
	getTokenLink,
	txLink,
	daoLink,
};
