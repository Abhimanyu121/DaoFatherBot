const TeleBot = require("telebot");
const connect = require("./connector");
const admin = require("firebase-admin");
const serviceAccount = require("../firebase-config.json");
// import "firebase/firestore";
const ethAddressVerify = require("util");
const moment = require("moment");

// import * as admin from 'firebase-admin';
const bot = new TeleBot({
  token: "1044656290:AAE7msbGCW2SaVxz88EXBkuyx2GxnjKwqAw",
  usePlugins: ["askUser"],
});

// On start command
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://daobot-aa447.firebaseio.com",
});

bot.on("/start", async (msg) => {
  // console.log(msg);
  const id = msg.chat.id;
  // console.log(id);
  const db = admin.firestore();
  const doc = await db.collection("daos").doc(id.toString()).get();
  if (doc.exists) {
    return bot.sendMessage(
      id,
      "You have already registered your DAO in this group.\nUse /menu to see options."
    );
  } else {
    return bot.sendMessage(
      id,
      "Send\n/register org_address orgname\nExample:\n/register 0xc2E7B13306a2f2b9dbE4149e6eA4eC30EaCa8e5C SuperDAO"
    );
  }
});

bot.on("/register", async (msg) => {
  // console.log(msg);
  const id = msg.chat.id;

  const db = admin.firestore();
  const doc = await db.collection("daos").doc(id.toString()).get();
  if (doc.exists) {
    return bot.sendMessage(
      id,
      "You have already registered your DAO in this group"
    );
  } else {
    var text = msg.text.trim();
    var arr = text.split(" ");
    var address = arr[1];
    var name = arr[2];
    // console.log(arr);
    if (true && name !== undefined) {
      db.collection("daos").doc(id.toString()).set({
        org: address,
        name: name,
      });
      return bot.sendMessage(id, "Registered Successfully");
    } else {
      return bot.sendMessage(id, "Invalid address or name");
    }
  }
});

bot.on("/menu", async (msg) => {
  // console.log(msg);
  const id = msg.chat.id;

  let replyMarkup = bot.keyboard([["/proposals", "/token"], ["/hide"]], {
    resize: true,
  });

  return bot.sendMessage(id, "Proposals:- /proposals\nToken Info:- /tokens", {
    replyMarkup,
  });
});

bot.on("/proposals", async (msg) => {
  const proposals = await connect.fetchVotes();
  console.log(proposals);
  const completesProposalText = proposals
    .filter((p) => p.executed)
    .map(
      (p, i) =>
        "*Proposal " +
        (i + 1) +
        ":* " +
        p.metadata +
        " Started at " +
        moment.unix(p.startDate).format("YYYY-MM-DD HH:mm")
    )
    .join("\n");
  const ongoingProposalText = proposals
    .filter((p) => !p.executed)
    .map(
      (p, i) =>
        "*Proposal " +
        (i + 1) +
        ":* " +
        p.metadata +
        " Started at " +
        moment.unix(p.startDate).format("YYYY-MM-DD HH:mm")
    )
    .join("\n");
  return bot.sendMessage(
    msg.chat.id,
    `*Ongoing Proposals:*\n\n${ongoingProposalText}\n\n*Completed Proposals:*\n\n${completesProposalText}\n\nUse /menu to see menu again.`,
    {
      replyMarkup: "hide",
      parseMode: "Markdown",
    }
  );
});

bot.on("/token", async (msg) => {
  const tokens = await connect.fetchTokenHolders();
  console.log(tokens);
  return bot.sendMessage(msg.chat.id, "Use /menu to see menu again.", {
    replyMarkup: "hide",
  });
});

bot.on("/hide", (msg) => {
  return bot.sendMessage(msg.chat.id, "Use /menu to see menu again.", {
    replyMarkup: "hide",
  });
});

bot.on("callbackQuery", (msg) => {
  // User message alert
  return bot.answerCallbackQuery(
    msg.id,
    `Inline button callback: ${msg.data}`,
    true
  );
});

module.exports = connectTelegram = () => {
  bot.start();
};
