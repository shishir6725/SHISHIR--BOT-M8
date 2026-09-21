const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "khairul",
    aliases: ["kinfo", "k"],
    version: "5.0",
    author: "SHISHIR",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Khairul Profile + Media"
    },
    longDescription: {
      en: "Khairul info, photo and video"
    },
    category: "info",
    guide: {
      en: "{pn} | {pn} photo | {pn} video"
    }
  },

  onStart: async function ({ message, args }) {

    // 🖼️ PHOTO LINKS
    const photos = [
      // এখানে ছবির সরাসরি লিংক যোগ করো
    ];

    // 🎬 VIDEO LINKS
    const videos = [
      "https://i.imgur.com/aYcFqkJ.mp4"
    ];

    const type = args[0]?.toLowerCase();

    // 🎬 VIDEO SYSTEM
    if (type === "video" || type === "vid") {
      if (videos.length === 0) {
        return message.reply(
          "╭━━〔 🎬 𝗞𝗛𝗔𝗜𝗥𝗨𝗟 𝗩𝗜𝗗𝗘𝗢 〕━━╮\n" +
          "┃ ⚠️ কোনো ভিডিও নেই!\n" +
          "╰━━━━━━━━━━━━━━━━━━━━╯"
        );
      }

      const videoURL =
        videos[Math.floor(Math.random() * videos.length)];

      const cacheDir = path.join(__dirname, "cache");
      const cachePath = path.join(
        cacheDir,
        "khairul_video.mp4"
      );

      try {
        await fs.ensureDir(cacheDir);

        const response = await axios({
          method: "GET",
          url: videoURL,
          responseType: "arraybuffer",
          timeout: 60000,
          maxContentLength: 50 * 1024 * 1024
        });

        await fs.writeFile(cachePath, response.data);

        return message.reply({
          body: `
╭━━〔 🎬 𝗞𝗛𝗔𝗜𝗥𝗨𝗟 𝗩𝗜𝗗𝗘𝗢 〕━━╮
┃ 🕷️ 𝗡𝗡--- Sᴘɪᴅᴇʀ
┃ ⚡ 𝗦𝗛𝗜𝗦𝗛𝗜𝗥 𝗦𝗧𝗬𝗟𝗘
╰━━━━━━━━━━━━━━━━━━━━╯`,
          attachment: fs.createReadStream(cachePath)
        });

      } catch (error) {
        console.error("Khairul Video Error:", error.message);
        return message.reply(
          "❌ ভিডিও লোড হয়নি!\n" +
          "🔗 লিংক অথবা সার্ভারে সমস্যা হতে পারে।"
        );
      }
    }

    // 🖼️ PHOTO SYSTEM
    if (type === "photo" || type === "pic") {
      if (photos.length === 0) {
        return message.reply(
          "🖼️ কোনো ছবি অ্যাড করা নেই!\n" +
          "Khairul.js-এ ছবির লিংক যোগ করো।"
        );
      }

      const photoURL =
        photos[Math.floor(Math.random() * photos.length)];

      const cacheDir = path.join(__dirname, "cache");
      const cachePath = path.join(
        cacheDir,
        "khairul_photo.jpg"
      );

      try {
        await fs.ensureDir(cacheDir);

        const response = await axios({
          method: "GET",
          url: photoURL,
          responseType: "arraybuffer",
          timeout: 30000
        });

        await fs.writeFile(cachePath, response.data);

        return message.reply({
          body: "🖼️ 𝗞𝗛𝗔𝗜𝗥𝗨𝗟 𝗣𝗛𝗢𝗧𝗢\n\n⚡ 𝗠𝗔𝗗𝗘 𝗕𝗬 𝗦𝗛𝗜𝗦𝗛𝗜𝗥",
          attachment: fs.createReadStream(cachePath)
        });

      } catch (error) {
        console.error("Khairul Photo Error:", error.message);
        return message.reply("❌ ছবি লোড করতে সমস্যা হয়েছে!");
      }
    }

    // 👤 KHairul INFO
    const profile = `
╭━━━━━━━〔 🕷️ 𝗞𝗛𝗔𝗜𝗥𝗨𝗟 〕━━━━━━━╮
┃
┃ 𓆩👤𓆪 𝗡𝗔𝗠𝗘
┃    ➤ 「 Ꮶʜᴀɪʀᴜʟ 」
┃
┃ 𓆩🌐𓆪 𝗙𝗥𝗢𝗠
┃    ➤ 🇧🇩 Bᴀʀɪsʜᴀʟ
┃
┃ 𓆩🎂𓆪 𝗔𝗚𝗘
┃    ➤ 18+
┃
┃ 𓆩🎓𓆪 𝗪𝗢𝗥𝗞
┃    ➤ Sᴛᴜᴅᴇɴᴛ 📘
┃
┃ 𓆩☪️𓆪 𝗥𝗘𝗟𝗜𝗚𝗜𝗢𝗡
┃    ➤ Mᴜsʟɪᴍ 🕋
┃
┃ 𓆩💼𓆪 𝗙𝗨𝗧𝗨𝗥𝗘
┃    ➤ Bᴜsɪɴᴇssᴍᴀɴ 💎
┃
┃ 𓆩💛𓆪 𝗦𝗧𝗔𝗧𝗨𝗦
┃    ➤ 🌸
┃
╠══════════════════════════╣
┃ 🕷️ NN--- Sᴘɪᴅᴇʀ 🕷️
┃          𝟲𝗧𝟵 🌪️
╠══════════════════════════╣
┃ 🤍 𝗔𝗟𝗛𝗔𝗠𝗗𝗨𝗟𝗜𝗟𝗟𝗔𝗛
┃    𝗙𝗢𝗥 𝗘𝗩𝗘𝗥𝗬𝗧𝗛𝗜𝗡𝗚
╠══════════════════════════╣
┃ ⚡ 𝗠𝗔𝗗𝗘 𝗕𝗬 𝗦𝗛𝗜𝗦𝗛𝗜𝗥
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`;

    return message.reply(profile);
  }
};
