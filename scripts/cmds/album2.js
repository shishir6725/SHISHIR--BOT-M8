const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseApiUrl = async () => {
  const res = await axios.get(
    "https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json"
  );
  return res.data.mahmud;
};

module.exports = {
  config: {
    name: "album2",
    version: "2.0",
    author: "SHISHIR",
    role: 0,
    category: "media",
    guide: {
      en:
        "{p}{n} [page]\n" +
        "{p}{n} list"
    }
  },

  onStart: async function ({ api, event, args }) {
    const displayNames = [
      "𝐅𝐮𝐧𝐧𝐲 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐒𝐚𝐝 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐀𝐧𝐢𝐦𝐞 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐋𝐨𝐅𝐈 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐀𝐭𝐭𝐢𝐭𝐮𝐝𝐞 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐂𝐨𝐮𝐩𝐥𝐞 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐂𝐚𝐫 𝐄𝐝𝐢𝐭 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐁𝐢𝐤𝐞 𝐄𝐝𝐢𝐭 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐋𝐨𝐯𝐞 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐋𝐲𝐫𝐢𝐜𝐬 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐂𝐚𝐭 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐌𝐞𝐦𝐞 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐅𝐨𝐨𝐭𝐛𝐚𝐥𝐥 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐁𝐚𝐛𝐲 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐅𝐫𝐢𝐞𝐧𝐝𝐬 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐌𝐨𝐧𝐞𝐲 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐅𝐥𝐨𝐰𝐞𝐫 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐍𝐚𝐫𝐮𝐭𝐨 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐃𝐫𝐚𝐠𝐨𝐧 𝐁𝐚𝐥𝐥 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐁𝐥𝐞𝐚𝐜𝐡 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐃𝐞𝐦𝐨𝐧 𝐒𝐥𝐚𝐲𝐞𝐫 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐉𝐮𝐣𝐮𝐭𝐬𝐮 𝐊𝐚𝐢𝐬𝐞𝐧 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐒𝐨𝐥𝐨 𝐋𝐞𝐯𝐞𝐥𝐢𝐧𝐠 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐓𝐨𝐤𝐲𝐨 𝐑𝐞𝐯𝐞𝐧𝐠𝐞𝐫𝐬 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐁𝐥𝐮𝐞 𝐋𝐨𝐜𝐤 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐂𝐡𝐚𝐢𝐧𝐬𝐚𝐰 𝐌𝐚𝐧 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐃𝐞𝐚𝐭𝐡 𝐍𝐨𝐭𝐞 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐎𝐧𝐞 𝐏𝐢𝐞𝐜𝐞 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐀𝐭𝐭𝐚𝐜𝐤 𝐨𝐧 𝐓𝐢𝐭𝐚𝐧 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐒𝐚𝐤𝐚𝐦𝐨𝐭𝐨 𝐃𝐚𝐲𝐬 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐖𝐢𝐧𝐝 𝐁𝐫𝐞𝐚𝐤𝐞𝐫 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐎𝐧𝐞 𝐏𝐮𝐧𝐜𝐡 𝐌𝐚𝐧 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐀𝐥𝐲𝐚 𝐑𝐮𝐬𝐬𝐢𝐚𝐧 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐁𝐥𝐮𝐞 𝐁𝐨𝐱 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐇𝐮𝐧𝐭𝐞𝐫 𝐱 𝐇𝐮𝐧𝐭𝐞𝐫 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐍𝐞𝐲𝐦𝐚𝐫 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐌𝐞𝐬𝐬𝐢 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐑𝐨𝐧𝐚𝐥𝐝𝐨 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐕𝐢𝐧𝐢 𝐉𝐫 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐌𝐛𝐚𝐩𝐩𝐞 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐘𝐚𝐦𝐚𝐥 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐑𝐚𝐩𝐢𝐧𝐡𝐚 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐃𝐲𝐛𝐚𝐥𝐚 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐏𝐞𝐥𝐞 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐌𝐚𝐫𝐚𝐝𝐨𝐧𝐚 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐅𝐫𝐞𝐞 𝐅𝐢𝐫𝐞 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐏𝐔𝐁𝐆 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐂𝐚𝐥𝐥 𝐨𝐟 𝐃𝐮𝐭𝐲 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐌𝐢𝐧𝐞𝐜𝐫𝐚𝐟𝐭 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐆𝐓𝐀 𝐕𝐢𝐝𝐞𝐨 🎀",
      "𝐆𝐞𝐧𝐬𝐡𝐢𝐧 𝐈𝐦𝐩𝐚𝐜𝐭 🎀"
    ];

    const categories = [
      "funny", "islamic", "sad", "anime", "lofi",
      "attitude", "couple", "car", "bike", "love",
      "lyrics", "cat", "meme", "football", "baby",
      "friend", "money", "flower", "naruto", "dragon",
      "bleach", "demon", "jjk", "solo", "tokyo",
      "bluelock", "cman", "deathnote", "onepiece", "attack",
      "sakamoto", "wind", "onepman", "alya", "bluebox",
      "hunter", "neymar", "messi", "ronaldo", "vini",
      "mbappe", "yamal", "rapinha", "dybala", "pele",
      "maradona", "freefire", "pubg", "cod", "minecraft",
      "gta", "genshin"
    ];

    const captions = categories.map(
      (cat) => `𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 ${cat.toUpperCase()} 𝐕𝐢𝐝𝐞𝐨 🎀`
    );

    if (args[0] === "list") {
      const apiUrl = await baseApiUrl();

      try {
        const res = await axios.get(
          `${apiUrl}/api/album/mahmud/list`
        );

        return api.sendMessage(
          res.data.message,
          event.threadID,
          event.messageID
        );
      } catch (e) {
        return api.sendMessage(
          `❌ Error: ${e.message}`,
          event.threadID,
          event.messageID
        );
      }
    }

    const itemsPerPage = 10;
    const page = Math.max(parseInt(args[0]) || 1, 1);
    const totalPages = Math.ceil(categories.length / itemsPerPage);

    if (page > totalPages) {
      return api.sendMessage(
        `❌ Invalid page!\nPlease choose 1 - ${totalPages}.`,
        event.threadID,
        event.messageID
      );
    }

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const message =
      `╭───〔 𝐒𝐇𝐈𝐒𝐇𝐈𝐑 𝐀𝐋𝐁𝐔𝐌 〕───╮\n` +
      displayNames
        .slice(start, end)
        .map((name, i) => `${start + i + 1}. ${name}`)
        .join("\n") +
      `\n╰────────────────────╯\n` +
      `📄 𝐏𝐚𝐠𝐞: [${page}/${totalPages}]\n` +
      (page < totalPages
        ? `➡️ 𝐑𝐞𝐩𝐥𝐲 ${page + 1} 𝐟𝐨𝐫 𝐧𝐞𝐱𝐭 𝐩𝐚𝐠𝐞`
        : `✨ 𝐋𝐚𝐬𝐭 𝐏𝐚𝐠𝐞`);

    api.sendMessage(message, event.threadID, (err, info) => {
      if (err) return;

      global.GoatBot.onReply.set(info.messageID, {
        commandName: this.config.name,
        messageID: info.messageID,
        author: event.senderID,
        categories,
        captions,
        page,
        start
      });
    }, event.messageID);
  },

  onReply: async function ({ api, event, Reply }) {
    api.unsendMessage(Reply.messageID);

    const number = parseInt(event.body);

    if (
      isNaN(number) ||
      number < 1 ||
      number > Reply.categories.length
    ) {
      return api.sendMessage(
        "❌ Please reply with a valid category number.",
        event.threadID,
        event.messageID
      );
    }

    const category = Reply.categories[number - 1];
    const caption = Reply.captions[number - 1];

    try {
      const apiUrl = await baseApiUrl();

      const res = await axios.get(
        `${apiUrl}/api/album/mahmud/videos/${category}?userID=${event.senderID}`
      );

      if (!res.data.success) {
        return api.sendMessage(
          res.data.message || "❌ No video found.",
          event.threadID,
          event.messageID
        );
      }

      const videos = res.data.videos;

      if (!Array.isArray(videos) || videos.length === 0) {
        return api.sendMessage(
          "❌ | 𝐍𝐨 𝐯𝐢𝐝𝐞𝐨 𝐟𝐨𝐮𝐧𝐝.",
          event.threadID,
          event.messageID
        );
      }

      const videoUrl =
        videos[Math.floor(Math.random() * videos.length)];

      const filePath = path.join(
        __dirname,
        `album2_${event.senderID}_${Date.now()}.mp4`
      );

      const response = await axios({
        method: "GET",
        url: videoUrl,
        responseType: "stream",
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      });

      const writer = fs.createWriteStream(filePath);

      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      api.sendMessage(
        {
          body: `╭──〔 𝐒𝐇𝐈𝐒𝐇𝐈𝐑 𝐁𝐎𝐓 〕──╮\n${caption}\n╰──────────────╯`,
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        () => {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        },
        event.messageID
      );

    } catch (error) {
      return api.sendMessage(
        `❌ | 𝐕𝐢𝐝𝐞𝐨 𝐬𝐞𝐧𝐝 𝐟𝐚𝐢𝐥𝐞𝐝.\n\n${error.message}`,
        event.threadID,
        event.messageID
      );
    }
  }
};
