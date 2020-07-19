import TeleBot from "telebot";
// import { fetchVotes } from "./connector";
import * as firebase from "firebase/app";
import * as credentials from './config.json';
import "firebase/firestore";
import {ethAddressVerify} from './utils'
import * as admin from 'firebase-admin';
const bot = new TeleBot({
  token: "1044656290:AAE7msbGCW2SaVxz88EXBkuyx2GxnjKwqAw",
  usePlugins: ["askUser"],
});
// On start command
bot.on("/start", async (msg) => {
  console.log(msg);
  const id = msg.chat.id;
  firebase.initializeApp(credentials);
  admin.initializeApp({
    credential: credentials
  })
  const db = admin.firestore();
  const doc = await db.collection('daos').doc(id).get();
  if (!doc.exists) {
    return bot.sendMessage(id, "You have already registered your DAO in this group");
  } else {
    return bot.sendMessage(id, "Send\n\/register org_address\nExample:\n\/register 0xc2E7B13306a2f2b9dbE4149e6eA4eC30EaCa8e5C");
  }


});

bot.on("/register", async (msg) => {
  console.log(msg);
  const id = msg.chat.id;
  admin.initializeApp({
    credential: credentials
  })
  const db = admin.firestore();
  const doc = await db.collection('daos').doc(id).get();
  if (!doc.exists) {
    return bot.sendMessage(id, "You have already registered your DAO in this group");
  } else {
    if(ethAddressVerify(msg.text)){
      db.collection('daos').doc(id).set({
        org: msg.text
      })
    }else {
      return bot.sendMessage(id, "Invalid address");

    }
  }


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
