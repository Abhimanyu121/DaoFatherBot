import TeleBot from "telebot";
import { fetchVotes } from "./connector";

const bot = new TeleBot({
  token: "1044656290:AAE7msbGCW2SaVxz88EXBkuyx2GxnjKwqAw",
  usePlugins: ["askUser"],
});
// On start command
bot.on("/start", async (msg) => {
  console.log(msg);
  const id = msg.chat.id;

  const votes = await fetchVotes();
  console.log(votes);
  // Ask user name
  return bot.sendMessage(id, votes[0]);
});

// Ask name event
bot.on("ask.name", (msg) => {
  const id = msg.chat.id;
  const name = msg.text;

  // Ask user age
  return bot.sendMessage(id, `Nice to meet you, ${name}! How old are you?`);
});

// Ask age event
bot.on("ask.age", (msg) => {
  const id = msg.chat.id;
  const age = Number(msg.text);

  if (!age) {
    // If incorrect age, ask again
    return bot.sendMessage(id, "Incorrect age. Please, try again!");
  } else {
    // Last message (don't ask)
    return bot.sendMessage(id, `You are ${age} years old. Great!`);
  }
});

export default () => {
  bot.start();
};
