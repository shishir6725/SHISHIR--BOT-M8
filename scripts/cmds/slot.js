"use strict";

const MAX_BET = 20000000; // 20M
const MAX_SPINS = 40;
const COOLDOWN_MS = 3 * 60 * 60 * 1000; // 3 hours

const ITEMS = ["🔮", "⚡", "👑", "💎", "🍒", "🔥", "7️⃣"];

function parseAmount(input) {
  if (typeof input !== "string") return input;

  const unit = input.slice(-1).toLowerCase();
  const value = parseFloat(input);

  if (isNaN(value)) return NaN;

  if (unit === "k") return value * 1000;
  if (unit === "m") return value * 1000000;
  if (unit === "b") return value * 1000000000;

  return value;
}

function formatNumber(num) {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "𝐁";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "𝐌";
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "𝐊";
  return Math.floor(num).toString();
}

function rollResult() {
  const roll = Math.random() * 100;

  // 1% — Mega Jackpot
  if (roll < 1) {
    const m = ITEMS[Math.floor(Math.random() * ITEMS.length)];

    return {
      symbols: [m, m, m],
      multiplier: 10,
      title: "🚨 𝐌𝐄𝐆𝐀 𝐉𝐀𝐂𝐊𝐏𝐎𝐓! 🚨"
    };
  }

  // 4% — Wild Boost
  if (roll < 5) {
    const m = ITEMS[Math.floor(Math.random() * (ITEMS.length - 1))];

    return {
      symbols: [m, m, "7️⃣"],
      multiplier: 5,
      title: "🔥 𝐖𝐈𝐋𝐃 𝐁𝐎𝐎𝐒𝐓! 🔥"
    };
  }

  // 10% — Sweet Strike
  if (roll < 15) {
    const m = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    const others = ITEMS.filter(x => x !== m);
    const other = others[Math.floor(Math.random() * others.length)];

    return {
      symbols: [m, m, other],
      multiplier: 2.5,
      title: "✨ 𝐒𝐖𝐄𝐄𝐓 𝐒𝐓𝐑𝐈𝐊𝐄! ✨"
    };
  }

  // 20% — Nice Win
  if (roll < 35) {
    const m = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    const others = ITEMS.filter(x => x !== m);
    const other = others[Math.floor(Math.random() * others.length)];

    return {
      symbols: [m, m, other],
      multiplier: 1.5,
      title: "🍀 𝐍𝐈𝐂𝐄 𝐖𝐈𝐍! 🍀"
    };
  }

  // Loss — 3 different symbols
  const shuffled = [...ITEMS].sort(() => Math.random() - 0.5);

  return {
    symbols: shuffled.slice(0, 3),
    multiplier: 0,
    title: "💀 𝐇𝐀𝐑𝐃 𝐋𝐔𝐂𝐊 💀"
  };
}

module.exports = {

  config: {
    name: "slot",
    version: "9.0.0",
    author: "AY-MA",
    countDown: 3,
    role: 0,
    category: "Game",
    guide: "{pn} <amount>\nExample: !slot 50k | !slot 1m | !slot 20m"
  },

  onStart: async function ({ args, message, event, usersData }) {

    const { senderID } = event;

    const userData = (await usersData.get(senderID)) || {};

    let userMoney = Number(userData.money || 0);

    // ━━━━━━━━━━━━━━━━━━━
    // BET CHECK
    // ━━━━━━━━━━━━━━━━━━━

    if (!args[0]) {
      return message.reply(
        "⚠️ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐞𝐧𝐭𝐞𝐫 𝐲𝐨𝐮𝐫 𝐛𝐞𝐭!\n\n" +
        "💡 Example: !slot 50k"
      );
    }

    const amount = parseAmount(args[0]);

    if (isNaN(amount) || amount <= 0) {
      return message.reply(
        "❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐚𝐦𝐨𝐮𝐧𝐭!\n" +
        "💡 Example: !slot 100k"
      );
    }

    if (amount > MAX_BET) {
      return message.reply(
        `🚫 𝐌𝐚𝐱 𝐁𝐞𝐭: $${formatNumber(MAX_BET)}`
      );
    }

    if (amount > userMoney) {
      return message.reply(
        `💸 𝐍𝐨𝐭 𝐄𝐧𝐨𝐮𝐠𝐡 𝐁𝐚𝐥𝐚𝐧𝐜𝐞!\n\n` +
        `💳 𝐖𝐚𝐥𝐥𝐞𝐭: $${formatNumber(userMoney)}`
      );
    }

    // ━━━━━━━━━━━━━━━━━━━
    // SLOT DATA
    // ━━━━━━━━━━━━━━━━━━━

    const now = Date.now();

    if (!userData.data) {
      userData.data = {};
    }

    if (!userData.data.slotInfo) {
      userData.data.slotInfo = {
        count: 0,
        wins: 0,
        streak: 0,
        lastTime: now
      };
    }

    let slotInfo = userData.data.slotInfo;

    let count = Number(slotInfo.count || 0);
    let wins = Number(slotInfo.wins || 0);
    let streak = Number(slotInfo.streak || 0);
    let lastTime = Number(slotInfo.lastTime || now);

    // ━━━━━━━━━━━━━━━━━━━
    // COOLDOWN RESET
    // ━━━━━━━━━━━━━━━━━━━

    if (now - lastTime >= COOLDOWN_MS) {
      count = 0;
      wins = 0;
      streak = 0;
      lastTime = now;
    }

    // ━━━━━━━━━━━━━━━━━━━
    // SPIN LIMIT
    // ━━━━━━━━━━━━━━━━━━━

    if (count >= MAX_SPINS) {

      const remaining = COOLDOWN_MS - (now - lastTime);

      const hours = Math.floor(
        remaining / (60 * 60 * 1000)
      );

      const minutes = Math.floor(
        (remaining % (60 * 60 * 1000)) /
        (60 * 1000)
      );

      return message.reply(
        `🛑 𝐒𝐏𝐈𝐍 𝐋𝐈𝐌𝐈𝐓 𝐑𝐄𝐀𝐂𝐇𝐄𝐃!\n\n` +
        `🎟️ 𝐋𝐢𝐦𝐢𝐭: [ ${MAX_SPINS}/${MAX_SPINS} ]\n` +
        `⏳ 𝐑𝐞𝐬𝐞𝐭𝐬 𝐈𝐧: ${hours}𝐡 ${minutes}𝐦`
      );
    }

    // ━━━━━━━━━━━━━━━━━━━
    // ROLL
    // ━━━━━━━━━━━━━━━━━━━

    const {
      symbols,
      multiplier,
      title
    } = rollResult();

    const win = multiplier > 0;

    const winnings = win
      ? Math.floor(amount * multiplier)
      : 0;

    const profit = win
      ? winnings - amount
      : -amount;

    const finalMoney = userMoney + profit;

    // ━━━━━━━━━━━━━━━━━━━
    // WIN / STREAK
    // ━━━━━━━━━━━━━━━━━━━

    if (win) {
      wins++;
      streak++;
    } else {
      streak = 0;
    }

    count++;

    // ━━━━━━━━━━━━━━━━━━━
    // SAVE DATA
    // ━━━━━━━━━━━━━━━━━━━

    userData.money = finalMoney;

    userData.data.slotInfo = {
      count,
      wins,
      streak,
      lastTime
    };

    await usersData.set(senderID, userData);

    // ━━━━━━━━━━━━━━━━━━━
    // PAYOUT TEXT
    // ━━━━━━━━━━━━━━━━━━━

    const payoutText = win
      ? `🟢 +$${formatNumber(profit)}`
      : `🔴 -$${formatNumber(amount)}`;

    // ━━━━━━━━━━━━━━━━━━━
    // AY-MA ZONE RESULT
    // ━━━━━━━━━━━━━━━━━━━

    const resultMsg =
      `🌸 ━━ 𝑨𝒀-𝑴𝑨 𝒁𝑶𝑵𝑬 ━━ 🌸\n` +
      `[ ${symbols.join(" | ")} ]\n\n` +
      `${title}\n\n` +
      `💰 𝐏𝐚𝐲𝐨𝐮𝐭: ${payoutText}\n` +
      `💳 𝐖𝐚𝐥𝐥𝐞𝐭: $${formatNumber(finalMoney)}\n` +
      `🎟️ 𝐬𝐥𝐨𝐭: [ ${count}/${MAX_SPINS} ]\n` +
      `🏆 𝐖𝐢𝐧𝐬: ${wins}\n` +
      `🔥 𝐒𝐭𝐫𝐞𝐚𝐤: ${streak}\n\n` +
      `⏳ 𝐋𝐢𝐦𝐢𝐭 𝐫𝐞𝐬𝐞𝐭𝐬 𝐞𝐯𝐞𝐫𝐲 3 𝐡𝐨𝐮𝐫𝐬`;

    return message.reply(resultMsg);
  }
};
