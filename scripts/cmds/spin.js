"use strict";

const MAX_BET = 20000000; // 20M
const MAX_SPINS = 30;
const COOLDOWN_MS = 3 * 60 * 60 * 1000;
const WIN_CHANCE = 0.35;

const ITEMS = ["💠", "🔷", "🔮", "✨", "🌙", "⭐", "💎"];

const SPIN_FRAMES = 4;
const SPIN_DELAY_MS = 450;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function todayKey() {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Dhaka"
  });
}

function fmt(num) {
  num = Number(num) || 0;

  if (num >= 1e9)
    return "$" + (num / 1e9).toFixed(2).replace(/\.00$/, "") + "B";

  if (num >= 1e6)
    return "$" + (num / 1e6).toFixed(2).replace(/\.00$/, "") + "M";

  if (num >= 1e3)
    return "$" + (num / 1e3).toFixed(2).replace(/\.00$/, "") + "K";

  return "$" + num.toLocaleString();
}

function randomRow() {
  return Array.from(
    { length: 5 },
    () => ITEMS[Math.floor(Math.random() * ITEMS.length)]
  );
}

function spinFrameText(row) {
  return `╭━━━〔 𝑨𝒀-𝑴𝑨 𝑺𝑷𝑰𝑵 〕━━━╮
┃
┃  ${row.join("  ┃  ")}
┃
╰━━━━━━━━━━━━━━━━━━╯

⟡ 𝑺𝑷𝑰𝑵𝑵𝑰𝑵𝑮... ⟡`;
}

function parseAmount(input) {
  if (typeof input !== "string") return Number(input);

  input = input.trim().toLowerCase();

  const unit = input.slice(-1);
  const value = parseFloat(input);

  if (isNaN(value)) return NaN;

  if (unit === "k") return value * 1000;
  if (unit === "m") return value * 1000000;
  if (unit === "b") return value * 1000000000;

  return value;
}

function buildReel(tier) {
  const shuffled = [...ITEMS].sort(() => Math.random() - 0.5);
  const main = shuffled[0];

  const other = () => {
    let symbol;

    do {
      symbol = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    } while (symbol === main);

    return symbol;
  };

  if (tier === "jackpot")
    return [main, main, main, main, main];

  if (tier === "quad") {
    const arr = [main, main, main, main, other()];

    return Math.random() < 0.5
      ? arr
      : [arr[4], arr[0], arr[1], arr[2], arr[3]];
  }

  if (tier === "triple") {
    const start = Math.floor(Math.random() * 3);
    const arr = new Array(5).fill(null);

    for (let i = 0; i < 3; i++)
      arr[start + i] = main;

    for (let i = 0; i < 5; i++) {
      if (arr[i] === null)
        arr[i] = other();
    }

    return arr;
  }

  if (tier === "twoPair") {
    const patterns = [
      [0, 1, 3, 4],
      [0, 1, 2, 3],
      [1, 2, 3, 4]
    ];

    const [a, b, c, d] =
      patterns[Math.floor(Math.random() * patterns.length)];

    const secondary = other();
    const arr = new Array(5).fill(null);

    arr[a] = main;
    arr[b] = main;
    arr[c] = secondary;
    arr[d] = secondary;

    for (let i = 0; i < 5; i++) {
      if (arr[i] === null)
        arr[i] = other();
    }

    return arr;
  }

  if (tier === "onePair") {
    const patterns = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [0, 4]
    ];

    const [a, b] =
      patterns[Math.floor(Math.random() * patterns.length)];

    const arr = new Array(5).fill(null);

    arr[a] = main;
    arr[b] = main;

    for (let i = 0; i < 5; i++) {
      if (arr[i] === null)
        arr[i] = other();
    }

    return arr;
  }

  return shuffled.slice(0, 5);
}

function getResult() {
  if (Math.random() > WIN_CHANCE) {
    return {
      tier: "loss",
      multiplier: 0,
      text: "『 𝑳𝑶𝑺𝑺 』"
    };
  }

  const roll = Math.random();

  if (roll < 0.03) {
    return {
      tier: "jackpot",
      multiplier: 10,
      text: "『 👑 𝑱𝑨𝑪𝑲𝑷𝑶𝑻 』"
    };
  }

  if (roll < 0.10) {
    return {
      tier: "quad",
      multiplier: 5,
      text: "『 💎 𝑸𝑼𝑨𝑫 𝑾𝑰𝑵 』"
    };
  }

  if (roll < 0.25) {
    return {
      tier: "triple",
      multiplier: 3,
      text: "『 🔥 𝑻𝑹𝑰𝑷𝑳𝑬 𝑾𝑰𝑵 』"
    };
  }

  if (roll < 0.55) {
    return {
      tier: "twoPair",
      multiplier: 2,
      text: "『 ✨ 𝑻𝑾𝑶 𝑷𝑨𝑰𝑹 』"
    };
  }

  return {
    tier: "onePair",
    multiplier: 1.5,
    text: "『 🔷 𝑷𝑨𝑰𝑹 𝑾𝑰𝑵 』"
  };
}

module.exports = {
  config: {
    name: "spin",
    version: "6.0.0",
    author: "𝑺𝑯𝑰𝑺𝑯𝑰𝑹",
    countDown: 5,
    role: 0,
    category: "Game",
    shortDescription: "𝑨𝒀-𝑴𝑨 𝑺𝑷𝑰𝑵",
    longDescription: "𝑺𝒕𝒚𝒍𝒊𝒔𝒉 𝑪𝒓𝒚𝒔𝒕𝒂𝒍 𝑺𝒑𝒊𝒏 𝑮𝒂𝒎𝒆",
    guide: "{pn} <amount>"
  },

  onStart: async function ({
    args,
    message,
    event,
    usersData
  }) {
    try {
      const { senderID } = event;

      if (!args[0]) {
        return message.reply(
          `╭━━━〔 𝑨𝒀-𝑴𝑨 𝑺𝑷𝑰𝑵 〕━━━╮

❌ 𝑨𝒎𝒐𝒖𝒏𝒕 𝑫𝒊𝒏

💰 Example: !spin 10k
💎 Maximum: 20M

╰━━━━━━━━━━━━━━━━━━╯`
        );
      }

      const amount = parseAmount(args[0]);

      if (!Number.isFinite(amount) || amount <= 0) {
        return message.reply(
          "❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝑨𝒎𝒐𝒖𝒏𝒕!"
        );
      }

      if (amount > MAX_BET) {
        return message.reply(
          `🚫 𝑴𝑨𝑿 𝑩𝑬𝑻: 20M`
        );
      }

      const userData = await usersData.get(senderID);

      if (!userData) {
        return message.reply("❌ 𝑼𝒔𝒆𝒓 𝑫𝒂𝒕𝒂 𝑵𝒐𝒕 𝑭𝒐𝒖𝒏𝒅!");
      }

      const balance = Number(userData.money) || 0;

      if (amount > balance) {
        return message.reply(
          `╭━━〔 𝑩𝑨𝑳𝑨𝑵𝑪𝑬 〕━━╮

❌ 𝑵𝒐𝒕 𝑬𝒏𝒐𝒖𝒈𝒉 𝑴𝒐𝒏𝒆𝒚!

💰 𝑩𝒂𝒍𝒂𝒏𝒄𝒆: ${fmt(balance)}
🎯 𝑩𝒆𝒕: ${fmt(amount)}

╰━━━━━━━━━━━━━━╯`
        );
      }

      if (!userData.data)
        userData.data = {};

      if (!userData.data.slotInfo) {
        userData.data.slotInfo = {
          count: 0,
          lastTime: Date.now()
        };
      }

      let count =
        Number(userData.data.slotInfo.count) || 0;

      let lastTime =
        Number(userData.data.slotInfo.lastTime) ||
        Date.now();

      const now = Date.now();

      if (now - lastTime >= COOLDOWN_MS) {
        count = 0;
        lastTime = now;
      }

      if (count >= MAX_SPINS) {
        const remaining =
          COOLDOWN_MS - (now - lastTime);

        const hours = Math.floor(
          remaining / (60 * 60 * 1000)
        );

        const minutes = Math.floor(
          (remaining % (60 * 60 * 1000)) /
          (60 * 1000)
        );

        return message.reply(
          `⛔ 𝑺𝑷𝑰𝑵 𝑳𝑰𝑴𝑰𝑻 𝑹𝑬𝑨𝑪𝑯𝑬𝑫

🎰 𝑳𝒊𝒎𝒊𝒕: ${MAX_SPINS}
⏳ 𝑹𝒆𝒔𝒆𝒕: ${hours}h ${minutes}m`
        );
      }

      // Deduct bet
      userData.money = balance - amount;

      userData.data.slotInfo = {
        count: count + 1,
        lastTime
      };

      await usersData.set(senderID, {
        money: userData.money,
        data: userData.data
      });

      // ONE MESSAGE ONLY
      const sent = await message.reply(
        spinFrameText(randomRow())
      );

      // Edit same message
      for (let i = 0; i < SPIN_FRAMES; i++) {
        await sleep(SPIN_DELAY_MS);

        try {
          await message.edit(
            spinFrameText(randomRow()),
            sent.messageID
          );
        } catch (e) {
          // নতুন SMS পাঠাবে না
        }
      }

      const result = getResult();
      const finalRow = buildReel(result.tier);

      const winAmount =
        Math.floor(amount * result.multiplier);

      let finalBalance =
        balance - amount;

      if (result.multiplier > 0)
        finalBalance += winAmount;

      userData.money = finalBalance;

      if (
        !userData.data.slotStats ||
        userData.data.slotStats.date !== todayKey()
      ) {
        userData.data.slotStats = {
          date: todayKey(),
          wonTotal: 0,
          lostTotal: 0
        };
      }

      if (result.multiplier > 0) {
        userData.data.slotStats.wonTotal += winAmount;
      } else {
        userData.data.slotStats.lostTotal += amount;
      }

      await usersData.set(senderID, {
        money: userData.money,
        data: userData.data
      });

      const resultText =
        result.multiplier > 0
          ? `🎉 ${result.text}
💰 𝑾𝒊𝒏: +${fmt(winAmount)}
📈 𝑴𝒖𝒍𝒕𝒊𝒑𝒍𝒊𝒆𝒓: ${result.multiplier}x`
          : `💔 ${result.text}
💸 𝑳𝒐𝒔𝒕: -${fmt(amount)}`;

      const finalText =
        `╭━━━〔 𝑨𝒀-𝑴𝑨 𝑺𝑷𝑰𝑵 〕━━━╮

┃  ${finalRow.join("  ┃  ")}  ┃

${resultText}

💳 𝑩𝒂𝒍𝒂𝒏𝒄𝒆: ${fmt(finalBalance)}
🎰 𝑺𝒑𝒊𝒏: ${count + 1}/${MAX_SPINS}

╰━━〔 𝑺𝑯𝑰𝑺𝑯𝑰𝑹 〕━━╯`;

      // শুধু আগের message edit হবে
      try {
        await message.edit(
          finalText,
          sent.messageID
        );
      } catch (e) {
        console.error("SPIN EDIT ERROR:", e);
      }

    } catch (error) {
      console.error("SPIN ERROR:", error);
    }
  }
};
