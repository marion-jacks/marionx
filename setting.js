  //project_name : MarionX
// @author : JACKS
// @github : jacks-marion
// @whatsapp : +254796087764
//*
//* 
//=================================================//
const fs = require('fs')
const { color } = require('./lib/color')
if (fs.existsSync('.env')) require('dotenv').config({ path: __dirname+'/.env' })


//=================================================//
global.SESSION_ID = process.env.SESSION_ID || '' 
//Enter your MARION X session id here~

//=================================================//
global.botname = process.env.BOT_NAME || '𝐌𝐀𝐑𝐈𝐎𝐍 𝐗' 
//Your desired bot name

//=================================================//
global.ownernumber = process.env.OWNER_NUMBER || '254796087764' 
//Type your main number here

//=================================================//
global.sudo = process.env.SUDO ? process.env.SUDO.split(',') : ['254796087764'];
// Type additional allowed users here
//NB: They'll be able to use every functions of the bot without restrictions.

//=================================================//
global.ownername = process.env.OWNER_NAME || 'Tylor' 
//Type your name here

//=================================================//
global.plink = process.env.PLINK || "https://www.instagram.com/heyits_tylor?igsh=YzljYTk1ODg3Zg=="

//=================================================//
global.wm = process.env.GL_WM || "©𝐌𝐀𝐑𝐈𝐎𝐍 𝐗"

//=================================================//
global.packname = process.env.STICKER_PACK_NAME || "𝐌𝐀𝐑𝐈𝐎𝐍" 
//The sticker pack name

//=================================================//
global.author = process.env.STICKER_AUTHOR_NAME || "X" 
//The sticker author name

//=================================================//
global.prefixz = process.env.BOT_PREFIX || '.'
//Set your desired prefix

//=================================================//
global.mode = process.env.MODE || 'public';
// Set 'private' to enable private mode
// Set 'public' to enable public mode
// Set 'group' to enable only group
// Set 'pm' to enable only private chats

//=================================================//
global.statusemoji = process.env.STATUS_EMOJI || '🧡'
//Enter the emoji that you wish to be reacted to statuses 

//=================================================//
global.autoviewstatus = process.env.AUTO_STATUS_VIEW || 'true'
// set true to enable and false to disable auto status view

//=================================================//
global.autoreactstatus = process.env.AUTO_STATUS_REACT || 'false'
// set true to enable and false to disable auto status react

//=================================================//
global.alwaysonline = process.env.ALWAYS_ONLINE || 'true'
//Set true to make the bot online 24/7 or set false to disable always online


//=================================================//
global.chatbot = process.env.CHATBOT || 'false'
// set true to enable and false to disable auto ai chatbot

//=================================================//
global.antidelete = process.env.ANTIDELETE || 'private'
// options:- 'private', 'chat' or 'off'
// private = Sends to message yourself 
// chat = sends to the current chat 
// off = Disables detection of deleted messages

//=================================================//
global.antiedit = process.env.ANTI_EDIT || 'private'
// options:- 'private', 'chat' or 'off'
// private = Sends to message yourself 
// chat = sends to the current chat 
// off = Disables detection of edited messages

//=================================================//
global.anticall = process.env.ANTI_CALL || 'false'
// set true to enable and false to disable auto blocking of callers

//=================================================//
global.welcome = process.env.WELCOME_MSG || 'false'
// set true to enable and false to disable welcoming and left messages to groups upon joining or leaving groups

//=================================================//
global.timezones = process.env.TIMEZONE || "Africa/Nairobi" 
//Don't edit this if you don't know!

//=================================================//
global.autoread = process.env.AUTO_READ || 'false';
// Set to 'true' to enable automatic reading of messages

//=================================================//
global.menustyle = process.env.MENU_STYLE || '2' 
// options 1, 2, 3, 4 or 5
// 1 = Document menu(Android only)
// 2 = Text only menu(Android & iOS)
//3 = Image menu with context(Android & iOS)
//4 = Image menu(Android & iOS)
//5 = Payment menu

//=================================================//
//Replies
global.mess = { 
  done: '*Done*', 
  success: '©𝐌𝐀𝐑𝐈𝐎𝐍 𝐗', 
  owner: `*You don't have permission to use this command!*`, 
  group: '*This feature becomes available when you use it in a group!*', 
  admin: '*You’ll unlock this feature with me as an admin!*', 
  notadmin: '*This feature will work once you become an admin. A way of ensuring order!*' 
}
//=================================================//

//=================================================//
let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(color(`Updated '${__filename}'`, 'red'))
  delete require.cache[file]
  require(file)
})
//=================================================//
