const TeleBot = require('telebot');
const { token, prefix, plugin } = require('./config.json');
const fs = require('fs');


const bot = new TeleBot({
	token,
	usePlugins: plugin,
});

// On start command
const commandFiles = fs.readdirSync(__dirname + '/commands/').filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
	const command = require(`./commands/${file}`);
	bot.on(`${command.prefixRequired ? prefix : ''}${command.name}`, command.execute(bot));
}

// bot.on('callbackQuery', (msg) => {

// });

module.exports = () => {
	bot.start();
};
