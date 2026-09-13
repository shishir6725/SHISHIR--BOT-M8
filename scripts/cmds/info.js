const { getTime } = global.utils;
const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "info",
    version: "2.4.70",
    author: "ST | Sheikh Tamim",
    countDown: 20,
    role: 0,
    shortDescription: "Owner information command",
    longDescription: "This command provides detailed info about Sheikh Tamim — the bot owner, uptime, and social contacts.",
    category: "owner",
    guide: {}
  },

  onStart: async function ({ message }) {
    const authorName = "AH | 𝑺𝑯𝑰𝑺𝑯𝑰𝑹";
    const ownAge = "⫷ 17 Years Old ⫸";
    const messenger = "https://www.facebook.com/share/19STNvexB1/";
    const authorFB = "https://www.facebook.com/share/19STNvexB1/";
    const authorNumber = "+880174931×××26";
    const Status = "⫷ 💫 Keep Calm & Code On 💫 ⫸";

    const urls = [
      "https://i.ibb.co.com/B52s0L6G/2a3b08a991cb.jpg"
    ];
    const link = urls[Math.floor(Math.random() * urls.length)];

    const now = moment().tz('Asia/Dhaka');
    const date = now.format('MMMM Do YYYY');
    const time = now.format('h:mm:ss A');
    const uptime = process.uptime();
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const days = Math.floor(uptime / (60 * 60 * 24));
    const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    message.reply({
      body: `
╔═《✨ 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 ✨》═╗

⭓ 🤖 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲   : 『 ${global.GoatBot.config.nickNameBot} 』
⭓ ☄️ 𝗣𝗿𝗲𝗳𝗶𝘅        : 『 ${global.GoatBot.config.prefix} 』
⭓ ⚡ 𝗨𝗽𝘁𝗶𝗺𝗲        : 『 ${uptimeString} 』
⭓ 🗓️ 𝗗𝗮𝘁𝗲          : 『 ${date} 』
⭓ ⏰ 𝗧𝗶𝗺𝗲          : 『 ${time} 』
⭓ ✉️ 𝗖𝗼𝗻𝘁𝗮𝗰𝘁     : 『 ${messenger} 』

⭓ 👑 𝗢𝘄𝗻𝗲𝗿        : 『 ${authorName} 』
⭓ 🎂 𝗔𝗴𝗲          : 『 ${ownAge} 』
⭓ ❤️ 𝗦𝘁𝗮𝘁𝘂𝘀       : 『 ${Status} 』
⭓ 📱 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽    : 『 ${authorNumber} 』
⭓ 🌐 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸    : 『 ${authorFB} 』

╔═《🌍 𝗦𝗢𝗖𝗜𝗔𝗟𝗦》═╗
• 📺 YouTube    : ❝ @AhmeD'z_shi'shir ❞
• ✈️ Telegram  : @AhmeD'z shi'shir 
• 📷 Instagram : @Ahmed'z_shishir 5x
• 🧿 CapCut    : ❝ @shishir_Ahmed’s  ❞
• 🎵 TikTok     : ❝ @tiktok xudai na✅ ❞
╚════════════════════╝`,

      attachment: await global.utils.getStreamFromURL(link)
    });
  },

  onChat: async function ({ event, message }) {
    if (event.body && event.body.toLowerCase() === "info") {
      this.onStart({ message });
    }
  }
};
