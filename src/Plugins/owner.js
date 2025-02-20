const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const https = require('https');
const { sleep } = require('../../lib/myfunc');
const { promisify } = require('util');
const { exec } = require('child_process');
const execAsync = promisify(exec);
const { generateProfilePicture } = require('@whiskeysockets/baileys'); 
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

module.exports = [ 
 {
  command: ['addbadword'],
  operate: async ({ MARION, m, isCreator, mess, prefix, args, q, bad, reply }) => {
    if (!isCreator) return reply(mess.owner);
    if (args.length < 1) return reply(`Use ${prefix}addbadword [harsh word].`);

    if (bad.includes(q)) {
      return reply('This word is already in the list!');
    }
    
    bad.push(q);

    try {
      await fsp.writeFile('./src/badwords.json', JSON.stringify(bad, null, 2));
      reply('Successfully added bad word!');
    } catch (error) {
      console.error('Error writing to badwords.json:', error);
      reply('An error occurred while adding the bad word.');
    }
  }
},
{
  command: ['addignorelist'],
  operate: async ({ m, args, isCreator, loadBlacklist, mess, reply }) => {
    if (!isCreator) return reply(mess.owner);

    let mentionedUser = m.mentionedJid && m.mentionedJid[0];
    let quotedUser = m.quoted && m.quoted.sender;
    let userToAdd = mentionedUser || quotedUser || m.chat;

    if (!userToAdd) return reply('Mention a user, reply to their message, or provide a phone number to ignore.');

    let blacklist = loadBlacklist();
    if (!blacklist.blacklisted_numbers.includes(userToAdd)) {
        blacklist.blacklisted_numbers.push(userToAdd);
        reply(`${userToAdd} added to the ignore list.`);
    } else {
        reply(`${userToAdd} is already ignored.`);
    }
  }
},
  {
  command: ['autobio'],
  operate: async ({ MARION, m, reply, args, prefix, command, isCreator, mess, db, botNumber }) => {
    if (!isCreator) return reply(mess.owner);
    if (args.length < 1) return reply(`Example: ${prefix + command} on/off`);

    const validOptions = ["on", "off"];
    const option = args[0].toLowerCase();

    if (!validOptions.includes(option)) return reply("Invalid option");

    db.data.settings[botNumber].autobio = option === "on";
    reply(`Auto-bio ${option === "on" ? "enabled" : "disabled"} successfully`);
  }
},
 {
  command: ['autoread'],
  operate: async ({ MARION, m, reply, args, prefix, command, isCreator, mess, db, botNumber }) => {
    if (!isCreator) return reply(mess.owner);
    if (args.length < 1) return reply(`Example: ${prefix + command} on/off`);

    const validOptions = ["on", "off"];
    const option = args[0].toLowerCase();

    if (!validOptions.includes(option)) return reply("Invalid option");

    db.data.settings[botNumber].autoread = option === "on";
    reply(`Auto-read ${option === "on" ? "enabled" : "disabled"} successfully`);
  }
},
  {
  command: ['autorecord', 'autorecording'],
  operate: async ({ MARION, m, reply, args, prefix, command, isCreator, mess, db, botNumber }) => {
    if (!isCreator) return reply(mess.owner);
    if (args.length < 1) return reply(`Example: ${prefix + command} on/off`);

    const validOptions = ["on", "off"];
    const option = args[0].toLowerCase();

    if (!validOptions.includes(option)) return reply("Invalid option");
    
    db.data.settings[botNumber].autorecord = option === "on";
    reply(`Auto-record ${option === "on" ? "enabled" : "disabled"} successfully`);
  }
},
  {
  command: ['autotype', 'autotyping'],
  operate: async ({ MARION, m, reply, args, prefix, command, isCreator, mess, db, botNumber }) => {
    if (!isCreator) return reply(mess.owner);
    if (args.length < 1) return reply(`Example: ${prefix + command} on/off`);

    const validOptions = ["on", "off"];
    const option = args[0].toLowerCase();

    if (!validOptions.includes(option)) return reply("Invalid option");
    
    db.data.settings[botNumber].autotype = option === "on";
    reply(`Auto-typing ${option === "on" ? "enabled" : "disabled"} successfully`);
  }
},
 {
  command: ['autorecordtyping', 'autorecordtype'],
  operate: async ({ MARION, m, reply, args, prefix, command, isCreator, mess, db, botNumber }) => {
    if (!isCreator) return reply(mess.owner);
    if (args.length < 1) return reply(`Example: ${prefix + command} on/off`);

    const validOptions = ["on", "off"];
    const option = args[0].toLowerCase();

    if (!validOptions.includes(option)) return reply("Invalid option");
    
    db.data.settings[botNumber].autorecordtype = option === "on";
    reply(`Auto-record typing ${option === "on" ? "enabled" : "disabled"} successfully`);
  }
},
 {
  command: ['block'],
  operate: async ({ MARION, m, reply, isCreator, mess, text }) => {
    if (!isCreator) return reply(mess.owner);
    if (!m.quoted && !m.mentionedJid[0] && !text) return reply("Reply to a message or mention/user ID to block");

    const userId = m.mentionedJid[0] || m.quoted?.sender || text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    await Cypher.updateBlockStatus(userId, "block");
    reply(mess.done);
  }
},
  {
  command: ['deletebadword'],
  operate: async ({ Cypher, m, isCreator, mess, prefix, args, q, bad, reply }) => {
    if (!isCreator) return reply(mess.owner);
    if (args.length < 1) return reply(`Use ${prefix}deletebadword [harsh word].`);

    const index = bad.indexOf(q);
    if (index === -1) {
      return reply('This word is not in the list!');
    }

    bad.splice(index, 1);

    try {
      await fsp.writeFile('./src/badwords.json', JSON.stringify(bad, null, 2));
      reply('Successfully deleted bad word!');
    } catch (error) {
      console.error('Error writing to badwords.json:', error);
      reply('An error occurred while deleting the bad word.');
    }
  }
},
 {
  command: ['delete', 'del'],
  operate: async ({ MARION, m, reply, isCreator, mess }) => {
    if (!isCreator) return reply(mess.owner);
    if (!m.quoted) return reply(`*Please reply to a message*`);

    let key = {};
    try {
      key.remoteJid = m.quoted
          ? m.quoted.fakeObj.key.remoteJid
          : m.key.remoteJid;
      key.fromMe = m.quoted ? m.quoted.fakeObj.key.fromMe : m.key.fromMe;
      key.id = m.quoted ? m.quoted.fakeObj.key.id : m.key.id;
      key.participant = m.quoted
          ? m.quoted.fakeObj.participant
          : m.key.participant;
    } catch (e) {
      console.error(e);
    }
    MARION.sendMessage(m.chat, { delete: key });
  }
},
{
  command: ['delignorelist'],
  operate: async ({ m, args, isCreator, loadBlacklist, mess, reply }) => {
    if (!isCreator) return reply(mess.owner);

    let mentionedUser = m.mentionedJid && m.mentionedJid[0];
    let quotedUser = m.quoted && m.quoted.sender;
    let userToRemove = mentionedUser || quotedUser || m.chat;

    if (!userToRemove) return reply('Mention a user, reply to their message, or provide a phone number to remove from the ignore list.');

    let blacklist = loadBlacklist();
    let index = blacklist.blacklisted_numbers.indexOf(userToRemove);
    if (index !== -1) {
        blacklist.blacklisted_numbers.splice(index, 1);
        reply(`${userToRemove} removed from the ignore list.`);
    } else {
        reply(`${userToRemove} is not in the ignore list.`);
    }
  }
},
 {
  command: ['deljunk', 'deletejunk', 'clearjunk'],
  operate: async (context) => {
    const { MARION, m, reply, isCreator, mess } = context;

    if (!isCreator) return reply(mess.owner);
    fsp.readdir("./session", async function (err, files) {
      if (err) {
        console.log("Unable to scan directory: " + err);
        return reply("Unable to scan directory: " + err);
      }
      let filteredArray = await files.filter(
        (item) =>
          item.startsWith("pre-key") ||
          item.startsWith("sender-key") ||
          item.startsWith("session-") ||
          item.startsWith("app-state")
      );
      console.log(filteredArray.length);
      await sleep(2000);
      reply(`*Clearing ${filteredArray.length} junk files in the session folder...*`);
      await filteredArray.forEach(function (file) {
        fs.unlinkSync(`./session/${file}`);
      });
      await sleep(2000);
      reply("*Successfully cleared all the junk files in the session's folder*");
    });

    const tmpDir = path.resolve("./tmp");
    fsp.readdir(tmpDir, async function (err, files) {
      if (err) {
        console.log("Unable to scan directory: " + err);
        return reply("Unable to scan directory: " + err);
      }
      let junkFiles = files.filter(
        (item) =>
          item.endsWith("gif") ||
          item.endsWith("png") || 
          item.endsWith("mp3") ||
          item.endsWith("mp4") || 
          item.endsWith("opus") || 
          item.endsWith("jpg") ||
          item.endsWith("webp") ||
          item.endsWith("webm") ||
          item.endsWith("zip")
      );
      console.log(junkFiles.length);
      await sleep(2000);
      reply(`*Clearing ${junkFiles.length} junk files in the tmp folder...*`);
      await junkFiles.forEach(function (file) {
        fs.unlinkSync(`${tmpDir}/${file}`);
      });
      await sleep(2000);
      reply("*Successfully cleared all the junk files in the tmp folder*");
    });
  }
}, 
 {
  command: ['disk'],
  operate: async ({ MARION, m, reply, isCreator, mess }) => {
    if (!isCreator) return reply(mess.owner);

    await reply('Please Wait');
    
    let o;
    try {
      o = await execAsync('cd && du -h --max-depth=1');
    } catch (e) {
      o = e;
    } finally {
      let { stdout, stderr } = o;
      if (stdout.trim()) reply(stdout);
      if (stderr.trim()) reply(stderr);
    }
  }
},
 {
  command: ['dlvo', 'vv', 'rvo'],
  operate: async ({ MARION, m, reply, isCreator, mess }) => {
    if (!isCreator) return reply(mess.owner);
    if (!m.quoted) return reply(`*Please reply to a view once message!*`);

    let msg = m.msg?.contextInfo?.quotedMessage
    let type = Object.keys(msg)[0];

    if (!/image|video/.test(type)) return reply(`*Only view once images and videos are supported!*`);

    try {
      let media = await downloadContentFromMessage(msg[type], type === 'imageMessage' ? 'image' : 'video');
      let buffer = Buffer.from([]);
      for await (const chunk of media) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      let filename = type === 'imageMessage' ? 'media.jpg' : 'media.mp4';
      let caption = msg[type]?.caption || global.wm;

      return MARION.sendFile(m.chat, buffer, filename, caption, m);
    } catch (error) {
      console.error(error);
      reply(`*Failed to retrieve media. The message might not be a valid view-once media.*`);
    }
  }
}, 
 {
  command: ['gcaddprivacy'],
  operate: async ({ MARION, m, reply, isCreator, mess, prefix, command, text, args }) => {
    if (!isCreator) return reply(mess.owner);
    if (!text) return reply(`Options: all/contacts/contact_blacklist/none\nExample: ${prefix + command} all`);

    const validOptions = ["all", "contacts", "contact_blacklist"];
    if (!validOptions.includes(args[0])) return reply("*Invalid option!*");

    await MARION.updateGroupsAddPrivacy(text);
    await reply(mess.done);
  }
},
  {
  command: ['getsession'],
  operate: async ({ MARION, m, reply, isCreator, mess }) => {
    if (!isCreator) return reply(mess.owner);
    reply("*Fetching session file...*");

    if (global.SESSION_ID) {
      MARION.sendMessage(
        m.chat,
        {
          text: `${global.SESSION_ID}`,
        },
        {
          quoted: m,
        }
      );
    }

    let botxp = fs.readFileSync("./session/creds.json");
    MARION.sendMessage(
      m.chat,
      {
        document: botxp,
        mimetype: "application/json",
        fileName: "creds.json",
      },
      {
        quoted: m,
      }
    );
  }
},
 {
  command: ['groupid', 'idgc'],
  operate: async ({ MARION, m, reply, isCreator, mess, args, q }) => {
    if (!isCreator) return reply(mess.owner);
    if (!q) return reply('Please provide a group link!');
    
    let linkRegex = args.join(" ");
    let coded = linkRegex.split("https://chat.whatsapp.com/")[1];
    if (!coded) return reply("Link Invalid");

    MARION.query({
      tag: "iq",
      attrs: {
        type: "get",
        xmlns: "w:g2",
        to: "@g.us"
      },
      content: [{ tag: "invite", attrs: { code: coded } }]
    }).then(async (res) => {
      const tee = `${res.content[0].attrs.id ? res.content[0].attrs.id : "undefined"}`;
      reply(tee + '@g.us');
    });
  }
},
 {
  command: ['hostip', 'ipbot'],
  operate: async ({ MARION, m, reply, isCreator, mess }) => {
    if (!isCreator) return reply(mess.owner);

    https.get("https://api.ipify.org", (res) => {
      let data = '';
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => reply("Bot's public IP: " + data));
    });
  }
},
 {
  command: ['join'],
  operate: async ({ MARION, m, reply, isCreator, mess, args, text, isUrl }) => {
    if (!isCreator) return reply(mess.owner);
    if (!text) return reply("Enter group link");
    if (!isUrl(args[0]) && !args[0].includes("whatsapp.com")) return reply("Invalid link");

    try {
      const link = args[0].split("https://chat.whatsapp.com/")[1];
      await MARION.groupAcceptInvite(link);
      reply("Joined successfully");
    } catch {
      reply("Failed to join group");
    }
  }
},
 {
  command: ['lastseen'],
  operate: async ({ MARION, m, reply, isCreator, mess, prefix, command, text, args }) => {
    if (!isCreator) return reply(mess.owner);
    if (!text) return reply(`Options: all/contacts/contact_blacklist/none\nExample: ${prefix + command} all`);

    const validOptions = ["all", "contacts", "contact_blacklist", "none"];
    if (!validOptions.includes(args[0])) return reply("Invalid option");

    await MARION.updateLastSeenPrivacy(text);
    await reply(mess.done);
  }
},
 {
  command: ['leave', 'leavegc'],
  operate: async ({ MARION, m, reply, isCreator, mess, sleep }) => {
    if (!isCreator) return reply(mess.owner);
    if (!m.isGroup) return reply(mess.group);

    reply("*Goodbye, it was nice being here!*");
    await sleep(3000);
    await MARION.groupLeave(m.chat);
  }
},
 {
  command: ['listbadword'],
  operate: async ({ m, reply, isCreator, mess, bad }) => {
    if (!isCreator) return reply(mess.owner);
    if (m.isGroup) return reply('This command cannot be used in personal chats.');

    if (bad.length === 0) return reply('No bad words have been added yet.');

    let text = '*Bad Words List:*\n\n';
    bad.forEach((word, index) => {
      text += `${index + 1}. ${word}\n`;
    });

    text += `\nTotal bad words: ${bad.length}`;
    reply(text);
  }
},
{
  command: ['listignorelist'],
  operate: async ({ reply, loadBlacklist }) => {
    let blacklist = loadBlacklist();
    if (blacklist.blacklisted_numbers.length === 0) {
        reply('The ignore list is empty.');
    } else {
        reply(`Ignored users/chats:\n${blacklist.blacklisted_numbers.join('\n')}`);
    }
  }
},
 {
  command: ['modestatus', 'botmode'],
  operate: async ({ MARION 𝐗, m, reply, isCreator, mess, modeStatus }) => {
    if (!isCreator) return reply(mess.owner);
    reply(`Current mode: ${modeStatus}`);
  }
},
  {
  command: ['online'],
  operate: async ({ MARION, m, reply, isCreator, mess, prefix, command, text, args }) => {
    if (!isCreator) return reply(mess.owner);
    if (!text) return reply(`Options: all/match_last_seen\nExample: ${prefix + command} all`);

    const validOptions = ["all", "match_last_seen"];
    if (!validOptions.includes(args[0])) return reply("Invalid option");

    await MARION.updateOnlinePrivacy(text);
    await reply(mess.done);
  }
},
 {
  command: ['owner'],
  operate: async ({ m, MARION, sender }) => {
    try {
      const ownerList = [];
      const ownerNumbers = [global.ownernumber.includes('@') ? global.ownernumber : `${global.ownernumber}@s.whatsapp.net`];

      for (const number of ownerNumbers) {
        const displayName = await MARION.getName(number);
        ownerList.push({
          displayName: displayName || global.ownername,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${global.ownername}\nFN:${global.ownername}\nitem1.TEL;waid=${number.split('@')[0]}:${number.split('@')[0]}\nitem1.X-ABLabel:Mobile\nEND:VCARD`,
        });
      }

      await MARION.sendMessage(
        m.chat,
        { contacts: { displayName: `${ownerList.length} Contact`, contacts: ownerList }, mentions: [sender] },
        { quoted: m }
      );
    } catch (error) {
      console.error('Error sending owner contact:', error.message);
      await MARION.sendMessage(
        m.chat,
        { text: `*Error:* ${error.message}` },
        { quoted: m }
      );
    }
  },
},
  {
  command: ['ppprivacy'],
  operate: async ({ MARION, m, reply, isCreator, mess, prefix, command, text, args }) => {
    if (!isCreator) return reply(mess.owner);
    if (!text) return reply(`Options: all/contacts/contact_blacklist/none\nExample: ${prefix + command} all`);

    const validOptions = ["all", "contacts", "contact_blacklist", "none"];
    if (!validOptions.includes(args[0])) return reply("Invalid option");

    await MARION.updateProfilePicturePrivacy(text);
    await reply(mess.done);
  }
},
 {
  command: ['react'],
  operate: async ({ MARION, m, reply, isCreator, mess, args, quoted }) => {
    if (!isCreator) return reply(mess.owner);
    if (!args) return reply(`*Reaction emoji needed*\n Example .react 🤔`);

    const reactionMessage = {
      react: {
        text: args[0],
        key: { remoteJid: m.chat, fromMe: true, id: quoted.id },
      },
    };
    MARION.sendMessage(m.chat, reactionMessage);
  }
},
  {
  command: ['readreceipts'],
  operate: async ({ MARION, m, reply, isCreator, mess, prefix, command, text, args }) => {
    if (!isCreator) return reply(mess.owner);
    if (!text) return reply(`Options: all/none\nExample: ${prefix + command} all`);

    const validOptions = ["all", "none"];
    if (!validOptions.includes(args[0])) return reply("Invalid option");

    await MARION.updateReadReceiptsPrivacy(text);
    await reply(mess.done);
  }
},
  {
  command: ['reportbug'],
  operate: async ({ m, mess, text, MARION, isCreator, versions, prefix, command }) => {
    if (!isCreator) return reply(mess.owner);
    if (!text) return reply(`Example: ${prefix + command} Hey, play command isn't working`);

    const bugReportMsg = `
*BUG REPORT*

*User*: @${m.sender.split("@")[0]}
*Issue*: ${text}

*Version*: ${versions}
    `;

    const confirmationMsg = `
Hi ${m.pushName},

Your bug report has been forwarded to my developer.
Please wait for a reply.

*Details:*
${bugReportMsg}
    `;

    MARION.sendMessage("254796087764@s.whatsapp.net", { text: bugReportMsg, mentions: [m.sender] }, { quoted: m });
    MARION.sendMessage(m.chat, { text: confirmationMsg, mentions: [m.sender] }, { quoted: m });
  }
},
  {
  command: ['request'],
  operate: async ({ m, mess, text, MARION, isCreator, versions, prefix, command, reply }) => {
    if (!isCreator) return reply(mess.owner);
    if (!text) return reply(`Example: ${prefix + command} I would like a new feature (specify) to be added.`);

    const requestMsg = `
*REQUEST*

*User*: @${m.sender.split("@")[0]}
*Request*: ${text}

*Version*: ${versions}
    `;

    const confirmationMsg = `
Hi ${m.pushName},

Your request has been forwarded to my developer.
Please wait for a reply.

*Details:*
${requestMsg}
    `;

    MARION.sendMessage("254796087764@s.whatsapp.net", { text: requestMsg, mentions: [m.sender] }, { quoted: m });
    MARION.sendMessage(m.chat, { text: confirmationMsg, mentions: [m.sender] }, { quoted: m });
  }
},
  {
  command: ['restart'],
  operate: async ({ MARION, m, reply, isCreator, mess }) => {
    if (!isCreator) return reply(mess.owner);
    reply(`*Restarting...*`);
    await sleep(3000);
    process.exit(0);
  }
},
 {
  command: ['setbio'],
  operate: async ({ MARION, m, reply, isCreator, mess, prefix, command, text }) => {
    if (!isCreator) return reply(mess.owner);
    if (!text) return reply(`*Text needed*\nExample: ${prefix + command} ${global.botname}`);

    await MARION.updateProfileStatus(text);
    reply(`*Successfully updated bio to "${text}"*`);
  }
},
 {
  command: ['setprofilepic'],
  operate: async ({ MARION, m, reply, isCreator, mess, prefix, command, quoted, mime, args, botNumber }) => {
    if (!isCreator) return reply(mess.owner);
    if (!quoted) return reply(`*Send or reply to an image With captions ${prefix + command}*`);
    if (!/image/.test(mime)) return reply(`*Send or reply to an image With captions ${prefix + command}*`);
    if (/webp/.test(mime)) return reply(`*Send or reply to an image With captions ${prefix + command}*`);

    const medis = await MARION.downloadAndSaveMediaMessage(quoted, "ppbot.jpeg");

    if (args[0] === "full") {
      const { img } = await generateProfilePicture(medis);
      await MARION.query({
        tag: "iq",
        attrs: {
          to: botNumber,
          type: "set",
          xmlns: "w:profile:picture",
        },
        content: [
          {
            tag: "picture",
            attrs: {
              type: "image",
            },
            content: img,
          },
        ],
      });
      fs.unlinkSync(medis);
      reply(mess.done);
    } else {
      await MARION.updateProfilePicture(botNumber, {
        url: medis,
      });
      fs.unlinkSync(medis);
      reply(mess.done);
    }
  }
},
 {
  command: ['toviewonce', 'tovo', 'tovv'],
  operate: async ({ MARION, m, reply, isCreator, mess, quoted, mime }) => {
    if (!isCreator) return reply(mess.owner);
    if (!quoted) return reply(`*Reply to an Image or Video*`);

    if (/image/.test(mime)) {
      const anuan = await MARION.downloadAndSaveMediaMessage(quoted);
      MARION.sendMessage(
        m.chat,
        {
          image: { url: anuan },
          caption: mess.done,
          fileLength: "999",
          viewOnce: true
        },
        { quoted: m }
      );
    } else if (/video/.test(mime)) {
      const anuanuan = await MARION.downloadAndSaveMediaMessage(quoted);
      MARION.sendMessage(
        m.chat,
        {
          video: { url: anuanuan },
          caption: mess.done,
          fileLength: "99999999",
          viewOnce: true
        },
        { quoted: m }
      );
    } else if (/audio/.test(mime)) {
      const bebasap = await MARION.downloadAndSaveMediaMessage(quoted);
      MARION.sendMessage(m.chat, {
        audio: { url: bebasap },
        mimetype: "audio/mpeg",
        ptt: true,
        viewOnce: true
      });
    }
  }
},
  {
  command: ['unblock'],
  operate: async ({ MARION, m, reply, isCreator, mess, text }) => {
    if (!isCreator) return reply(mess.owner);
    if (!m.quoted && !m.mentionedJid[0] && !text) return reply("Reply to a message or mention/user ID to unblock");

    const userId = m.mentionedJid[0] || m.quoted?.sender || text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    await MARION.updateBlockStatus(userId, "unblock");
    reply(mess.done);
  }
}, 
];