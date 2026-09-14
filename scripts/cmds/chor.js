"use strict";

const { createCanvas, loadImage } = global.nodemodule["canvas"];
const request = global.nodemodule["node-superfetch"];
const jimp = global.nodemodule["jimp"];
const fs = global.nodemodule["fs-extra"];

module.exports = {
  config: {
    name: "chor",
    version: "1.0.2",
    author: "Joshua Sy",
    countDown: 5,
    role: 0,
    shortDescription: "Scooby Doo template meme",
    longDescription: "Create a Scooby Doo style meme with the user's profile picture.",
    category: "image",
    guide: {
      en: "{pn} অথবা {pn} @mention"
    }
  },

  circle: async function (image) {
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
  },

  onStart: async function ({ event, message, api }) {
    const cacheDir = __dirname + "/cache";

    try {
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const id = Object.keys(event.mentions || {})[0] || event.senderID;

      const canvas = createCanvas(500, 670);
      const ctx = canvas.getContext("2d");

      const background = await loadImage(
        "https://i.imgur.com/ES28alv.png"
      );

      let avatar = await request.get(
        `https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
      );

      avatar = await module.exports.circle(avatar.body);

      ctx.drawImage(
        background,
        0,
        0,
        canvas.width,
        canvas.height
      );

      ctx.drawImage(
        await loadImage(avatar),
        48,
        410,
        111,
        111
      );

      const imageBuffer = canvas.toBuffer();
      const output = cacheDir + `/chor_${Date.now()}.jpg`;

      fs.writeFileSync(output, imageBuffer);

      api.sendMessage(
        {
          body:
`╭──────•◈•───────╮
 𝗜𝘀𝗹𝗮𝗺𝗶𝗰𝗸 𝗖𝗵𝗮𝘁 𝗕𝗼𝘁

মুরগির দুধ চুরি করতে গিয়া ধরা থাইসে_ 🐸👻

🤖 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 — 𝗦𝗛𝗜𝗦𝗛𝗜𝗥
╰──────•◈•───────╯`,
          attachment: fs.createReadStream(output)
        },
        event.threadID,
        () => {
          if (fs.existsSync(output)) {
            fs.unlinkSync(output);
          }
        },
        event.messageID
      );

    } catch (error) {
      console.error("CHOR ERROR:", error);

      api.sendMessage(
        "❌ Chor command এ সমস্যা হয়েছে!\n\n" +
        error.message,
        event.threadID,
        event.messageID
      );
    }
  }
};
