const TeleBot = require('telebot');
const Connect = require('./connector')
const admin = require('firebase-admin');
var serviceAccount = require("./sconfig.json");
// import "firebase/firestore";
const ethAddressVerify = require('util')
// import * as admin from 'firebase-admin';
const bot = new TeleBot({
  token: "1044656290:AAE7msbGCW2SaVxz88EXBkuyx2GxnjKwqAw",
  usePlugins: ["askUser"],
});
// On start command
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://daobot-aa447.firebaseio.com"
  });
bot.on("/start", async (msg) => {
  console.log(msg);
  const id = msg.chat.id;
  console.log(id)
  const db = admin.firestore();
  const doc = await db.collection('daos').doc(id.toString()).get();
  if (doc.exists) {
    return bot.sendMessage(id, "You have already registered your DAO in this group.\nUse /menu to see options.");
  } else {
    return bot.sendMessage(id, "Send\n\/register org_address orgname\nExample:\n\/register 0xc2E7B13306a2f2b9dbE4149e6eA4eC30EaCa8e5C SuperDAO");
  }


});

bot.on("/register", async (msg) => {
  console.log(msg);
  const id = msg.chat.id;
  
  const db = admin.firestore();
  const doc = await db.collection('daos').doc(id.toString()).get();
  if (doc.exists) {
    return bot.sendMessage(id, "You have already registered your DAO in this group");
  } else {
    var text = msg.text.trim()
    var arr = text.split(" ");
    var address = arr[1]
    var name = arr[2]
    console.log(arr)
    if(true&& name !== undefined){
       
      db.collection('daos').doc(id.toString()).set({
        org: address,
        name: name
      })
      return bot.sendMessage(id, "Registered Successfully");

    }else {
      return bot.sendMessage(id, "Invalid address or name");

    }
  }


});
bot.on("/menu", async (msg) => {
    console.log(msg);
    const id = msg.chat.id;
   
    let replyMarkup = bot.keyboard([
        ['/proposals','/token'],
        ['/hide']
    ], {resize: true});
    return bot.sendMessage(id, "Proposals:- /proposals\nToken Info:- /tokens", {replyMarkup})
  
  
  });
bot.on('/hide', msg => {
    return bot.sendMessage(
        msg.chat.id, 'Use /menu to see menu again.', {replyMarkup: 'hide'}
    );
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
bot.start()
function menu (id){
    return bot.sendMessage(id, "Adasd")
}
bot.on('callbackQuery', msg => {
    // User message alert
    return bot.answerCallbackQuery(msg.id, `Inline button callback: ${ msg.data }`, true);
});
