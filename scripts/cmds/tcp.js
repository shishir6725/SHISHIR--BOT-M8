const fs = require('fs-extra');
const path = require('path');
const moment = require('moment-timezone');
const cron = require('node-cron');

const filePath = path.join(__dirname, 'cache', 'tcp_data.json');
const ADMIN_ID = "61590317176239";

const makeBold = (text) => {
  if (!text) return "";
  const fonts = {
    a: "𝐚", b: "𝐛", c: "𝐜", d: "𝐝", e: "𝐞", f: "𝐟", g: "𝐠", h: "𝐡", i: "𝐢", j: "𝐣", k: "𝐤", l: "𝐥", m: "𝐦",
    n: "𝐧", o: "𝐨", p: "𝐩", q: "𝐪", r: "𝐫", s: "𝐬", t: "𝐭", u: "𝐮", v: "𝐯", w: "𝐰", x: "𝐱", y: "𝐲", z: "𝐳",
    A: "𝐀", B: "𝐁", C: "𝐂", D: "𝐃", E: "𝐄", F: "𝐅", G: "𝐆", H: "𝐇", I: "𝐈", J: "𝐉", K: "𝐊", L: "𝐋", M: "𝐌",
    N: "𝐍", O: "𝐎", P: "𝐏", Q: "𝐐", R: "𝐑", S: "𝐒", T: "𝐓", U: "𝐔", V: "𝐕", W: "𝐖", X: "𝐗", Y: "𝐘", Z: "𝐙",
    "0": "𝟎", "1": "𝟏", "2": "𝟐", "3": "𝟑", "4": "𝟒", "5": "𝟓", "6": "𝟔", "7": "𝟕", "8": "𝟖", "9": "𝟗"
  };
  return text.split("").map(char => fonts[char] || char).join("");
};

module.exports = {
  config: {
    name: "tcp",
    version: "1.4",
    author: "Mr.King",
    role: 1,
    shortDescription: { en: "Auto love captions with custom list" },
    category: "automation",
    guide: { en: "{pn} add | {pn} remove | {pn} list | {pn} add all (Owner Only)" }
  },

  onLoad: async function ({ api }) {
    if (!fs.existsSync(filePath)) {
      fs.ensureDirSync(path.join(__dirname, 'cache'));
      fs.writeJsonSync(filePath, { activeGroups: [] });
    }

    cron.schedule('0 * * * *', async () => {
      const data = fs.readJsonSync(filePath);
      const activeGroups = data.activeGroups;
      if (activeGroups.length === 0) return;

      const captions = [
        "গল্পটা তখনই ভালো ছিলো 😊🌸\nযখন তুমি ছিলে অপরিচিত আর আমি ছিলাম আমার আমিতে সীমাবদ্ধ༄༎•🙂🖤🦋",
        "হয়তো তুমি আমার ভাগ্যেই ছিলে না, 🥀✨\nতাই তো এতোটা ভালোবেসেও তোমাকে পেলাম না! ༄༎•🙂🖤🦋",
        "প্রিয়জন মানেই তো মায়ার বাঁধন, 💞💫\nযা সহজে ভোলা যায় না কোনোদিনও! ༄༎•🙂🖤🦋",
        "ভালোবেসে আগলে রাখার নামই হলো বন্ধুত্ব, 🕊️💖\nআর সেই বন্ধু যদি হয় জীবনসঙ্গী, তবেই পূর্ণতা! ༄༎•🙂🖤🦋",
        "অভিমান তো তারাই করে যারা বেশি ভালোবাসে, ✨🎈\nআর সহ্য তারাই করে যারা মায়ার টানে আটকে থাকে! ༄༎•🙂🖤🦋",
        "কাউকে খুব বেশি মায়ায় জড়িয়ে ফেলাটা এক ধরণের অপরাধ, 🥀\nকারণ সেই মানুষটা চলে গেলে জীবনটা স্থবির হয়ে পড়ে! ༄༎•🙂🖤🦋",
        "খুব সাধারণ আমি, আর অসাধারণ আমার ভালোবাসা 💫\nজেনো শুধু তোমাকেই চায় আমার এই মন! ༄༎•🙂🖤🦋",
        "যে মানুষটা তোমাকে হারানোর ভয়ে কাঁদে, 😢\nজেনো সে তোমাকে সবচেয়ে বেশি ভালোবাসে! ༄༎•🙂🖤🦋",
        "ইচ্ছেগুলো সব তোমায় ঘিরে, ডানা মেলে ওড়ে অবুঝ মনে 🕊️\nসারাক্ষণ শুধু তোমায় দেখার নেশা জাগে! ༄༎•🙂🖤🦋",
        "স্মৃতিগুলো আজও অমলিন, শুধু মানুষটা বদলে গেছে সময়ের টানে! ⏳🍂 ༄༎•🙂🖤🦋",
        "মাঝে মাঝে মনে হয় তুমি আমার সব, আবার পরক্ষণেই মনে হয় তুমি আমার কিছুই নও! 💔 ༄༎•🙂🖤🦋",
        "ভালোবাসা মানে শুধু হাত ধরা নয়, ভালোবাসা মানে বিপদেও পাশে থাকা! 🤝💞 ༄༎•🙂🖤🦋",
        "একটু হাসি, একটু কথা, আর অনেকগুলো স্বপ্ন ✨\nসবটুকুই শুধু তোমায় নিয়ে সাজানো! ༄༎•🙂🖤🦋",
        "তুমি আমার সেই সুন্দর কবিতা, যা আমি প্রতিদিন নতুন করে পড়তে চাই! 📖💖 ༄༎•🙂🖤🦋",
        "দূরত্ব কখনো ভালোবাসা কমায় না, বরং মনের টান আরও বাড়িয়ে দেয়! 🛤️💞 ༄༎•🙂🖤🦋",
        "অভিমানী এই মন শুধু তোমার একটুখানি মায়া চায়! 🥺🌸 ༄༎•🙂🖤🦋",
        "হাজারো মানুষের ভিড়েও আমি শুধু তোমার চোখ দুটোই খুঁজি! 👀✨ ༄༎•🙂🖤🦋",
        "রাতের ওই চাঁদের মতো তুমিও আমার অন্ধকার জীবনের আলো! 🌕💖 ༄༎•🙂🖤🦋",
        "তুমি হীনা প্রতিটি মুহূর্ত যেন এক একটা যুগের সমান! ⏳🥀 ༄༎•🙂🖤🦋",
        "হয়তো কোনো এক বিকেলে আবার দেখা হবে আমাদের সেই চেনা পথে! 🌇🚶‍♂️ ༄༎•🙂🖤🦋",
        "তোমার চোখের ভাষায় আমি নিজেকে হারিয়ে ফেলি! 👁️💞 ༄༎•🙂🖤🦋",
        "ভালোবাসা হলো সেই অনুভূতি যা হৃদয়ে গভীরে গেঁথে থাকে! 💓✨ ༄༎•🙂🖤🦋",
        "তুমি পাশে থাকলে পৃথিবীটা যেন স্বর্গ মনে হয়! 🌍🕊️ ༄༎•🙂🖤🦋",
        "অভিমান বেশিদিন থাকে না, ভালোবাসাটাই শেষ পর্যন্ত জেতে! 💘🦋 ༄༎•🙂🖤🦋",
        "তুমি আমার কাছে সেই আকাশের মতো, যার শেষ নেই! 🌌💖 ༄༎•🙂🖤🦋",
        "আমাদের গল্পটা হয়তো অসম্পূর্ণ, কিন্তু অনুভূতিগুলো চিরন্তন! ✍️🍂 ༄༎•🙂🖤🦋",
        "তোমার হাসিতেই আমার দিনের শুরু আর শেষ! 😊🌅 ༄༎•🙂🖤🦋",
        "ভালোবাসার কোনো নির্দিষ্ট ভাষা নেই, শুধু হৃদয়ের টানই যথেষ্ট! 💟✨ ༄༎•🙂🖤🦋",
        "কিছু কথা না বলাই ভালো, চোখের ভাষাই সব বলে দেয়! 😶👀 ༄༎•🙂🖤🦋",
        "তুমি ছাড়া আমার প্রতিটি সেকেন্ড বড্ড একা! ⏳🥀 ༄༎•🙂🖤🦋",
        "মায়া বড় কঠিন এক জিনিস, সহজে কাটে না! ⛓️💞 ༄༎•🙂🖤🦋",
        "হয়তো এটাই ভালোবাসা, যখন তুমি শুধু তার সুখেই সুখী! 😊✨ ༄༎•🙂🖤🦋",
        "স্মৃতির পাতায় আজও তুমি ধ্রুবতারার মতো উজ্জ্বল! 🌟💖 ༄༎•🙂🖤🦋",
        "তুমি আমার সেই সকালের প্রথম আলো! ☀️🕊️ ༄༎•🙂🖤🦋",
        "এক মুঠো ভালোবাসা তোমাকে দিলাম, আগলে রেখো! 🎁💞 ༄༎•🙂🖤🦋",
        " স্বপ্ন দেখাও অপরাধ নয়, যদি সেটা তোমায় কেন্দ্র করে হয়! 🌙💫 ༄༎•🙂🖤🦋",
        "তোমার জন্য আজও আমার মন অস্থির হয়ে ওঠে! 💓🌿 ༄༎•🙂🖤🦋",
        "ভালোবাসা মানে একে অপরের পরিপূরক হওয়া! 💑✨ ༄༎•🙂🖤🦋",
        "কিছু মানুষ হৃদয়ে চিরস্থায়ী জায়গা করে নেয়! 🔑❤️ ༄༎•🙂🖤🦋",
        "তুমি আমার সেই অগোছালো জীবনের সুন্দর গুছানো অংশ! 🧩💖 ༄༎•🙂🖤🦋",
        "অভিমানগুলো সব জমা থাক, ভালোবাসার দিনে সব ধুয়ে যাবে! 🌧️💗 ༄༎•🙂🖤🦋",
        "তুমি আমার সেই শান্ত নদীর তীর! 🌊💞 ༄༎•🙂🖤🦋",
        "স্মৃতির ভিড়ে আজও তোমায় খুঁজি! 🧐🍂 ༄༎•🙂🖤🦋",
        "ভালোবাসা তো একদিনের নয়, সারাজীবনের অঙ্গীকার! 💍✨ ༄༎•🙂🖤🦋",
        "তোমার ওই দুষ্টু হাসিটাই আমার সব দুর্বলতা! 😈💖 ༄༎•🙂🖤🦋",
        "তুমি হীনা পৃথিবীটা যেন বর্ণহীন! 🎨🥀 ༄༎•🙂🖤🦋",
        "তোমার প্রতিটি কথায় আমার মনের শান্তি! 🗣️💫 ༄༎•🙂🖤🦋",
        "তুমি আমার সেই প্রিয় গান, যা বারবার শুনি! 🎶🖤 ༄༎•🙂🖤🦋",
        "স্বপ্ন দেখি তোমায় নিয়ে, বাস্তবতা দেখি তোমায় ছাড়া! 🌃💔 ༄༎•🙂🖤🦋",
        "তুমি আমার বিশ্বাসের সবচেয়ে নিরাপদ আশ্রয়! 🏠💖 ༄༎•🙂🖤🦋",
        "ভালোবাসা কখনো মরে না, শুধু রূপ বদলায়! 🦋✨ ༄༎•🙂🖤🦋",
        "একটু সময় দাও, ভালোবাসাটা বুঝতে শিখবে! ⏳💞 ༄༎•🙂🖤🦋",
        "তোমার অস্তিত্বই আমার বেঁচে থাকার কারণ! 🍃💖 ༄༎•🙂🖤🦋",
        "অভিমানের আড়ালে লুকিয়ে থাকে অনেক ভালোবাসা! 🤫❤️ ༄༎•🙂🖤🦋",
        "তুমি আমার সেই হারিয়ে যাওয়া গল্প! 📖🥀 ༄༎•🙂🖤🦋",
        "ভালোবাসার মানুষটার একটু হাসিই যথেষ্ট! 😊✨ ༄༎•🙂🖤🦋",
        "তুমি আমার সেই নীল আকাশের মেঘ! ☁️💙 ༄༎•🙂🖤🦋",
        "সব গল্প শেষ হয় না, কিছু গল্প হৃদয়ে বেঁচে থাকে! 💌🖤 ༄༎•🙂🖤🦋",
        "তোমার হাতটা ধরে সারাজীবন চলতে চাই! 🤝💫 ༄༎•🙂🖤🦋",
        "তুমিই আমার সবটুকু ভালোবাসা, সবটুকু আবেগ! 💖🔥 ༄༎•🙂🖤🦋"
      ];

      const time = moment.tz("Asia/Dhaka").format("hh:mm A");
      const randomCaption = captions[Math.floor(Math.random() * captions.length)];
      const botName = "『 MISS_QUEEN 👑』☁️🫧";
      const creditText = makeBold("MADE BY SHISHIR ");

      const message = `•—»🩷 𝐓𝐈𝐌𝐄  "${time}" 🩷«—•\n\n✢━━━━━━━━━━━━━━━✢\n\n—-༄༎🖤༎ྂ•——༄༎•${randomCaption}\n\n✢━━━━━━━━━━━━━━━✢\n⃝—͟͟͞͞ ${botName}\n\n👑 ${creditText}`;

      for (const threadID of activeGroups) {
        api.sendMessage(message, threadID).catch(() => {});
      }
    }, { scheduled: true, timezone: "Asia/Dhaka" });
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, senderID, messageID } = event;
    const data = fs.readJsonSync(filePath);
    
    let threadInfo;
    try {
      threadInfo = await api.getThreadInfo(threadID);
    } catch (e) {
      threadInfo = { adminIDs: [] };
    }
    
    const isAdmin = threadInfo.adminIDs.some(i => i.id === senderID) || senderID === ADMIN_ID;

    if (!isAdmin) return api.sendMessage("🚫 𝐒𝐨𝐫𝐫𝐲, 𝐎𝐧𝐥𝐲 𝐀𝐝𝐦𝐢𝐧𝐬 𝐜𝐚𝐧 𝐮𝐬𝐞 𝐭𝐡𝐢𝐬!", threadID, messageID);

    const action = args[0] ? args[0].toLowerCase() : "";

    // 🛠️ /tcp add all মেকানিজম (শুধুমাত্র বসের জন্য)
    if (action === "add" && args[1] && args[1].toLowerCase() === "all") {
      if (senderID !== ADMIN_ID) return api.sendMessage("🚫 𝐎𝐧𝐥𝐲 𝐭𝐡𝐞 𝐌𝐚𝐢𝐧 𝐎𝐰𝐧𝐞𝐫 𝐜𝐚𝐧 𝐚𝐝𝐝 𝐚𝐥𝐥 𝐠𝐫𝐨𝐮𝐩𝐬!", threadID, messageID);
      
      try {
        const threadList = await api.getThreadList(100, null, ["INBOX"]);
        const groupThreads = threadList.filter(t => t.isGroup === true);
        
        let addedCount = 0;
        for (const thread of groupThreads) {
          if (!data.activeGroups.includes(thread.threadID)) {
            data.activeGroups.push(thread.threadID);
            addedCount++;
          }
        }
        
        fs.writeJsonSync(filePath, data);
        return api.sendMessage(`✅ Successfully activated TCP in all available groups! Total ${addedCount} new groups added.`, threadID, messageID);
      } catch (err) {
        console.error(err);
        return api.sendMessage("❌ Failed to fetch group list. Try again later.", threadID, messageID);
      }
    }

    if (action === "add") {
      if (data.activeGroups.includes(threadID)) return api.sendMessage("⚠️ 𝐓𝐂𝐏 𝐚𝐥𝐫𝐞𝐚𝐝𝐲 𝐚𝐜𝐭𝐢𝐯𝐞!", threadID, messageID);
      data.activeGroups.push(threadID);
      fs.writeJsonSync(filePath, data);
      return api.sendMessage("✅ 𝐓𝐂𝐏 𝐒𝐲𝐬𝐭𝐞𝐦 𝐞𝐧𝐚𝐛𝐥𝐞𝐝!", threadID, messageID);
    } 
    
    if (action === "remove") {
      data.activeGroups = data.activeGroups.filter(id => id !== threadID);
      fs.writeJsonSync(filePath, data);
      return api.sendMessage("❌ 𝐓𝐂𝐏 𝐒𝐲𝐬𝐭𝐞𝐦 𝐝𝐢𝐬𝐚𝐛𝐥𝐞𝐝!", threadID, messageID);
    }

    if (action === "list") {
      if (data.activeGroups.length === 0) return api.sendMessage("🚫 𝐍𝐨 𝐚𝐜𝐭𝐢𝐯𝐞 𝐠𝐫𝐨𝐮𝐩𝐬 𝐟𝐨𝐮𝐧𝐝.", threadID, messageID);
      
      let listMsg = "💞 𝐀𝐒𝐒𝐀𝐋𝐀𝐌𝐔𝐀𝐋𝐀𝐈𝐊𝐔𝐌 🕊\n\n";
      for (const tID of data.activeGroups) {
        let name = "𝐔𝐧𝐤𝐧𝐨𝐰𝐧";
        try {
          const info = await api.getThreadInfo(tID);
          name = info.threadName || '𝐔𝐧𝐤𝐧𝐨𝐰𝐧';
        } catch (e) {}
        listMsg += `𝐆𝐫𝐨𝐮𝐩 𝐍𝐚𝐦𝐞: ${name} 🕊💖\n🇺🇮🇩: ${tID}\n\n`;
      }
      
      const session = moment.tz("Asia/Dhaka").format("HH") < 12 ? "𝐌𝐨𝐫𝐧𝐢𝐧𝐠 🌄" : "𝐀𝐟𝐭𝐞𝐫𝐧𝐨𝐨𝐧 🏜";
      listMsg += `𝐇𝐄𝐑𝐄 𝐈𝐒 𝐘𝐎𝐔Ｒ 𝐓𝐂𝐏 𝐀𝐃𝐃𝐄𝐃 𝐆𝐑𝐎𝐔𝐏 𝐋𝐈𝐒𝐓\n\n𝐇𝐚𝐯𝐞 𝐚 𝐧𝐢𝐜𝐞 ${session}\n⚠ 𝐏... 𝐟𝐨𝐥𝐥𝐨𝐰 𝐚𝐥𝐥 𝐫𝐮𝐥𝐞𝐬 ♻\n\n𝐀𝐝𝐦𝐢𝐧: 𝐌𝐫.𝐊𝐢𝐧𝐠\n𝐅🇧: 𝐓𝐀𝐖𝐇𝐈𝐃 𝐈𝐒𝐋𝐀𝐌`;
      
      return api.sendMessage(listMsg, threadID, messageID);
    }

    return api.sendMessage("𝐈𝐧𝐯𝐚𝐥𝐢𝐝! 𝐔𝐬𝐞: /tcp add | /tcp remove | /tcp list | /tcp add all", threadID, messageID);
  }
};
