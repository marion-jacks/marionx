const axios = require('axios');

const fetchReactionImage = async ({ Marion, m, reply, command }) => {
  try {
    const { data } = await axios.get(`https://api.waifu.pics/sfw/${command}`);
    await Marion.sendImageAsSticker(m.chat, data.url, m, {
      packname: global.packname,
      author: global.author,
    });
  } catch (error) {
    reply(`❌ Error fetching image: ${error.message}`);
  }
};

module.exports = [
  { command: ["8ball"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "8ball" }) },
  { command: ["avatar"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "avatar" }) },
  { command: ["awoo"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "awoo" }) },
  { command: ["bite"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "bite" }) },
  { command: ["blush"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "blush" }) },
  { command: ["bonk"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "bonk" }) },
  { command: ["bully"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "bully" }) },
  { command: ["cringe"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "cringe" }) },
  { command: ["cry"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "cry" }) },
  { command: ["cuddle"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "cuddle" }) },
  { command: ["dance"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "dance" }) },
  { command: ["feed"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "feed" }) },
  { command: ["foxgirl"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "foxgirl" }) },
  { command: ["gecg"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "gecg" }) },
  { command: ["glomp"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "glomp" }) },
  { command: ["goose"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "goose" }) },
  { command: ["handhold"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "handhold" }) },
  { command: ["happy"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "happy" }) },
  { command: ["highfive"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "highfive" }) },
  { command: ["hug"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "hug" }) },
  { command: ["kill"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "kill" }) },
  { command: ["kiss"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "kiss" }) },
  { command: ["lick"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "lick" }) },
  { command: ["lizard"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "lizard" }) },
  { command: ["meow"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "meow" }) },
  { command: ["nom"], operate: async (Marion) => fetchReactionImage({ ...Marion command: "nom" }) },
  { command: ["pat"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "pat" }) },
  { command: ["poke"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "poke" }) },
  { command: ["shinobu"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "shinobu" }) },
  { command: ["slap"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "slap" }) },
  { command: ["smile"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "smile" }) },
  { command: ["smug"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "smug" }) },
  { command: ["spank"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "spank" }) },
  { command: ["tickle"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "tickle" }) },
  { command: ["wave"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "wave" }) },
  { command: ["wink"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "wink" }) },
  { command: ["woof"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "woof" }) },
  { command: ["yeet"], operate: async (Marion) => fetchReactionImage({ ...Marion, command: "yeet" }) },
];