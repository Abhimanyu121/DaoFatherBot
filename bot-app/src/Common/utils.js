const firebaseUtil = require('./firebase');
const ethAddressVerify = (address) => {
	return /^(0x){1}[0-9a-fA-F]{40}$/i.test(address);
};
const getProposalLink = async (chatId, number, address) => {
	const doc = await firebaseUtil.getDaoById(chatId);
	const name = doc.get('name');
	// console.log(name);
	return (
		'https://rinkeby.aragon.org/#/' + name + '/' + address + '/vote/' + number
	);
};

const getTokenLink = async (chatId, address) => {
	// const db = admin.firestore();
	// const doc = await db.collection("daos").doc(chatid.toString()).get();
	// const name = doc.get("name");
	// console.log(name);
	return 'https://rinkeby.aragon.org/#/' + chatId + '/' + address;
};
const txLink = async (name, address) => {
	// const db = admin.firestore();
	// const doc = await db.collection("daos").doc(chatid.toString()).get();
	// const name = doc.get("name");
	// console.log(name);
	return 'https://rinkeby.aragon.org/#/' + name + '/' + address;
};


module.exports = {
	ethAddressVerify,
	getProposalLink,
	getTokenLink,
	txLink,
};
