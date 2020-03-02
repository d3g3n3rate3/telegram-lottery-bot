const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const groups = config.groups;

let meccaGroup = groups[0];

let hours = 15;
let entered = [];
let lottoRunning = true;

let prize = "100 TELEGRAM GROUP MEMBERS";
let sponsor = "@kirkins - Contact for instagram followers, telegram members, and custom bots!";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(config.telegramKey, {polling: true});

bot.onText(/\/lottery/, (msg, match) => {
  bot.deleteMessage(meccaGroup, msg.message_id);
  if(!entered.includes(msg.from.username) && msg.from.username && groups.includes(msg.chat.id)) {
    entered.push(msg.from.username);
    let response;
    if(lottoRunning) {
      response = "@" + msg.from.username + " has been entered into the lottery.";
    } else {
      response = "No lotto is running now, check back soon!";
    }
    bot.sendMessage(msg.chat.id, response);
  }
  console.log(entered);
});


bot.on('message', (msg) => {
  console.dir(msg);
  const chatId = msg.chat.id;
});

function lottery() {
  hours = hours - 3;
  console.log(hours);
  if(hours == 0) {
    groups.forEach(function(groupId) {
      entered = Array.from(new Set(entered));
      let winner = entered[Math.floor(Math.random() * entered.length)];
      let lottery = "🏆🎉🎖 The winner is @" + winner + ". Message @kirkins to collect your prize 🏆🎉🎖";
      bot.sendMessage(groupId, lottery);
      entered = [];
      lottoRunning = false;
    });
    clearInterval(lotteryLoop);
  } else {
    console.log(hours);
    groups.forEach(function(groupId) {
      let lottery = "🎲🎉🎊  There are " + hours + " hours left before the lottery draw. 🎲🎉🎊\n\n";
      lottery += "Prize: " + prize + ".\n\n";
  lottery += "Sponsor: " + sponsor + "\n\n";
  lottery += "Run command /lottery to be entered into the draw.\n\nInterested in sponsoring a lottery or getting a custom bot for your group? Contract @kirkins to find out more.";
      bot.sendMessage(groupId, lottery);
    });
  }
}

groups.forEach(function(groupId) {
  let lottery = "🎲🎉🎊  Lottery bot starts now. Winner gets " + prize + ". 🎲🎉🎊\n\n";
  lottery += "Prize: " + prize + ".\n\n";
  lottery += "Length: " + hours + " hours\n\n";
  lottery += "Sponsor: " + sponsor + "\n\n";
  lottery += "Run command /lottery to be entered into the draw.\n\nInterested in sponsoring a lottery or getting a custom bot for your group? Contract @kirkins to find out more.";
  bot.sendMessage(groupId, lottery);
});

var lotteryLoop = setInterval(lottery, 1000 * 60 * 60 * 3);
