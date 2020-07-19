"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telebot_1 = __importDefault(require("telebot"));
// import { fetchVotes } from "./connector";
const firebase = __importStar(require("firebase/app"));
const credentials = __importStar(require("./config.json"));
require("firebase/firestore");
const utils_1 = require("./utils");
const admin = __importStar(require("firebase-admin"));
const bot = new telebot_1.default({
    token: "1044656290:AAE7msbGCW2SaVxz88EXBkuyx2GxnjKwqAw",
    usePlugins: ["askUser"],
});
// On start command
bot.on("/start", (msg) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(msg);
    const id = msg.chat.id;
    firebase.initializeApp(credentials);
    admin.initializeApp({
        credential: credentials
    });
    const db = admin.firestore();
    const doc = yield db.collection('daos').doc(id).get();
    if (!doc.exists) {
        return bot.sendMessage(id, "You have already registered your DAO in this group");
    }
    else {
        return bot.sendMessage(id, "Send\n\/register org_address\nExample:\n\/register 0xc2E7B13306a2f2b9dbE4149e6eA4eC30EaCa8e5C");
    }
}));
bot.on("/register", (msg) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(msg);
    const id = msg.chat.id;
    admin.initializeApp({
        credential: credentials
    });
    const db = admin.firestore();
    const doc = yield db.collection('daos').doc(id).get();
    if (!doc.exists) {
        return bot.sendMessage(id, "You have already registered your DAO in this group");
    }
    else {
        if (utils_1.ethAddressVerify(msg.text)) {
            db.collection('daos').doc(id).set({
                org: msg.text
            });
        }
        else {
            return bot.sendMessage(id, "Invalid address");
        }
    }
}));
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
    }
    else {
        // Last message (don't ask)
        return bot.sendMessage(id, `You are ${age} years old. Great!`);
    }
});
exports.default = () => {
    bot.start();
};
//# sourceMappingURL=index.js.map