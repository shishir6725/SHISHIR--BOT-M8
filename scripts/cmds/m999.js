const axios = require("axios");

module.exports = {
  config: {
    name: "m999",
    version: "1.0",
    author: "SHISHIR",
    countDown: 5,
    role: 0,

    shortDescription: {
      en: "Send a random video"
    },

    longDescription: {
      en: "Send a random video from your custom video list"
    },

    category: "media",

    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {

    // ═══════════════════════════════════════
    // 🎬 ADD YOUR VIDEOS HERE
    // ═══════════════════════════════════════

    const videos = [
       "https://i.imgur.com/LjuTYec.mp4",
      "https://i.imgur.com/wEP8CxL.mp4",
      "https://i.imgur.com/zSp8uYS.mp4",

      // উপরের মতো যত খুশি ভিডিও লিংক যোগ করতে পারো
    ];

    // ═══════════════════════════════════════
    // ❌ NO VIDEO CHECK
    // ═══════════════════════════════════════

    if (videos.length === 0) {
      return api.sendMessage(
        "❌ M999 এ এখনো কোনো ভিডিও যোগ করা হয়নি!\n\n" +
        "📌 M999.js ফাইলে videos[] এর মধ্যে ভিডিও লিংক যোগ করো।",
        event.threadID,
        event.messageID
      );
    }

    // ═══════════════════════════════════════
    // 🎲 RANDOM VIDEO
    // ═══════════════════════════════════════

    const randomIndex = Math.floor(Math.random() * videos.length);
    const videoUrl = videos[randomIndex];

    try {

      const response = await axios.get(videoUrl, {
        responseType: "stream",
        timeout: 30000
      });

      // ═══════════════════════════════════════
      // 📤 SEND VIDEO
      // ═══════════════════════════════════════

      return api.sendMessage(
        {
          body:
            "╭━━━〔 𝐌𝟗𝟗𝟗 〕━━━╮\n" +
            "┃ 🎬 𝐑𝐀𝐍𝐃𝐎𝐌 𝐕𝐈𝐃𝐄𝐎\n" +
            "┃\n" +
            "┃ 🤖 𝐒𝐇𝐈𝐒𝐇𝐈𝐑 𝐁𝐎𝐓\n" +
            "╰━━━━━━━━━━━━━━━━╯",

          attachment: response.data
        },

        event.threadID,
        event.messageID
      );

    } catch (error) {

      console.error(
        "❌ M999 VIDEO ERROR:",
        error.message
      );

      return api.sendMessage(
        "⚠️ ভিডিও লোড করা যায়নি!\n" +
        "🔄 অন্য ভিডিও দিয়ে আবার চেষ্টা করো।",
        event.threadID,
        event.messageID
      );
    }
  }
};
