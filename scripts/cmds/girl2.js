const axios = require("axios");

module.exports = {
  config: {
    name: "girl2",
    version: "1.0",
    author: "Pratik Shah",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Send a random Girl video."
    },
    longDescription: {
      en: "Send a random Girl video."
    },
    category: "media",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {
    const videos = [
      "https://files.catbox.moe/ugjuht.mp4",
      "https://files.catbox.moe/b8aj8k.mp4",
      "https://files.catbox.moe/a4f94l.mp4",
      "https://files.catbox.moe/8hxuxd.mp4",
      "https://files.catbox.moe/kgr8pc.mp4",
      "https://files.catbox.moe/9cxhrw.mp4",
      "https://files.catbox.moe/un9sae.mp4",
      "https://files.catbox.moe/d6e0t1.mp4",
      "https://files.catbox.moe/g5tyb9.mp4",
      "https://files.catbox.moe/bt8i91.mp4",
      "https://files.catbox.moe/4bf6q7.mp4",
      "https://files.catbox.moe/aa5h8j.mp4",
      "https://files.catbox.moe/49siri.mp4",
      "https://files.catbox.moe/060i8c.mp4",
      "https://files.catbox.moe/tpek80.mp4",
      "https://files.catbox.moe/wyttha.mp4",
      "https://files.catbox.moe/d4tskt.mp4",
      "https://files.catbox.moe/8upcc8.mp4"
    ];

    try {
      const url = videos[Math.floor(Math.random() * videos.length)];
      
      const response = await axios({
        method: "GET",
        url: url,
        responseType: "stream"
      });

      return api.sendMessage(
        {
          body: "🌸 Random Girl Video 🎬",
          attachment: response.data
        },
        event.threadID,
        event.messageID
      );

    } catch (error) {
      console.error("Error sending Girl video:", error);

      return api.sendMessage(
        "❌ Couldn't load the video. Please try again.",
        event.threadID,
        event.messageID
      );
    }
  }
};
