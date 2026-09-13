"use strict";

const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "intro",
    version: "2.1.0",
    author: "SHISHIR",
    countDown: 10,
    role: 0,
    shortDescription: "SHISHIR Owner Intro",
    longDescription: "Shows SHISHIR owner information with video.",
    category: "information",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message }) {

    // =========================
    // 👑 OWNER INFORMATION
    // =========================

    const ownerName = "『 𝑺𝑯𝑰𝑺𝑯𝑰𝑹 』";
    const age = "『 17+ 』";
    const location = "『 Sirajganj, Bangladesh 🇧🇩 』";
    const education = "『 Inter 1st Year 』";
    const status = "『 💫 Keep Calm & Code On 💫 』";

    // =========================
    // 🌐 SOCIAL INFORMATION
    // =========================

    const facebook = "https://www.facebook.com/share/1DQZJheRLc/";
    const messenger = "m.me/";
    const whatsapp = "017493--26";

    // =========================
    // 🎥 VIDEO URL
    // ⚠️ Must be a direct MP4 link
    // =========================

    const videoURL =
      "https://i.imgur.com/xsTxSRI.mp4";

    // =========================
    // 🕐 DATE & TIME
    // =========================

    const now = moment().tz("Asia/Dhaka");

    const date = now.format("DD MMMM YYYY");
    const time = now.format("hh:mm:ss A");

    // =========================
    // ⏱️ BOT UPTIME
    // =========================

    const uptime = process.uptime();

    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const uptimeString =
      `${days}d ${hours}h ${minutes}m ${seconds}s`;

    // =========================
    // 🤖 BOT INFORMATION
    // =========================

    const botName =
      global.GoatBot?.config?.nickNameBot ||
      "SHISHIR - AI - BOT";

    const prefix =
      global.GoatBot?.config?.prefix ||
      "!";

    // =========================
    // 💬 INTRO MESSAGE
    // =========================

    const body = `
╭━━━〔 👑 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗧𝗥𝗢 〕━━━╮

┃ 🤖 𝗕𝗼𝘁      : 『 ${botName} 』
┃ ⚡ 𝗣𝗿𝗲𝗳𝗶𝘅   : 『 ${prefix} 』
┃ ⏱️ 𝗨𝗽𝘁𝗶𝗺𝗲   : 『 ${uptimeString} 』
┃ 📅 𝗗𝗮𝘁𝗲     : 『 ${date} 』
┃ 🕐 𝗧𝗶𝗺𝗲     : 『 ${time} 』

╰━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 👑 𝗢𝗪𝗡𝗘𝗥 〕━━━╮

┃ 👤 𝗡𝗮𝗺𝗲      : ${ownerName}
┃ 🎂 𝗔𝗴𝗲       : ${age}
┃ 📍 𝗟𝗼𝗰𝗮𝘁𝗶𝗼𝗻  : ${location}
┃ 🎓 𝗘𝗱𝘂𝗰𝗮𝘁𝗶𝗼𝗻 : ${education}
┃ ❤️ 𝗦𝘁𝗮𝘁𝘂𝘀     : ${status}

╰━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 🌐 𝗦𝗢𝗖𝗜𝗔𝗟 〕━━━╮

┃ 📘 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸  : ${facebook}
┃ 💬 𝗠𝗲𝘀𝘀𝗲𝗻𝗴𝗲𝗿 : ${messenger}
┃ 📱 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽  : ${whatsapp}

╰━━━━━━━━━━━━━━━━━━━━╯

        ⚡ 𝑺𝑯𝑰𝑺𝑯𝑰𝑹 - 𝑨𝑰 - 𝑩𝑶𝑻 ⚡
        🇧🇩 𝗙𝗿𝗼𝗺 𝗕𝗮𝗻𝗴𝗹𝗮𝗱𝗲𝘀𝗵 🇧🇩
`;

    try {

      // 🎥 Get video stream
      const video =
        await global.utils.getStreamFromURL(videoURL);

      return message.reply({
        body: body,
        attachment: video
      });

    } catch (error) {

      console.error("INTRO VIDEO ERROR:", error);

      return message.reply(body);
    }
  },

  onChat: async function ({ event, message }) {

    if (!event.body) return;

    const text =
      event.body.trim().toLowerCase();

    if (text === "intro" || text === "info") {
      return module.exports.onStart({ message });
    }
  }
};
