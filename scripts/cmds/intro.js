const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports = {
  config: {
    name: "intro",
    aliases: ["info"],
    version: "1.3.0",
    author: "Anik Islam Sadik",
    role: 0,
    shortDescription: "Owner information with image",
    category: "Information",
    guide: {
      en: "owner"
    }
  },

  onStart: async function ({ api, event }) {
    const ownerText = 
`╭─ 👑 Oᴡɴᴇʀ Iɴғᴏ 👑 ─╮
│ 👤 Nᴀᴍᴇ       : 𝑆𝐻𝐼𝑆𝐻𝐼𝑅
│ 🦋 Nɪᴄᴋ       : YOUR ABBu
│ 🎂 Aɢᴇ        : 𝟭7+
│ 💘 Rᴇʟᴀᴛɪᴏɴ : 𝗦𝗶𝗻𝗴𝗲𝗹
│ 🎓 Pʀᴏғᴇssɪᴏɴ : 𝗦𝘁𝘂𝗱𝗲𝗻𝘁
│ 📚 Eᴅᴜᴄᴀᴛɪᴏɴ : 𝗜𝗻𝘁𝗲𝗿 1𝗻𝗱
│ 🏡 Lᴏᴄᴀᴛɪᴏɴ : sɪʀᴀᴊɢᴀɴᴊ
├─ 🔗 Cᴏɴᴛᴀᴄᴛ ─╮
│ 📘 Facebook  :  id=61592841571046
│ 💬 Messenger: id=61592841571046
│ 📞 WhatsApp  : 017493--26
╰────────────────╯`;

    const cacheDir = path.join(__dirname, "cache");
    const imgPath = path.join(cacheDir, "intro.jpg");

    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const imgLink = "https://i.imgur.com/gyVwtoC.gif";

    const send = () => {
      api.sendMessage(
        {
          body: ownerText,
          attachment: fs.createReadStream(imgPath)
        },
        event.threadID,
        () => fs.unlinkSync(imgPath),
        event.messageID
      );
    };

    request(encodeURI(imgLink))
      .pipe(fs.createWriteStream(imgPath))
      .on("close", send)
  }
};
