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
  return `🔮 𝑨𝒀-𝑴𝑨 𝑺𝑷𝑰𝑵 🔮

┃ ${row.join(" ┃ ")} ┃

⚡ Spinning...`;
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

  // JACKPOT
  if (tier === "jackpot") {
    return [main, main, main, main, main];
  }

  // QUAD
  if (tier === "quad") {
    const arr = [main, main, main, main, other()];

    return Math.random() < 0.5
      ? arr
      : [arr[4], arr[0], arr[1], arr[2], arr[3]];
  }

  // TRIPLE
  if (tier === "triple") {
    const start = Math.floor(Math.random() * 3);
    const arr = new Array(5).fill(null);

    for (let i = 0; i < 3; i++) {
      arr[start + i] = main;
    }

    for (let i = 0; i < 5; i++) {
      if (arr[i] === null) {
        arr[i] = other();
      }
    }

    return arr;
  }

  // TWO PAIR
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
      if (arr[i] === null) {
        arr[i] = other();
      }
    }

    return arr;
  }

  // ONE PAIR
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
      if (arr[i] === null) {
        arr[i] = other();
      }
    }

    return arr;
  }

  // LOSS
  return shuffled.slice(0, 5);
}

function getResult() {
  if (Math.random() > WIN_CHANCE) {
    return {
      tier: "loss",
      multiplier: 0,
      text: "💔 𝗟𝗢𝗦𝗦"
    };
  }

  const roll = Math.random();

  if (roll < 0.03) {
    return {
      tier: "jackpot",
      multiplier: 10,
      text: "👑 𝗝𝗔𝗖𝗞𝗣𝗢𝗧"
    };
  }

  if (roll < 0.10) {
    return {
      tier: "quad",
      multiplier: 5,
      text: "💎 𝗤𝗨𝗔𝗗 𝗪𝗜𝗡"
    };
  }

  if (roll < 0.25) {
    return {
      tier: "triple",
      multiplier: 3,
      text: "🔥 𝗧𝗥𝗜𝗣𝗟𝗘 𝗪𝗜𝗡"
    };
  }

  if (roll < 0.55) {
    return {
      tier: "twoPair",
      multiplier: 2,
      text: "✨ 𝗧𝗪𝗢 𝗣𝗔𝗜𝗥"
    };
  }

  return {
    tier: "onePair",
    multiplier: 1.5,
    text: "🔷 𝗣𝗔𝗜𝗥 𝗪𝗜𝗡"
  };
}

module.exports = {
  config: {
    name: "spin",
    version: "5.1.0",
    author: "SHISHIR",
    countDown: 5,
    role: 0,
    category: "Game",
    shortDescription: "AY-MA Spin Game",
    longDescription: "Crystal style spin game with 20M maximum bet.",
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

      if (!args[0]) {
        return message.reply(
          "❌ 𝑨𝒎𝒐𝒖𝒏𝒕 𝒅𝒊𝒏!\n\n" +
          "💰 Example: !spin 10k\n" +
          "💰 Maximum: 20M"
        );
      }

      let amount = parseAmount(args[0]);

      if (!Number.isFinite(amount) || amount <= 0) {
        return message.reply(
          "❌ সঠিক amount দিন।\n\nExample: !spin 10k"
        );
      }

      if (amount > MAX_BET) {
        return message.reply(
          "🚫 𝗕𝗘𝗧 𝗟𝗜𝗠𝗜𝗧\n\n" +
          "একবারে সর্বোচ্চ 20M পর্যন্ত spin করা যাবে।"
        );
      }

      const userData = await usersData.get(senderID);

      if (!userData) {
        return message.reply("❌ User data পাওয়া যায়নি।");
      }

      const balance = Number(userData.money) || 0;

      if (amount > balance) {
        return message.reply(
          `❌ পর্যাপ্ত টাকা নেই!\n\n` +
          `💰 Balance: ${fmt(balance)}\n` +
          `🎯 Bet: ${fmt(amount)}`
        );
      }

      // Spin limit system
      if (!userData.data) {
        userData.data = {};
      }

      if (!userData.data.slotInfo) {
        userData.data.slotInfo = {
          count: 0,
          lastTime: Date.now()
        };
      }

      let count = Number(userData.data.slotInfo.count) || 0;
      let lastTime =
        Number(userData.data.slotInfo.lastTime) || Date.now();

      const now = Date.now();

      // Reset after 3 hours
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
          `⛔ 𝗦𝗣𝗜𝗡 𝗟𝗜𝗠𝗜𝗧 𝗥𝗘𝗔𝗖𝗛𝗘𝗗\n\n` +
          `🎰 Limit: ${MAX_SPINS} spins\n` +
          `⏳ আবার খেলতে পারবেন: ${hours}h ${minutes}m পরে`
        );
      }

      // Deduct bet first
      const newBalanceAfterBet = balance - amount;

      userData.money = newBalanceAfterBet;
      userData.data.slotInfo = {
        count: count + 1,
        lastTime
      };

      await usersData.set(senderID, {
        money: userData.money,
        data: userData.data
      });

      // Initial message
      const firstRow = randomRow();

      const sent = await message.reply(
        spinFrameText(firstRow)
      );

      // Animation
      for (let i = 0; i < SPIN_FRAMES; i++) {
        await sleep(SPIN_DELAY_MS);

        const row = randomRow();

        try {
          await message.edit(
            spinFrameText(row),
            sent.messageID
          );
        } catch (e) {
          // Ignore edit errors
        }
      }

      // Final result
      const result = getResult();
      const finalRow = buildReel(result.tier);

      const winAmount =
        Math.floor(amount * result.multiplier);

      let finalBalance = newBalanceAfterBet;

      if (result.multiplier > 0) {
        finalBalance += winAmount;
      }

      userData.money = finalBalance;

      // Daily statistics
      const stats =
        userData.data.slotStats;

      if (
        !stats ||
        stats.date !== todayKey()
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

      let resultText;

      if (result.multiplier > 0) {
        resultText =
          `\n\n🎉 ${result.text}\n` +
          `💰 Win: +${fmt(winAmount)}\n` +
          `📈 Multiplier: ${result.multiplier}x`;
      } else {
        resultText =
          `\n\n💔 ${result.text}\n` +
          `💸 Lost: -${fmt(amount)}`;
      }

      const finalText =
        `╔════════════════════╗\n` +
        `║   🔮 𝑨𝒀-𝑴𝑨 𝑺𝑷𝑰𝑵 🔮   ║\n` +
        `╚════════════════════╝\n\n` +
        `┃ ${finalRow.join(" ┃ ")} ┃\n` +
        resultText +
        `\n\n💳 Balance: ${fmt(finalBalance)}\n` +
        `🎰 Spin: ${count + 1}/${MAX_SPINS}\n` +
        `👑 𝗦𝗛𝗜𝗦𝗛𝗜𝗥`;

      try {
        await message.edit(
          finalText,
          sent.messageID
        );
      } catch (e) {
        await message.reply(finalText);
      }

    } catch (error) {
      console.error("SPIN ERROR:", error);

      return message.reply(
        "⚠️ Spin চালাতে সমস্যা হয়েছে!\n" +
        "কিছুক্ষণ পরে আবার চেষ্টা করুন।"
      );
    }
  }
};
