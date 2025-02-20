const fetch = require('node-fetch');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const { fromBuffer } = require('file-type');
const path = require('path');


const SESSION_FILE = path.join(__dirname, '../../src/gemini.json');

const loadSession = () => {
    if (!fs.existsSync(SESSION_FILE)) {
        fs.writeFileSync(SESSION_FILE, JSON.stringify({}), 'utf-8')
    }
    return JSON.parse(fs.readFileSync(SESSION_FILE, 'utf-8'));
};
const saveSession = (data) => {
    fs.writeFileSync(SESSION_FILE, JSON.stringify(data, null, 2));
};

module.exports = [
{
  command: ['bardai', 'bard'],
  operate: async ({ m, reply, text }) => {
    if (!text) return reply("*Please ask a question*");

    try {
      let response = await fetch(`https://restapi.apibotwa.biz.id/api/bard?message=${encodeURIComponent(text)}`);
      let data = await response.json();

      if (response.status !== 200 || !data.result || data.result.length === 0) {
        return reply("*Please try again later or try another command!*");
      } else {
        reply(data.result[0]); // Extract the first message from the result array
      }
    } catch (error) {
      console.error('Error fetching response from Bard API:', error);
      reply("An error occurred while fetching the response from Bard API.");
    }
  }
},
 {
  command: ['bingai', 'bing'],
  operate: async ({ m, reply, text }) => {
    if (!text) return reply("*Please ask a question*");

    try {
      let response = await fetch(`https://api.tioo.eu.org/bingai?text=${encodeURIComponent(text)}`);
      let data = await response.json();

      if (!data.result) {
        return reply("*Please try again later or try another command!*");
      } else {
        reply(data.result);
      }
    } catch (error) {
      console.error('Error fetching response from Bing AI API:', error);
      reply("An error occurred while fetching the response from Bing AI API.");
    }
  }
},
 {
  command: ['blackbox'],
  operate: async ({ m, reply, text }) => {
    if (!text) return reply("*Please ask a question*");

    try {
      let response = await fetch(`https://api.siputzx.my.id/api/ai/blackboxai?content=${encodeURIComponent(text)}`);
      let data = await response.json();

      if (response.status !== 200 || !data.status || !data.data) {
        return reply("*Please try again later or try another command!*");
      } else {
        reply(data.data);
      }
    } catch (error) {
      console.error('Error fetching response from BlackboxAI API:', error);
      reply("An error occurred while fetching the response from BlackboxAI API.");
    }
  }
},
{
  command: ['dalle'],
  operate: async ({ MARION, m, reply, text }) => {
    if (!text) return reply("*Please enter a query!*");

    const apiUrl = `https://api.siputzx.my.id/api/ai/stable-diffusion?prompt=${encodeURIComponent(text)}`;
    try {
      await MARION.sendMessage(m.chat, { image: { url: apiUrl } }, { quoted: m });
    } catch (error) {
      console.error('Error generating image:', error);
      reply("*An error occurred while generating the image.*");
    }
  }
},
{
  command: ['gemini'],
  operate: async ({ m, reply, text }) => {
    if (!text) return reply("*Please ask a question*");

    try {
      let response = await fetch(`https://bk9.fun/ai/gemini?q=${encodeURIComponent(text)}`);
      let data = await response.json();

      if (response.status !== 200 || !data.status || !data.BK9) {
        return reply("*Please try again later or try another command!*");
      } else {
        reply(data.BK9);
      }
    } catch (error) {
      console.error('Error fetching response from Gemini AI API:', error);
      reply("An error occurred while fetching the response from Gemini AI API.");
    }
  }
},
  {
    command: ['gemini2'],
    operate: async ({ reply, m, text, mime }) => {
        if (!text) return reply('Please ask a question');
        
        try {
            const geminiData = loadSession();
            const userId = m.sender;

            if (!geminiData[userId]) {
                geminiData[userId] = [];
            }
            
            text += ' (Reply in English)';

            const formData = new FormData();

            if (m.quoted && m.quoted.mimetype && /image|video|audio|application\/pdf/.test(m.quoted.mimetype)) {
                let media = await m.quoted.download();
                const { ext } = await fromBuffer(media);
                const filename = `./tmp/file_${Date.now()}.${ext}`;
                fs.writeFileSync(filename, media);

                formData.append('content', text);
                formData.append('model', 'gemini-1.5-flash');
                formData.append('userId', userId);
                formData.append('file', fs.createReadStream(filename));

                const { data } = await axios.post('https://hydrooo.web.id/', formData, {
                    headers: { ...formData.getHeaders() }
                });

                fs.unlinkSync(filename);
                reply(data.result);
            } else {
                formData.append('content', text);
                formData.append('model', 'gemini-1.5-flash');
                formData.append('userId', userId);

                const { data } = await axios.post('https://hydrooo.web.id/', formData, {
                    headers: { ...formData.getHeaders() }
                });

                geminiData[userId].push({ query: text, response: data.result });
                saveSession(geminiData);

                reply(data.result);
            }
        } catch (err) {
            console.error(err);
            reply('An error occurred!');
        }
    }
},
 {
  command: ['generate'],
  operate: async ({ MARION, m, reply, text, prefix, command }) => {
    if (!text) return reply(`*Please provide a query to generate an image!*`);

    const api3Url = `https://api.gurusensei.workers.dev/dream?prompt=${encodeURIComponent(text)}`;
    try {
      await MARION.sendMessage(m.chat, { image: { url: api3Url } }, { quoted: m });
    } catch (error) {
      console.error('Error generating image:', error);
      reply("*An error occurred while generating the image.*");
    }
  }
},
{
  command: ['gpt'],
  operate: async ({ reply, m, text }) => {
    async function fetchGPTResponse(query) {
      const response = await axios.get(`https://xploader-api.vercel.app/gpt-3.5?prompt=${encodeURIComponent(query)}`);
      return response.data;
    }

    try {
      if (!text) return reply('*Please ask a question*');
      const result = await fetchGPTResponse(text);
      reply(result.message);
    } catch (error) {
      console.error('Error in GPT plugin:', error);
      reply('An error occurred!');
    }
  }
},
{
  command: ['gpt2'],
  operate: async ({ m, reply, text }) => {
    if (!text) return reply("*Please ask a question*");

    try {
      let response = await fetch(`https://bk9.fun/ai/jeeves-chat?q=${encodeURIComponent(text)}`);
      let data = await response.json();

      if (!data.BK9) {
        return reply("*Please try again later or try another command!*");
      } else {
        reply(data.BK9);
      }
    } catch (error) {
      console.error('Error fetching response from GPT-2 API:', error);
      reply("An error occurred while fetching the response from GPT-2 API.");
    }
  }
},
 {
  command: ['imagen'],
  operate: async ({ MARION, m, reply, text, prefix, command }) => {
    if (!text) return reply(`*Please provide a query to generate an image!*`);

    const api2Url = `https://bk9.fun/ai/magicstudio?prompt=${encodeURIComponent(text)}`;
    try {
      await MARION.sendMessage(m.chat, { image: { url: api2Url } }, { quoted: m });
    } catch (error) {
      console.error('Error generating image:', error);
      reply("*An error occurred while generating the image.*");
    }
  }
},
  {
  command: ['llama'],
  operate: async ({ m, reply, text }) => {
    if (!text) return reply("*Please ask a question*");

    try {
      let response = await fetch(`https://bk9.fun/ai/llama?q=${encodeURIComponent(text)}`);
      let data = await response.json();

      if (!data.BK9) {
        return reply("*Please try again later or try another command!*");
      } else {
        reply(data.BK9);
      }
    } catch (error) {
      console.error('Error fetching response from Llama API:', error);
      reply("An error occurred while fetching the response from Llama API.");
    }
  }
},
{
  command: ['metaai'],
  operate: async ({ m, reply, text }) => {
    if (!text) return reply("*Please provide a prompt*");

    try {
      let response = await fetch(`https://xploader-api.vercel.app/metaai?prompt=${encodeURIComponent(text)}`);
      let data = await response.json();

      if (response.status !== 200 || !data.prompt) {
        return reply("*Please try again later or try another command!*");
      } else {
        reply(data.prompt);
      }
    } catch (error) {
      console.error('Error fetching response from MetaAI API:', error);
      reply("An error occurred while fetching the response from MetaAI API.");
    }
  }
},
  {
  command: ['openai', 'ai'],
  operate: async ({ m, reply, text }) => {
    if (!text) return reply("*Please ask a question*");

    try {
      let response = await fetch(`https://restapi.apibotwa.biz.id/api/openai?message=${encodeURIComponent(text)}`);
      let data = await response.json();

      if (response.status !== 200 || !data.data || !data.data.response) {
        return reply("*Please try again later or try another command!*");
      } else {
        reply(data.data.response);
      }
    } catch (error) {
      console.error('Error fetching response from OpenAI API:', error);
      reply("An error occurred while fetching the response from OpenAI API.");
    }
  }
},
  {
  command: ['photoai'],
  operate: async ({ MARION, m, reply, text, prefix, command }) => {
    if (!text) return reply(`*Please provide a query to generate an image!*`);

    const apiUrl = `https://api.tioo.eu.org/dalle?text=${encodeURIComponent(text)}`;
    try {
      await MARION.sendMessage(m.chat, { image: { url: apiUrl } }, { quoted: m });
    } catch (error) {
      console.error('Error generating image:', error);
      reply("An error occurred while generating the image.");
    }
  }
},
  {
  command: ['simi'],
  operate: async ({ m, reply, text }) => {
    if (!text) return reply("*Please ask a question*");

    try {
      let response = await fetch(`https://api.tioo.eu.org/simi?text=${encodeURIComponent(text)}`);
      let data = await response.json();

      if (!data.result) {
        return reply("*Please try again later or try another command!*");
      } else {
        reply(data.result);
      }
    } catch (error) {
      console.error('Error fetching response from Simi API:', error);
      reply("An error occurred while fetching the response from Simi API.");
    }
  }
},
  {
  command: ['turbo'],
  operate: async ({ m, reply, text }) => {
    if (!text) return reply("*Please ask a question*");

    try {
      let response = await fetch(`https://api.tioo.eu.org/lepton?text=${encodeURIComponent(text)}`);
      let data = await response.json();

      if (!data.result) {
        return reply("*Please try again later or try another command!*");
      } else {
        reply(data.result);
      }
    } catch (error) {
      console.error('Error fetching response from Turbo API:', error);
      reply("An error occurred while fetching the response from Turbo API.");
    }
  }
 }
];