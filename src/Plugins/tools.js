const fetch = require('node-fetch'); 
const googleTTS = require("google-tts-api"); 
const fs = require("fs");
const axios = require('axios');
const { exec } = require('child_process');
const { getRandom } = require('../../lib/myfunc');
const path = require('path');
const { addExif } = require('../../lib/exif'); 
const { styletext } = require('../../lib/scraper'); 
const { handleMediaUpload } = require('../../lib/catbox');
const { getDevice } = require('@whiskeysockets/baileys'); 


module.exports = [
 {
  command: ['browse'],
  operate: async ({ m, text, MARION, reply }) => {
    if (!text) return reply("Enter URL");

    try {
      let res = await fetch(text);

      if (res.headers.get('Content-Type').includes('application/json')) {
        let json = await res.json();
        await MARION.sendMessage(m.chat, { text: JSON.stringify(json, null, 2) }, { quoted: m });
      } else {
        let resText = await res.text();
        await MARION.sendMessage(m.chat, { text: resText }, { quoted: m });
      }

      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    } catch (error) {
      reply(`Error fetching URL: ${error.message}`);
    }
  }
},
 {
  command: ['calculate', 'calculator'],
  operate: async ({ m, text, prefix, command, reply }) => {
    try {
      let result;

      if (text.includes("+")) {
        const [value_one, value_two] = text.split("+").map(Number);
        result = value_one + value_two;
      } else if (text.includes("-")) {
        const [value_one, value_two] = text.split("-").map(Number);
        result = value_one - value_two;
      } else if (text.includes("×")) {
        const [value_one, value_two] = text.split("×").map(Number);
        result = value_one * value_two;
      } else if (text.includes("÷")) {
        const [value_one, value_two] = text.split("÷").map(Number);
        result = value_one / value_two;
      } else {
        return reply(`*Enter a maths question, Example: ${prefix + command} 1 + 1\n\nAvailable options: +, -, ÷, ×*`);
      }

      reply(`${result}`);
    } catch (error) {
      console.error(error);
      reply('*An error occurred during the calculation.*');
    }
  }
},
 {
  command: ['emojimix', 'emix'],
  operate: async ({ m, text, prefix, command, MARION, fetchJson, reply }) => {
    let [emoji1, emoji2] = text.split`+`;
    
    if (!emoji1)
      return reply(`*Example : ${prefix + command} 😅+🤔*`);
    
    if (!emoji2)
      return reply(`*Example : ${prefix + command} 😅+🤔*`);
    
    try {
      let anu = await fetchJson(
        `https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(
          emoji1
        )}_${encodeURIComponent(emoji2)}`
      );
      
      for (let res of anu.results) {
        await MARION.sendImageAsSticker(
          m.chat,
          res.url,
          m,
          {
            packname: global.packname,
            author: global.author,
            categories: res.tags,
          }
        );
      }
    } catch (error) {
      console.error(error);
      reply('*An error occurred while fetching emoji mix.*');
    }
  }
},
 {
  command: ['fliptext'],
  operate: async ({ m, args, prefix, command, reply }) => {
    if (args.length < 1) return reply(`*Example:\n${prefix}fliptext Tylor*`);
    
    let quere = args.join(" ");
    let flipe = quere.split("").reverse().join("");
    
    reply(`Normal:\n${quere}\nFlip:\n${flipe}`);
  }
},
 {
  command: ['genpass', 'genpassword'],
  operate: async ({ MARION, m, reply, text }) => {
    let length = text ? parseInt(text) : 12;
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let pass = "";
    for (let i = 0; i < length; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    try {
      MARION.sendMessage(m.chat, { text: pass }, { quoted: m });
    } catch (error) {
      console.error('Error generating password:', error);
      reply('An error occurred while generating the password.');
    }
  }
},
 {
  command: ['device', 'getdevice'],
  operate: async ({ MARION, m, reply }) => {
    if (!m.quoted) {
      return reply('*Please quote a message to use this command!*');
    }
    
    console.log('Quoted Message:', m.quoted);
console.log('Quoted Key:', m.quoted?.key);

    try {
      const quotedMsg = await m.getQuotedMessage();

      if (!quotedMsg) {
        return reply('*Could not detect, please try with newly sent message!*');
      }

      const messageId = quotedMsg.key.id;

      const device = getDevice(messageId) || 'Unknown';

      reply(`The message is sent from *${device}* device.`);
    } catch (err) {
      console.error('Error determining device:', err);
      reply('Error determining device: ' + err.message);
    }
  }
},
 {
  command: ['obfuscate'],
  operate: async ({ m, text, prefix, command, obfus, reply }) => {
    if (!text) return reply(`*Example: ${prefix + command} const bot = require('cypher');*`);
    
    try {
      let meg = await obfus(text);
      reply(`${meg.result}`);
    } catch (error) {
      console.error(error);
      reply('*An error occurred while obfuscating the text.*');
    }
  }
},
 {
  command: ['qrcode'],
  operate: async ({ MARION, m, reply, text }) => {
    if (!text) return reply("Enter text or URL");

    try {
      let res = await fetch(`https://api.qrserver.com/v1/create-qr-code/?data=${text}&size=200x200`);
      let qrCodeUrl = res.url;

      await MARION.sendMessage(m.chat, { image: { url: qrCodeUrl } }, { quoted: m });
    } catch (error) {
      console.error('Error generating QR code:', error);
      reply('An error occurred while generating the QR code.');
    }
  }
},
{
  command: ['qrcode2'],
  operate: async ({ m, text, MARION, reply, getRandom }) => {
    if (!text) return reply("*Please include link or text!*");

    try {
      let qyuer = await qrcode.toDataURL(text, { scale: 35 });
      let data = Buffer.from(qyuer.replace("data:image/png;base64,", ""), "base64");
      let buff = getRandom(".jpg");

      await fs.writeFileSync("./" + buff, data);
      let medi = fs.readFileSync("./" + buff);

      await MARION.sendMessage(
        m.chat,
        { image: medi, caption: global.wm },
        { quoted: m }
      );

      setTimeout(() => {
        fs.unlinkSync("./" + buff);
      }, 10000);
    } catch (error) {
      console.error(error);
      reply('*An error occurred while generating the QR code.*');
    }
  }
},
 {
  command: ['say', 'tts'],
  operate: async ({ m, args, reply, Cypher }) => {
    let text = args.join(" ");
    if (!text) return reply("*Text needed!*");

    try {
      const ttsData = await googleTTS.getAllAudioBase64(text, {
        lang: "en",
        slow: false,
        host: "https://translate.google.com",
        timeout: 10000,
      });

      if (!ttsData.length) return reply("*Failed to generate TTS audio.*");

      const tempFiles = [];
      for (let i = 0; i < ttsData.length; i++) {
        let filePath = `/tmp/tts_part${i}.mp3`;
        fs.writeFileSync(filePath, Buffer.from(ttsData[i].base64, "base64"));
        tempFiles.push(filePath);
      }

      
      let mergedFile = "/tmp/tts_merged.mp3";
      let ffmpegCommand = `ffmpeg -i "concat:${tempFiles.join('|')}" -acodec copy ${mergedFile}`;
      exec(ffmpegCommand, async (err) => {
        if (err) {
          console.error("FFmpeg error:", err);
          return reply("*Error merging audio files.*");
        }

        await MARION.sendMessage(
          m.chat,
          {
            audio: fs.readFileSync(mergedFile),
            mimetype: "audio/mp4",
            ptt: true,
            fileName: "tts_audio.mp3",
          },
          { quoted: m }
        );

        tempFiles.forEach(file => fs.unlinkSync(file));
        fs.unlinkSync(mergedFile);
      });
    } catch (error) {
      console.error("Error in TTS Command:", error);
      reply("*An error occurred while processing the TTS request.*");
    }
  }
},
 {
  command: ['ssweb', 'screenshot', 'ss'],
  operate: async ({ MARION, m, reply, args }) => {
    const q = args.join(" ");
    if (!q) return reply(`Please provide a URL to screenshot!`);
    
    const apiURL = `https://api.tioo.eu.org/sshp?url=${q}`;
    
    try {
      await MARION.sendMessage(m.chat, { image: { url: apiURL } }, { quoted: m });
    } catch (error) {
      console.error('Error generating screenshot:', error);
      reply("An error occurred while generating the image.");
    }
  }
},
 {
  command: ['sswebpc'],
  operate: async ({ MARION, m, reply, args }) => {
    const q = args.join(" ");
    if (!q) return reply(`Please provide a URL to screenshot!`);
    
    const apiURL = `https://api.tioo.eu.org/sspc?url=${q}`;
    
    try {
      await Cypher.sendMessage(m.chat, { image: { url: apiURL } }, { quoted: m });
    } catch (error) {
      console.error('Error generating screenshot:', error);
      reply("An error occurred.");
    }
  }
},
 {
  command: ['sswebtab'],
  operate: async ({ MARIO, m, reply, args }) => {
    const q = args.join(" ");
    if (!q) return reply(`Please provide a URL to screenshot!`);
    
    const apiURL = `https://api.tioo.eu.org/sstab?url=${q}`;
    
    try {
      await MARION.sendMessage(m.chat, { image: { url: apiURL } }, { quoted: m });
    } catch (error) {
      console.error('Error generating screenshot:', error);
      reply("An error occurred.");
    }
  }
},
 {
  command: ['sticker', 's'],
  operate: async ({ MARION, m, reply, args, prefix, command }) => {
 
    const quoted = m.quoted || m.msg?.quoted;
    if (!quoted) {
      return reply(`Send or reply to images, videos, or gifs with captions ${prefix + command}`);
    }

    const mime = quoted.mimetype || quoted.msg?.mimetype;
    if (!mime) {
      return reply(`The quoted message does not contain media. Please send or reply to an image, video, or gif.`);
    }

    const swns = args.join(" ");
    const pcknms = swns.split("|")[0];
    const atnms = swns.split("|")[1];

    try {
      if (/image/.test(mime)) {
        const media = await quoted.download();
        await MARION.sendImageAsSticker(m.chat, media, m, {
          packname: pcknms ? pcknms : global.packname,
          author: atnms ? atnms : global.author,
        });
      }
      else if (/video/.test(mime)) {
        if ((quoted.msg || quoted).seconds > 10) {
          return reply("The video length must be 10 seconds or less. Please try again.");
        }
        const media = await quoted.download();
        await MARION.sendVideoAsSticker(m.chat, media, m, {
          packname: pcknms ? pcknms : global.packname,
          author: atnms ? atnms : global.author,
        });
      }
    
      else {
        return reply(`Send or reply to images, videos, or gifs with captions ${prefix + command}`);
      }
    } catch (error) {
      console.error('Error processing sticker:', error);
      reply('An error occurred while processing the sticker.');
    }
  }
},
 {
  command: ['fancy', 'styletext'],
  operate: async ({ m, text, Cypher, reply }) => {
    
    if (!text) return reply('*Enter a text!*');
    
    try {
      let anu = await styletext(text);
      let teks = `Styles for ${text}\n\n`;
      
      for (let i of anu) {
        teks += `□ *${i.name}* : ${i.result}\n\n`;
      }
      
      reply(teks);
    } catch (error) {
      console.error(error);
      reply('*An error occurred while fetching fancy text styles.*');
    }
  }
},
 {
  command: ['take', 'wm', 'steal'],
  operate: async ({ Cypher, m, reply, args, pushname }) => {
    if (!m.quoted) return reply('Please reply to a sticker to add watermark or metadata.');

    try {
      let stick = args.join(" ").split("|");
      let packName = stick[0] && stick[0].trim() !== "" ? stick[0] : pushname || global.packname;
      let authorName = stick[1] ? stick[1].trim() : "";
      let mime = m.quoted.mimetype || '';
      if (!/webp/.test(mime)) return reply('Please reply to a sticker.');

      let stickerBuffer = await m.quoted.download();
      if (!stickerBuffer) return reply('Failed to download the sticker. Please try again.');

      let stickerWithExif = await addExif(stickerBuffer, packName, authorName);

      if (stickerWithExif) {
        await MARION.sendFile(
          m.chat,
          stickerWithExif,
          'sticker.webp',
          '',
          m,
          null,
          { mentions: [m.sender] }
        );
      } else {
        throw new Error('Failed to process the sticker with metadata.');
      }
    } catch (error) {
      console.error('Error in watermark/sticker metadata plugin:', error);
      reply('An error occurred while processing the sticker.');
    }
  }
},
 {
  command: ['tinyurl', 'shortlink'],
  operate: async ({ m, text, prefix, command, reply }) => {
    if (!text) return reply(`*Example: ${prefix + command} https://instagram.com/heyits_tylor*`);
    
    try {
      const response = await axios.get(`https://tinyurl.com/api-create.php?url=${text}`);
      reply(response.data);
    } catch (error) {
      console.error(error);
      reply('*An error occurred while shortening the URL.*');
    }
  }
},
 {
  command: ['toimage', 'toimg'],
  operate: async ({ MARION, m, reply, args, prefix, command }) => {
    const quoted = m.quoted || m.msg?.quoted;
    const mime = quoted?.mimetype || quoted?.msg?.mimetype;
    if (!quoted || !/webp/.test(mime)) {
      return reply(`*Send or reply to a sticker with the caption ${prefix + command}*`);
    }

    try {
      const media = await quoted.download();
      const inputPath = path.join(__dirname, getRandom('.webp'));
      fs.writeFileSync(inputPath, media);
      const outputPath = path.join(__dirname, getRandom('.png'));
      exec(`ffmpeg -i ${inputPath} ${outputPath}`, (err) => {
        fs.unlinkSync(inputPath); 

        if (err) {
          console.error('Error converting to image:', err);
          return reply('An error occurred while converting the sticker to an image.');
        }
        const buffer = fs.readFileSync(outputPath);
        MARION.sendMessage(m.chat, { image: buffer }, { quoted: m });    
        fs.unlinkSync(outputPath);
      });
    } catch (error) {
      console.error('Error converting to image:', error);
      reply('An error occurred while converting the sticker to an image.');
    }
  }
},
 {
  command: ['tourl', 'url'],
  operate: async ({ m, MARION, reply }) => {
    const quoted = m.quoted || m.msg?.quoted;
    const mime = quoted?.mimetype || quoted?.msg?.mimetype;

    if (!quoted || !mime) {
      return reply('*Please reply to a media message!*');
    }

    try {
      const mediaUrl = await handleMediaUpload(quoted, Cypher, mime);
      reply(`*Uploaded successfully:*\n${mediaUrl}`);
    } catch (error) {
      console.error(error);
      reply('*An error occurred while uploading the media.*');
    }
  }
},
  {
  command: ['translate', 'trt'],
  operate: async ({ m, args, prefix, command, reply }) => {
    const defaultLang = 'en'; // Default language for translation

    const usageGuide = `
🚀 *How to Use the Translate Command:*

📌 *Example 1:* Translate text from any language to English
   - Command: ${prefix}${command} en [Your Text Here]
   - Usage: ${prefix}${command} en Hello World

📌 *Example 2:* Translate text to a specific language
   - Command: ${prefix}${command} <language_code> [Your Text Here]
   - Usage: ${prefix}${command} fr Bonjour tout le monde

🌐 *Supported Languages:*
Explore the full list of supported languages at:
   https://cloud.google.com/translate/docs/languages

🛠 *Note:*
Ensure you use the correct language code for accurate translation.
`.trim();

    let lang = args[0]; 
    let text = args.slice(1).join(' ');

    const supportedLangs = [
      'af', 'ar', 'bg', 'bn', 'ca', 'cs', 'da', 'de', 'el', 'en', 'es', 'fa',
      'fi', 'fr', 'he', 'hi', 'hu', 'id', 'it', 'ja', 'ko', 'ms', 'nl', 'no',
      'pl', 'pt', 'ro', 'ru', 'sv', 'th', 'tr', 'uk', 'vi', 'zh'
    ];

    if (!supportedLangs.includes(lang)) {
      lang = defaultLang;
      text = args.join(' ');
    }
    if (!text && m.quoted && m.quoted.text) text = m.quoted.text;
    if (!text) return reply(usageGuide);

    try {
      const apiUrl = `https://api.siputzx.my.id/api/tools/translate?text=${encodeURIComponent(text)}&source=auto&target=${lang}`;

      const response = await fetch(apiUrl);
      const result = await response.json();

      if (!result.success) throw new Error('Translation failed.');

      reply(result.translatedText);

    } catch (error) {
      console.error('Translation Error:', error);
      reply('An error occurred while translating the text.');
    }
  }
},
 {
  command: ['vcc'],
  operate: async ({ m, reply, args }) => {
    const type = args[0] || 'MasterCard';
    const count = args[1] || 1;
    const apiUrl = `https://api.awan-attack.my.id/vcc-generator?type=${type}&count=${count}`;

    try {
      const response = await axios.get(apiUrl);

      if (response.data && response.data.data && response.data.data.length > 0) {
        let vccList = response.data.data.map((vcc, index) => {
          return `VCC ${index + 1}:\nCardholder Name: ${vcc.cardholderName}\nNumber: ${vcc.cardNumber}\nCVC: ${vcc.cvv}\nExpiration Date: ${vcc.expirationDate}`;
        }).join('\n\n');

        reply(`Here are the VCC(s) you requested:\n\n${vccList}\n\nExample of how to create a VCC:\n1. Visit the official website of the bank or VCC service provider.\n2. Choose the desired VCC type (e.g., MasterCard, Visa).\n3. Fill out the registration form with correct information.\n4. Wait for the VCC verification and activation process.\n\nAfter successfully activating the VCC, make sure to:\n- Store VCC data securely.\n- Use the VCC only for legitimate transactions.\n- Check the VCC balance regularly.`);
      } else {
        reply('Sorry, failed to retrieve VCC data or no data found.');
      }
    } catch (error) {
      console.error('Error fetching VCC data:', error);
      reply('Sorry, an error occurred while retrieving VCC data.');
    }
  }
},
];