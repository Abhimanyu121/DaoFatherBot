const TeleBot = require("telebot");
const bot = new TeleBot({
  token: "1044656290:AAE7msbGCW2SaVxz88EXBkuyx2GxnjKwqAw",
  usePlugins: ["askUser"],
});
// On start command
bot.on("/start", (msg) => {
  console.log(msg);
  const id = msg.chat.id;

  // Ask user name
  return bot.sendMessage(id, "What is your name?", { ask: "name" });
});

// Ask name event
bot.on("ask.name", (msg) => {
  const id = msg.chat.id;
  const name = msg.text;

  // Ask user age
  return bot.sendMessage(id, `Nice to meet you, ${name}! How old are you?`, {
    ask: "age",
  });
});

// Ask age event
bot.on("ask.age", (msg) => {
  const id = msg.chat.id;
  const age = Number(msg.text);

  if (!age) {
    // If incorrect age, ask again
    return bot.sendMessage(id, "Incorrect age. Please, try again!", {
      ask: "age",
    });
  } else {
    // Last message (don't ask)
    return bot.sendMessage(id, `You are ${age} years old. Great!`);
  }
});

module.exports = connectTelegram = () => {
  bot.start();
};
