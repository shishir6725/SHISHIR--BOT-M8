const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "info",
    version: "2.4.72",
    author: "AH | 𝑺𝑯𝑰𝑺𝑯𝑰𝑹",
    countDown: 20,
    role: 0,
    shortDescription: "Owner information command",
    longDescription: "Owner, bot and social information",
    category: "owner",
    guide: {}
  },

  onStart: async function ({ message }) {

    const authorName = "亗 𝑺𝑯𝑰𝑺𝑯𝑰𝑹 亗";
    const ownAge = "『 𝟏𝟕 𝐘𝐞𝐚𝐫𝐬 𝐎𝐥𝐝 』";
    const messenger = "https://www.facebook.com/share/19STNvexB1/";
    const authorFB = "https://www.facebook.com/share/19STNvexB1/";
    const authorNumber = "+𝟖𝟖𝟎𝟏𝟕𝟒𝟗𝟑𝟏×××𝟐𝟔";
    const Status = "『 💫 𝑲𝒆𝒆𝒑 𝑪𝒂𝒍𝒎 & 𝑪𝒐𝒅𝒆 𝑶𝒏 💫 』";

    const imageURL =
      "https://i.ibb.co.com/B52s0L6G/2a3b08a991cb.jpg";

    // 🇧🇩 Bangladesh Time
    const now = moment().tz("Asia/Dhaka");
    const date = now.format("MMMM Do YYYY");
    const time = now.format("h:mm:ss A");

    // ⚡ Bot Uptime
    const uptime = process.uptime();

    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / 3600) % 24);
    const days = Math.floor(uptime / 86400);

    const uptimeString =
      `${days}𝒅 ${hours}𝒉 ${minutes}𝒎 ${seconds}𝒔`;

    message.reply({
      body: `
╭━━━〔 ✦ 𝑺𝑯𝑰𝑺𝑯𝑰𝑹 ✦ 〕━━━╮
┃   𝑶𝑾𝑵𝑬𝑹 𝑰𝑵𝑭𝑶𝑹𝑴𝑨𝑻𝑰𝑶𝑵
╰━━━━━━━━━━━━━━━━━━━━╯

╭─〔 🤖 𝑩𝑶𝑻 𝑰𝑵𝑭𝑶 〕─╮
│
│ ✧ 𝐁𝐨𝐭 𝐍𝐚𝐦𝐞
│   ➥ 『 ${global.GoatBot.config.nickNameBot} 』
│
│ ✧ 𝐏𝐫𝐞𝐟𝐢𝐱
│   ➥ 『 ${global.GoatBot.config.prefix} 』
│
│ ✧ 𝐔𝐩𝐭𝐢𝐦𝐞
│   ➥ 『 ${uptimeString} 』
│
│ ✧ 𝐃𝐚𝐭𝐞
│   ➥ 『 ${date} 』
│
│ ✧ 𝐓𝐢𝐦𝐞
│   ➥ 『 ${time} 』
│
╰────────────────────╯

╭─〔 👑 𝑶𝑾𝑵𝑬𝑹 〕─╮
│
│ ✦ 𝐍𝐚𝐦𝐞
│   ➥ 『 ${authorName} 』
│
│ ✦ 𝐀𝐠𝐞
│   ➥ ${ownAge}
│
│ ✦ 𝐒𝐭𝐚𝐭𝐮𝐬
│   ➥ ${Status}
│
│ ✦ 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩
│   ➥ 『 ${authorNumber} 』
│
│ ✦ 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤
│   ➥ 『 ${authorFB} 』
│
╰────────────────────╯

╭─〔 🌐 𝑺𝑶𝑪𝑰𝑨𝑳𝑺 〕─╮
│
│ 📺 𝐘𝐨𝐮𝐓𝐮𝐛𝐞
│   ➥ ❝ @AhmeD'z_shi'shir ❞
│
│ ✈️ 𝐓𝐞𝐥𝐞𝐠𝐫𝐚𝐦
│   ➥ ❝ @AhmeD'z shi'shir ❞
│
│ 📷 𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦
│   ➥ ❝ @Ahmed'z_shishir 5x ❞
│
│ 🧿 𝐂𝐚𝐩𝐂𝐮𝐭
│   ➥ ❝ @shishir_Ahmed’s ❞
│
│ 🎵 𝐓𝐢𝐤𝐓𝐨𝐤
│   ➥ ❝ @tiktok xudai na✅ ❞
│
╰────────────────────╯

╭─〔 ✉️ 𝑪𝑶𝑵𝑻𝑨𝑪𝑻 〕─╮
│
│ ➥ ${messenger}
│
╰────────────────────╯

╔═══════〔 亗 𝑺𝑯𝑰𝑺𝑯𝑰𝑹 亗 〕═══════╗
║       𝑲𝑬𝑬𝑷 𝑪𝑨𝑳𝑴 • 𝑪𝑶𝑫𝑬 𝑶𝑵       ║
╚══════════════════════════════╝
`,

      attachment:
        await global.utils.getStreamFromURL(imageURL)
    });
  }
};

এবার পুরোটা কপি করে "info.js"-এ বসিয়ে দাও। "onChat" আলাদা করে যোগ করবে না।
