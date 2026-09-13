"use strict";

const MAX_BET = 20000000; // 20M
const MAX_SPINS = 30;
const COOLDOWN_MS = 3 * 60 * 60 * 1000; // 3 hours
const WIN_CHANCE = 0.35; // 35% win

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
  return (
    "╭━━━『 𝑨𝒀-𝑴𝑨 𝑺𝑷𝑰𝑵 』━━━╮\n" +
    "┃\n" +
    `┃  ${row.join(" ┃ ")}\n` +
    "┃\n" +
    "┃ 🔮 𝑺𝒑𝒊𝒏𝒏𝒊𝒏𝒈...\n" +
    "┃\n" +
    "╰━━━━━━━━━━━━━━━━━━╯"
  );
}

async function getDailyStats(usersData, uid) {
  const userData = (await usersData.get(uid)) || {};
  const stats = userData.data?.slotStats;

  if (!stats || stats.date !== todayKey()) {
    return {
      date: todayKey(),
      wonTotal: 0,
      lostTotal: 0
    };
  }

  return stats;
}

async function saveDailyStats(usersData, uid, stats) {
  const userData = (await usersData.get(uid)) || {};

  if (!userData.data)
    userData.data = {};

  userData.data.slotStats = stats;

  await usersData.set(uid, {
    data: userData.data
  });
}

function buildReel(tier) {
  const shuffled = [...ITEMS].sort(() => Math.random() - 0.5);
  const main = shuffled[0];

  const other = () => {
    let s;

    do {
      s = shuffled[Math.floor(Math.random() * shuffled.length)];
    } while (s === main);

    return s;
  };

  if (tier === "jackpot") {
    return [main, main, main, main, main];
  }

  if (tier === "quad") {
    const arr = [main, main, main, main, other()];

    return Math.random() < 0.5
      ? arr
      : [arr[4], arr[0], arr[1], arr[2], arr[3]];
  }

  if (tier === "triple") {
    const start = [0, 1, 2][Math.floor(Math.random() * 3)];
    const arr = new Array(5).fill(null);

    for (let i = 0; i < 3; i++) {
      arr[start + i] = main;
    }

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
      label: "💥 𝑳𝑶𝑺𝑺"
    };
  }

  const roll = Math.random();

  if (roll < 0.03) {
    return {
      tier: "jackpot",
      multiplier: 10,
      label: "👑 𝑱𝑨𝑪𝑲𝑷𝑶𝑻"
    };
  }

  if (roll < 0.10) {
    return {
      tier: "quad",
      multiplier: 5,
      label: "💎 𝑸𝑼𝑨𝑫 𝑾𝑰𝑵"
    };
  }

  if (roll < 0.25) {
    return {
      tier: "triple",
      multiplier: 3,
      label: "🔮 𝑻𝑹𝑰𝑷𝑳𝑬 𝑾𝑰𝑵"
    };
  }

  if (roll < 0.55) {
    return {
      tier: "twoPair",
      multiplier: 2,
      label: "✨ 𝑻𝑾𝑶 𝑷𝑨𝑰𝑹"
    };
  }

  return {
    tier: "onePair",
    multiplier: 1.5,
    label: "💠 𝑶𝑵𝑬 𝑷𝑨𝑰𝑹"
  };
}

function parseAmount(input) {
  if (typeof input !== "string")
    return Number(input);

  const text = input.trim().toLowerCase();
  const unit = text.slice(-1);
  const value = parseFloat(text);

  if (!Number.isFinite(value))
    return NaN;

  if (unit === "k")
    return value * 1000;

  if (unit === "m")
    return value * 1000000;

  if (unit === "b")
    return value * 1000000000;

  return value;
}

module.exports = {
  config: {
    name: "spin",
    version: "6.0",
    author: "SHISHIR",
    countDown: 5,
    role: 0,
    category: "Game",
    guide: "{pn} <amount> | Example: !spin 10k"
  },

  onStart: async function ({
    api,
    args,
    message,
    event,
    usersData
  }) {
    try {
      const { senderID } = event;

      const userData =
        (await usersData.get(senderID)) || {};

      if (!args[0]) {
        return message.reply(
          "╭━━━『 𝑨𝒀-𝑴𝑨 𝑺𝑷𝑰𝑵 』━━━╮\n" +
          "┃\n" +
          "┃ ❌ 𝑩𝒆𝒕 𝒂𝒎𝒐𝒖𝒏𝒕 𝒅𝒊𝒏.\n" +
          "┃\n" +
          "┃ 💡 Example: !spin 100k\n" +
          "┃ 💰 Max Bet: 20M\n" +
          "┃\n" +
          "╰━━━━━━━━━━━━━━━━━━╯"
        );
      }

      const amount = parseAmount(args[0]);
      const balance = Number(userData.money) || 0;

      if (!Number.isFinite(amount) || amount <= 0) {
        return message.reply(
          "❌ 𝑽𝒂𝒍𝒊𝒅 𝒃𝒆𝒕 𝒂𝒎𝒐𝒖𝒏𝒕 𝒅𝒊𝒏."
        );
      }

      if (amount > MAX_BET) {
        return message.reply(
          "╭━━━『 🚫 𝑩𝑬𝑻 𝑳𝑰𝑴𝑰𝑻 』━━━╮\n" +
          "┃\n" +
          "┃ 💰 𝑴𝒂𝒙𝒊𝒎𝒖𝒎: $20M\n" +
          "┃ ❌ 20M 𝒆𝒓 𝒃𝒆𝒔𝒉𝒊 𝒃𝒆𝒕 𝒅𝒆𝒘𝒂 𝒋𝒂𝒃𝒆 𝒏𝒂.\n" +
          "┃\n" +
          "╰━━━━━━━━━━━━━━━━━━╯"
        );
      }

      if (amount > balance) {
        return message.reply(
          "╭━━━『 💸 𝑩𝑨𝑳𝑨𝑵𝑪𝑬 』━━━╮\n" +
          "┃\n" +
          `┃ 💳 𝑯𝒂𝒗𝒆: ${fmt(balance)}\n` +
          `┃ 🎯 𝑩𝒆𝒕: ${fmt(amount)}\n` +
          "┃\n" +
          "╰━━━━━━━━━━━━━━━━━━╯"
        );
      }

      const now = Date.now();

      if (!userData.data)
        userData.data = {};

      if (!userData.data.slotInfo) {
        userData.data.slotInfo = {
          count: 0,
          lastTime: now
        };
      }

      let count =
        Number(userData.data.slotInfo.count) || 0;

      let lastTime =
        Number(userData.data.slotInfo.lastTime) || now;

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
          "╭━━━『 ⏳ 𝑺𝑷𝑰𝑵 𝑳𝑰𝑴𝑰𝑻 』━━━╮\n" +
          "┃\n" +
          `┃ 🎰 𝑼𝒔𝒆𝒅: ${MAX_SPINS}/${MAX_SPINS}\n` +
          `┃ ⏰ 𝑾𝒂𝒊𝒕: ${hours}h ${minutes}m\n` +
          "┃\n" +
          "╰━━━━━━━━━━━━━━━━━━╯"
        );
      }

      // Deduct bet first
      const newBalance = balance - amount;

      userData.data.slotInfo = {
        count: count,
        lastTime: lastTime
      };

      await usersData.set(senderID, {
        money: newBalance,
        data: userData.data
      });

      // Spin animation
      let spinMessage = null;

      for (let i = 0; i < SPIN_FRAMES; i++) {
        const row = randomRow();
        const text = spinFrameText(row);

        if (i === 0) {
          spinMessage = await message.reply(text);
        } else if (spinMessage) {
          try {
            await message.edit(
              text,
              spinMessage.messageID
            );
          } catch (e) {
            // Ignore edit failure
          }
        }

        await sleep(SPIN_DELAY_MS);
      }

      const result = getResult();
      const reel = buildReel(result.tier);

      const winAmount =
        Math.floor(amount * result.multiplier);

      const finalBalance =
        newBalance + winAmount;

      const profit =
        winAmount - amount;

      count++;

      userData.data.slotInfo = {
        count: count,
        lastTime: lastTime
      };

      await usersData.set(senderID, {
        money: finalBalance,
        data: userData.data
      });

      let finalText;

      if (result.tier === "loss") {
        finalText =
          "╭━━━『 𝑨𝒀-𝑴𝑨 𝑺𝑷𝑰𝑵 』━━━╮\n" +
          "┃\n" +
          `┃  ${reel.join(" ┃ ")}\n` +
          "┃\n" +
          "┃ 💥 𝑳𝑶𝑺𝑺\n" +
          "┃\n" +
          `┃ 💸 𝑳𝒐𝒔𝒕: ${fmt(amount)}\n` +
          `┃ 💳 𝑩𝒂𝒍𝒂𝒏𝒄𝒆: ${fmt(finalBalance)}\n` +
          `┃ 🎰 𝑺𝒑𝒊𝒏𝒔: ${count}/${MAX_SPINS}\n` +
          "┃\n" +
          "╰━━━━━━━━━━━━━━━━━━╯";
      } else {
        finalText =
          "╭━━━『 𝑨𝒀-𝑴𝑨 𝑺𝑷𝑰𝑵 』━━━╮\n" +
          "┃\n" +
          `┃  ${reel.join(" ┃ ")}\n` +
          "┃\n" +
          `┃ ${result.label}\n` +
          "┃\n" +
          `┃ 🎯 𝑴𝒖𝒍𝒕𝒊: ${result.multiplier}x\n` +
          `┃ 💰 𝑾𝒐𝒏: ${fmt(winAmount)}\n` +
          `┃ 📈 𝑷𝒓𝒐𝒇𝒊𝒕: +${fmt(profit)}\n` +
          `┃ 💳 𝑩𝒂𝒍𝒂𝒏𝒄𝒆: ${fmt(finalBalance)}\n` +
          `┃ 🎰 𝑺𝒑𝒊𝒏𝒔: ${count}/${MAX_SPINS}\n` +
          "┃\n" +
          "╰━━━━━━━━━━━━━━━━━━╯";
      }

      if (spinMessage) {
        try {
          await message.edit(
            finalText,
            spinMessage.messageID
          );
        } catch (e) {
          await message.reply(finalText);
        }
      } else {
        await message.reply(finalText);
      }

    } catch (error) {
      console.error(
        "[AY-MA SPIN ERROR]",
        error
      );

      return message.reply(
        "╭━━━『 ⚠️ 𝑬𝑹𝑹𝑶𝑹 』━━━╮\n" +
        "┃\n" +
        `┃ ${error.message || "Unknown error"}\n` +
        "┃\n" +
        "╰━━━━━━━━━━━━━━━━━━╯"
      );
    }
  }
};
