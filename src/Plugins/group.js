const fs = require('fs'); 
const { sleep } = require('../../lib/myfunc');
const { generateProfilePicture } = require('@whiskeysockets/baileys');


module.exports = [
 {
    command: ['add'],
    operate: async (context) => {
        const { m, mess, text, isCreator, reply,Cypher } = context;
        if (!m.isGroup) return m.reply(mess.group);
        if (!isCreator) return m.reply(mess.owner);
        
        let bws = m.quoted
            ? m.quoted.sender
            : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        await Cypher.groupParticipantsUpdate(m.chat, [bws], "add");
        reply(mess.done);
    }
 },
  {
    command: ['antibadword', 'antitoxic'],
    operate: async (context) => {
        const { m, db, from, isBotAdmins, isAdmins, isCreator, args, mess, command, reply } = context;

        if (!m.isGroup) return reply(mess.group);
        if (!isBotAdmins) return reply(mess.admin); 
        if (!isAdmins && !isCreator) return reply(mess.notadmin); 
        if (args.length < 2) return reply("*Usage: .antibadword <delete/kick> <on/off>*");

        const mode = args[0].toLowerCase();
        const state = args[1].toLowerCase();

        if (!["delete", "kick"].includes(mode)) {
            return reply("*Invalid mode! Use either 'delete' or 'kick'.*");
        }

        if (!["on", "off"].includes(state)) {
            return reply("*Invalid state! Use either 'on' or 'off'.*");
        }

        if (state === "on") {
            if (mode === "delete") {
                db.data.chats[from].badword = true;
                db.data.chats[from].badwordkick = false;
            } else if (mode === "kick") {
                db.data.chats[from].badwordkick = true;
                db.data.chats[from].badword = false;
            }
            reply(`*Successfully enabled antibadword ${mode} mode!*`);
        } else if (state === "off") {
            if (mode === "delete") {
                db.data.chats[from].badword = false;
            } else if (mode === "kick") {
                db.data.chats[from].badwordkick = false;
            }
            reply(`*Successfully disabled antibadword ${mode} mode!*`);
        }
    },
},
 {
    command: ['antibot'],
    operate: async (context) => {
        const { m, db, from, isBotAdmins, isAdmins, isCreator, args, mess, command, reply } = context;
        if (!m.isGroup) return reply(mess.group);
        if (!isBotAdmins) return reply(mess.admin);
        if (!isAdmins && !isCreator) return reply(mess.notadmin);
        if (args.length < 1) return reply("*on or off?*");
        if (args[0] === "on") {
            db.data.chats[from].antibot = true;
            reply(`*Successfully enabled ${command}*`);
        } else if (args[0] === "off") {
            db.data.chats[from].antibot = false;
            reply(`*Successfully disabled ${command}*`);
        }
    }
},
  {
    command: ['antilink'],
    operate: async (context) => {
        const { m, db, from, isBotAdmins, isAdmins, isCreator, args, mess, command, reply } = context;

        if (!m.isGroup) return reply(mess.group); 
        if (!isBotAdmins) return reply(mess.admin); 
        if (!isAdmins && !isCreator) return reply(mess.notadmin); 
        if (args.length < 2) return reply("*Usage: .antilink <delete/kick> <on/off>*");

        const mode = args[0].toLowerCase();
        const state = args[1].toLowerCase();

        if (!["delete", "kick"].includes(mode)) {
            return reply("*Invalid mode! Use either 'delete' or 'kick'.*");
        }

        if (!["on", "off"].includes(state)) {
            return reply("*Invalid state! Use either 'on' or 'off'.*");
        }

        if (state === "on") {
            if (mode === "delete") {
          db.data.chats[from].antilinkkick = false;
          db.data.chats[from].antilink = true;
            } else if (mode === "kick") {
         db.data.chats[from].antilink = false;
         db.data.chats[from].antilinkkick = true;
            }
            reply(`*Successfully enabled antilink ${mode} mode!*`);
        } else if (state === "off") {
            if (mode === "delete") {
          db.data.chats[from].antilinkkick = false;
          db.data.chats[from].antilink = false;
            } else if (mode === "kick") {
         db.data.chats[from].antilink = false;
         db.data.chats[from].antilinkkick = false;
            }
            reply(`*Successfully disabled antilink ${mode} mode!*`);
        }
    }
},
  {
    command: ['antilinkgc'],
    operate: async (context) => {
        const { m, db, from, isBotAdmins, isAdmins, isCreator, args, mess, command, reply } = context;

        if (!m.isGroup) return reply(mess.group); 
        if (!isBotAdmins) return reply(mess.admin); 
        if (!isAdmins && !isCreator) return reply(mess.notadmin); 
        if (args.length < 2) return reply("*Usage: .antilinkgc <delete/kick> <on/off>*");

        const mode = args[0].toLowerCase();
        const state = args[1].toLowerCase();

        if (!["delete", "kick"].includes(mode)) {
            return reply("*Invalid mode! Use either 'delete' or 'kick'.*");
        }

        if (!["on", "off"].includes(state)) {
            return reply("*Invalid state! Use either 'on' or 'off'.*");
        }

        if (state === "on") {
            if (mode === "delete") {
                db.data.chats[from].antilinkgc = true;
                db.data.chats[from].antilinkgckick = false;
            } else if (mode === "kick") {
                db.data.chats[from].antilinkgckick = true;
                db.data.chats[from].antilinkgc = false;
            }
            reply(`*Successfully enabled antilinkgc ${mode} mode!*`);
        } else if (state === "off") {
            if (mode === "delete") {
                db.data.chats[from].antilinkgc = false;
            } else if (mode === "kick") {
                db.data.chats[from].antilinkgckick = false;
            }
            reply(`*Successfully disabled antilinkgc ${mode} mode!*`);
        }
    },
},
  {
    command: ['close'],
    operate: async (context) => {
        const { m, mess, isAdmins, isCreator, isBotAdmins, Cypher, reply } = context;
        if (!m.isGroup) return reply(mess.group);
        if (!isAdmins && !isCreator) return reply(mess.notadmin);
        if (!isBotAdmins) return reply(mess.admin);

        Cypher.groupSettingUpdate(m.chat, "announcement");
        reply("Group closed by admin. Only admins can send messages.");
    }
},
 {
    command: ['closetime'],
    operate: async (context) => {
        const { m, mess, args, isAdmins, isCreator, isBotAdmins, Cypher, reply } = context;
        if (!m.isGroup) return reply(mess.group);
        if (!isAdmins && !isCreator) return reply(mess.notadmin);
        if (!isBotAdmins) return reply(mess.admin);

        const duration = args[0];
        const unit = args[1].toLowerCase();

        let timer;
        switch (unit) {
            case "seconds":
                timer = duration * 1000;
                break;
            case "minutes":
                timer = duration * 60000;
                break;
            case "hours":
                timer = duration * 3600000;
                break;
            case "days":
                timer = duration * 86400000;
                break;
            default:
                return reply("*Select unit:*\nseconds\nminutes\nhours\ndays\n\n*Example:*\n10 seconds");
        }

        reply(`*Closing group after ${duration} ${unit}*`);
        setTimeout(() => {
            Cypher.groupSettingUpdate(m.chat, "announcement");
            reply("Group closed by admin. Only admins can send messages.");
        }, timer);
    }
},
 {
    command: ['delppgroup'],
    operate: async (context) => {
        const { m, mess, isAdmins, isCreator, isBotAdmins, Cypher, reply, from } = context;
        if (!m.isGroup) return reply(mess.group);
        if (!isAdmins && !isCreator) return reply(mess.notadmin);
        if (!isBotAdmins) return reply(mess.admin);
        
        await Cypher.removeProfilePicture(from);
        reply("Group profile picture has been successfully removed.");
    }
}, 
  {
    command: ['demote'],
    operate: async (context) => {
        const { m, mess, text, isAdmins, isGroupOwner, isCreator, isBotAdmins, Cypher } = context;
        if (!m.isGroup) return reply(mess.group);
        if (!isAdmins && !isGroupOwner && !isCreator) return reply(mess.admin);
        if (!isBotAdmins) return reply(mess.admin);

        let bwstq = m.mentionedJid[0]
            ? m.mentionedJid[0]
            : m.quoted
            ? m.quoted.sender
            : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        await Cypher.groupParticipantsUpdate(m.chat, [bwstq], "demote");
        reply(mess.done);
    }
},
 {
    command: ['editsettings', 'editinfo'],
    operate: async (context) => {
        const { m, mess, args, isAdmins, isGroupOwner, isCreator, isBotAdmins, Cypher, prefix, command } = context;
        if (!m.isGroup) return reply(mess.group);
        if (!isAdmins && !isGroupOwner && !isCreator) return reply(mess.admin);
        if (!isBotAdmins) return reply(mess.admin);

        if (args[0] === "on") {
            await Cypher.groupSettingUpdate(m.chat, "unlocked").then(
                (res) => reply(`*Successful, members can edit group info*`)
            );
        } else if (args[0] === "off") {
            await Cypher.groupSettingUpdate(m.chat, "locked").then((res) =>
                reply(`*Successful, members cannot edit group info*`)
            );
        } else {
            reply(`Example ${prefix + command} on/off`);
        }
    }
}, 
 {
  command: ['link', 'linkgc', 'gclink', 'grouplink'],
  operate: async ({ Cypher, m, reply, isAdmins, isGroupOwner, isCreator, mess, isBotAdmins, groupMetadata }) => {
    if (!m.isGroup) return reply(mess.group);
    if (!isAdmins && !isGroupOwner && !isCreator) return reply(mess.admin);
    if (!isBotAdmins) return reply(mess.admin);

    let response = await Cypher.groupInviteCode(m.chat);
    Cypher.sendText(
      m.chat,
      `*GROUP LINK*\n\n*NAME:* ${groupMetadata.subject}\n\n*OWNER:* ${groupMetadata.owner !== undefined ? "+" + groupMetadata.owner.split`@`[0] : "Unknown"}\n\n*ID:* ${groupMetadata.id}\n\n*LINK:* https://chat.whatsapp.com/${response}\n\n*MEMBERS:* ${groupMetadata.participants.length}`,
      m,
      {
        detectLink: true,
      }
    );
  }
},
 {
    command: ['hidetag', 'tag'], 
    operate: async (context) => {
        const { m, isAdmins, isGroupOwner, isCreator, mess, participants, Cypher, isBotAdmins } = context;
        if (!m.isGroup) return reply(mess.group);
        if (!isAdmins && !isGroupOwner && !isCreator) return reply(mess.admin);
        if (!isBotAdmins) return reply(mess.admin);
        const quotedText = m.quoted ? m.quoted.text : null;
        const providedText = m.text?.split(" ").slice(1).join(" ") || null;
        const textToSend = quotedText || providedText || "No message provided";
        await Cypher.sendMessage(
            m.chat,
            {
                text: textToSend,
                mentions: participants.map((a) => a.id),
            },
            {
                quoted: m,
            }
        );
    }
},
  {
    command: ['invite'],
    operate: async (context) => {
        const { m, mess, text, prefix, Cypher, isBotAdmins } = context;
        if (!m.isGroup) return reply(mess.group);
        if (!isBotAdmins) return reply(mess.admin);
        if (!text)
            return reply(
                `*Enter the number you want to invite to this group*\n\nExample :\n${prefix + command} 254796180105`
            );
        if (text.includes("+"))
            return reply(`*Enter the number together without* *+*`);
        if (isNaN(text))
            return reply(
                `*Enter only the numbers with your country code without spaces*`
            );

        let group = m.chat;
        let link = "https://chat.whatsapp.com/" + (await Cypher.groupInviteCode(group));
        await Cypher.sendMessage(text + "@s.whatsapp.net", {
            text: `*GROUP INVITATION*\n\nSomeone invites you to join this group: \n\n${link}`,
            mentions: [m.sender],
        });
        reply(`*Successfully sent invite link*`);
    }
},
  {
    command: ['kick', 'remove'],
    operate: async (context) => {
        const { m, mess, text, isAdmins, isGroupOwner, isCreator, isBotAdmins, Cypher } = context;
        if (!m.isGroup) return reply(mess.group);
        if (!isAdmins && !isGroupOwner && !isCreator) return reply(mess.admin);
        if (!isBotAdmins) return reply(mess.admin);

        let bck = m.mentionedJid[0]
            ? m.mentionedJid[0]
            : m.quoted
            ? m.quoted.sender
            : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        await Cypher.groupParticipantsUpdate(m.chat, [bck], "remove");
        reply(mess.done);
    }
},
 {
  command: ['listonline', 'onlinemembers'],
  operate: async (context) => {
    const { m, mess, args, store, botNumber, Cypher, reply } = context;
    if (!m.isGroup) return reply(mess.group);
    
    let id = args && /\d+\-\d+@g.us/.test(args[0]) ? args[0] : m.chat;
    let presences = store.presences[id];
    
    if (!presences) {
      return reply('*No online members detected in this group.*');
    }

    let online = [...Object.keys(presences), botNumber];
    let liston = 1;
    Cypher.sendText(m.chat, '*ONLINE MEMBERS IN THIS GROUP*\n\n' + online.map(v => `${liston++} . @` + v.replace(/@.+/, '')).join`\n`, m, { mentions: online });
  }
},
  {
    command: ['mediatag'],
    operate: async (context) => {
        const { m, isAdmins, mess, participants, Cypher, isBotAdmins } = context;
        if (!m.isGroup) return reply(mess.group);
        if (!isBotAdmins) return reply(mess.admin);
        if (!isAdmins) return reply(mess.admin);
        if (!m.quoted) return reply(`Reply to any media with caption ${prefix + command}`);

        Cypher.sendMessage(m.chat, {
          forward: m.quoted.fakeObj,
          mentions: participants.map((a) => a.id),
        });
    }
},
 {
    command: ['open'],
    operate: async (context) => {
        const { m, mess, isAdmins, isCreator, isBotAdmins, Cypher } = context;
        if (!m.isGroup) return reply(mess.group);
        if (!isAdmins && !isCreator) return reply(mess.notadmin);
        if (!isBotAdmins) return reply(mess.admin);

        Cypher.groupSettingUpdate(m.chat, "not_announcement");
        reply("Group opened by admin. Members can now send messages.");
    }
},
 {
    command: ['opentime'],
    operate: async (context) => {
        const { m, mess, args, isAdmins, isCreator, isBotAdmins, Cypher } = context;
        if (!m.isGroup) return reply(mess.group);
        if (!isAdmins && !isCreator) return reply(mess.notadmin);
        if (!isBotAdmins) return reply(mess.admin);

        const duration = args[0];
        const unit = args[1].toLowerCase();

        let timer;
        switch (unit) {
            case "seconds":
                timer = duration * 1000;
                break;
            case "minutes":
                timer = duration * 60000;
                break;
            case "hours":
                timer = duration * 3600000;
                break;
            case "days":
                timer = duration * 86400000;
                break;
            default:
                return reply("*Select unit:*\nseconds\nminutes\nhours\ndays\n\n*Example:*\n10 seconds");
        }

        reply(`*Opening group after ${duration} ${unit}*`);
        setTimeout(() => {
            Cypher.groupSettingUpdate(m.chat, "not_announcement");
            reply("Group opened by admin. Members can now send messages.");
        }, timer);
    }
},
 {
    command: ['poll'],
    operate: async (context) => {
        const { m, mess, text, isCreator, prefix, Cypher, isGroup } = context;
        if (!isCreator) return reply(mess.owner);
        if (!m.isGroup) return reply(mess.group);
        let [poll, opt] = text.split("|");
        if (text.split("|") < 2)
            return await reply(
                `Enter a question and at least 2 options\nExample: ${prefix}poll Who is best player?|Messi,Ronaldo,None...`
            );
        let options = [];
        for (let i of opt.split(",")) {
            options.push(i);
        }
        
        await Cypher.sendMessage(m.chat, {
            poll: {
                name: poll,
                values: options,
            },
        });
    }
},
  {
    command: ['promote'],
    operate: async (context) => {
        const { m, mess, text, isAdmins, isGroupOwner, isCreator, isBotAdmins, quoted, Cypher } = context;
        if (!m.isGroup) return reply(mess.group);
        if (!isAdmins && !isGroupOwner && !isCreator) return reply(mess.admin);
        if (!isBotAdmins) return reply(mess.admin);
        
        let bwst = m.mentionedJid[0]
            ? m.mentionedJid[0]
            : m.quoted
            ? m.quoted.sender
            : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        await Cypher.groupParticipantsUpdate(
            m.chat,
            [bwst],
            "promote"
        );
        reply(mess.done);
    }
},
 {
    command: ['resetlink'],
    operate: async (context) => {
        const { m, isAdmins, isGroupOwner, isCreator, mess, Cypher, isBotAdmins } = context;
        if (!m.isGroup) return reply(mess.group);
        if (!isAdmins && !isGroupOwner && !isCreator) return reply(mess.admin);
        if (!isBotAdmins) return reply(mess.admin);

        await Cypher.groupRevokeInvite(m.chat).then((res) => {
          reply(mess.done);
        });
    }
},
  {
    command: ['setdesc'],
    operate: async (context) => {
        const { m, mess, text, isAdmins, isGroupOwner, isCreator, isBotAdmins, Cypher } = context;
        if (!m.isGroup) return reply(mess.group);
        if (!isAdmins && !isGroupOwner && !isCreator) return reply(mess.notadmin);
        if (!isBotAdmins) return reply(mess.admin);
        if (!text) return reply("*Please enter a text*");
        
        await Cypher.groupUpdateDescription(m.chat, text);
        reply(mess.done);
    }
},
  {
    command: ['setgroupname', 'setgcname'],
    operate: async (context) => {
        const { m, mess, text, isAdmins, isGroupOwner, isCreator, isBotAdmins, Cypher } = context;
        if (!m.isGroup) return reply(mess.group);
        if (!isAdmins && !isGroupOwner && !isCreator) return reply(mess.admin);
        if (!isBotAdmins) return reply(mess.admin);
        if (!text) return reply("*Desired groupname?*");

        await Cypher.groupUpdateSubject(m.chat, text);
        reply(mess.done);
    }
},
  {
  command: ['setppgroup'],
  operate: async ({ m, reply, mess, isAdmins, isCreator, isBotAdmins, Marion, quoted, mime, prefix, command, args }) => {
    if (!m.isGroup) return reply(mess.group);
    if (!isAdmins && !isCreator) return reply(mess.notadmin);
    if (!isBotAdmins) return reply(mess.admin);
    if (!quoted) return reply(`*Send or reply to an image with the caption ${prefix + command}*`);
    if (!/image/.test(mime)) return reply(`*Send or reply to an image with the caption ${prefix + command}*`);
    if (/webp/.test(mime)) return reply(`*Send or reply to an image with the caption ${prefix + command}*`);

    const medis = await Marion.downloadAndSaveMediaMessage(quoted, "ppbot.jpeg");
    if (args[0] === "full") {
      const { img } = await generateProfilePicture(medis);
      await Marion.query({
        tag: "iq",
        attrs: {
          to: m.chat,
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
      reply("Group profile picture has been successfully set.");
    } else {
      await Marion.updateProfilePicture(m.chat, { url: medis });
      fs.unlinkSync(medis);
      reply("Group profile picture has been successfully updated.");
    }
  }
},
{
  command: ['tagadmin', 'listadmin', 'admin'],
  operate: async ({ Marion, m, reply, mess, participants, groupMetadata }) => {
    if (!m.isGroup) return reply(mess.group);

    const groupAdmins = participants.filter((p) => p.admin);
    const listAdmin = groupAdmins
      .map((v, i) => `${i + 1}. @${v.id.split("@")[0]}`)
      .join("\n");
    const owner = groupMetadata.owner || groupAdmins.find((p) => p.admin === "superadmin")?.id || m.chat.split`-`[0] + "@s.whatsapp.net";
    let text = `*Group Admins Here:*\n${listAdmin}`.trim();

    Marion.sendMessage(
      m.chat,
      { text: text, mentions: [...groupAdmins.map((v) => v.id), owner] },
      { quoted: m }
    );
  }
}, 
 {
    command: ['tagall'],
    operate: async (context) => {
        const { m, isAdmins, isGroupOwner, isCreator, mess, q, participants, Cypher, isBotAdmins } = context;
        if (!m.isGroup) return reply(mess.group);
        if (!isAdmins && !isGroupOwner && !isCreator) return reply(mess.admin);
        if (!isBotAdmins) return reply(mess.admin);

        let me = m.sender;
        let teks = `*TAGGED BY:*  @${
          me.split("@")[0]
        }\n\n*MESSAGE:* ${q ? q : "No message"}\n\n`;
        for (let mem of participants) {
          teks += `@${mem.id.split("@")[0]}\n`;
        }
        Marion.sendMessage(
          m.chat,
          {
            text: teks,
            mentions: participants.map((a) => a.id),
          },
          {
            quoted: m,
          }
        );
    }
},
 {
  command: ['totalmembers'],
  operate: async ({ Marion, m, reply, mess, participants, isGroupAdmins, isCreator, sleep, groupMetadata }) => {
    if (!m.isGroup) return reply(mess.group);
    if (!(isGroupAdmins || isCreator)) return reply(mess.admin);

    await Marion.sendMessage(
      m.chat,
      {
        text: `*GROUP*: ${groupMetadata.subject}\n*MEMBERS*: ${participants.length}`,
      },
      { quoted: m, ephemeralExpiration: 86400 }
    );
  }
},
  {
    command: ['userid', 'userjid'],
    operate: async (context) => {
        const { m, mess, isCreator, Cypher } = context;
        if (!isCreator) return reply(mess.owner);
        if (!m.isGroup) return reply(mess.group);

        const groupMetadata = m.isGroup
            ? await Cypher.groupMetadata(m.chat).catch((e) => {})
            : "";
        const participants = m.isGroup
            ? await groupMetadata.participants
            : "";
        let textt = `Here is jid address of all users of\n *${groupMetadata.subject}*\n\n`;
        for (let mem of participants) {
            textt += `□ ${mem.id}\n`;
        }
        reply(textt);
    }
},
 {
  command: ['vcf'],
  operate: async ({ Marion, m, reply, mess, participants, isGroupAdmins, isCreator, groupMetadata }) => {
    if (!m.isGroup) return reply(mess.group);
    if (!isGroupAdmins) return reply(mess.admin);

    let cmiggc = await Marion.groupMetadata(m.chat);
    let vcard = "";
    let noPort = 0;
    for (let a of cmiggc.participants) {
      vcard += `BEGIN:VCARD\nVERSION:3.0\nFN:[${noPort++}] +${a.id.split("@")[0]}\nTEL;type=CELL;type=VOICE;waid=${a.id.split("@")[0]}:+${a.id.split("@")[0]}\nEND:VCARD\n`;
    }
    let nmfilect = "./contacts.vcf";
    reply(`\nPlease wait, saving ${cmiggc.participants.length} contacts`);

    fs.writeFileSync(nmfilect, vcard.trim());
    await sleep(2000);
    Marion.sendMessage(
      m.chat,
      {
        document: fs.readFileSync(nmfilect),
        mimetype: "text/vcard",
        fileName: "Contact.vcf",
        caption: `Successful\n\nGroup: *${cmiggc.subject}*\nContacts: *${cmiggc.participants.length}*`,
      },
      { ephemeralExpiration: 86400, quoted: m }
    );
    fs.unlinkSync(nmfilect);
  }
},  
];