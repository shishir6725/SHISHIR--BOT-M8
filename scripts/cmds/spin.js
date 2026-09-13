!cmd install spin.js "use strict";

const MAX_BET     = 20000000; // 20M
const MAX_SPINS   = 30;
const COOLDOWN_MS = 3 * 60 * 60 * 1000; // 3 hours
const WIN_CHANCE  = 0.35; // 35% win, 65% loss

// distinct "crystal vault" theme — not fruit, not hearts/animals
const ITEMS = ["💠", "🔷", "🔮", "✨", "🌙", "⭐", "💎"];

const SPIN_FRAMES  = 4;
const SPIN_DELAY_MS = 450;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function todayKey() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" }); // YYYY-MM-DD
}

function fmt(num) {
  num = Number(num) || 0;
  if (num >= 1e9) return "$" + (num / 1e9).toFixed(2).replace(/\.00$/, "") + "B";
  if (num >= 1e6) return "$" + (num / 1e6).toFixed(2).replace(/\.00$/, "") + "M";
  if (num >= 1e3) return "$" + (num / 1e3).toFixed(2).replace(/\.00$/, "") + "K";
  return "$" + num.toLocaleString();
}

function randomRow() {
  return Array.from({ length: 5 }, () => ITEMS[Math.floor(Math.random() * ITEMS.length)]);
}

function spinFrameText(row) {
  return `🔮 Spinning...\n\n┃ ${row.join(" ┃ ")} ┃`;
}

async function getDailyStats(usersData, uid) {
  const userData = (await usersData.get(uid)) || {};
  const stats = userData.data?.slotStats;
  if (!stats || stats.date !== todayKey()) {
    return { date: todayKey(), wonTotal: 0, lostTotal: 0 };
  }
  return stats;
}

async function saveDailyStats(usersData, uid, stats) {
  const userData = (await usersData.get(uid)) || {};
  if (!userData.data) userData.data = {};
  userData.data.slotStats = stats;
  await usersData.set(uid, { data: userData.data });
}

/** builds a 5-symbol reel matching the given result tier */
function buildReel(tier) {
  const shuffled = [...ITEMS].sort(() => Math.random() - 0.5);
  const main = shuffled[0];
  const other = () => {
    let s;
    do { s = shuffled[Math.floor(Math.random() * shuffled.length)]; } while (s === main);
    return s;
  };

  if (tier === "jackpot") return [main, main, main, main, main];

  if (tier === "quad") {
    const arr = [main, main, main, main, other()];
    return Math.random() < 0.5 ? arr : [arr[4], arr[0], arr[1], arr[2], arr[3]];
  }

  if (tier === "triple") {
    const start = [0, 1, 2][Math.floor(Math.random() * 3)];
    const arr = new Array(5).fill(null);
    for (let i = 0; i < 3; i++) arr[start + i] = main;
    for (let i = 0; i < 5; i++) if (arr[i] === null) arr[i] = other();
    return arr;
  }

  if (tier === "twoPair") {
    const patterns = [[0, 1, 3, 4], [0, 1, 2, 3], [1, 2, 3, 4]];
    const [a, b, c, d] = patterns[Math.floor(Math.random() * patterns.length)];
    const secondary = other();
    const arr = new Array(5).fill(null);
    arr[a] = main; arr[b] = main; arr[c] = secondary; arr[d] = secondary;
    for (let i = 0; i < 5; i++) if (arr[i] === null) arr[i] = other();
    return arr;
  }

  if (tier === "onePair") {
    const patterns = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 4]];
    const [a, b] = patterns[Math.floor(Math.random() * patterns.length)];
    const arr = new Array(5).fill(null);
    arr[a] = main; arr[b] = main;
    for (let i = 0; i < 5; i++) if (arr[i] === null) arr[i] = other();
    return arr;
  }

  return shuffled.slice(0, 5); // loss — 5 distinct symbols, guaranteed no pair
}

function parseAmount(input) {
  if (typeof input !== "string") return input;
  const unit = input.slice(-1).toLowerCase();
  const value = parseFloat(input);
  if (unit === "k") return value * 1000;
  if (unit === "m") return value * 1000000;
  if (unit === "b") return value * 1000000000;
  return value;
}

module.exports = {
  config: {
    name: "slot",
    version: "5.0",
    author: "ARIYAN AI",
    countDown: 5,
    role: 0,
    category: "Game",
    guide: "{pn} <amount> (Example: !slot 10k, !slot 1m, !slot 20m)"
  },

  onStart: async function ({ api, args, message, event, usersData }) {
    const { senderID } = event;
    const userData = await usersData.get(senderID);

    if (!args[0]) return message.reply("❌ কত টাকা স্লট মারতে চান তা লিখুন। (যেমন: !slot 100k)");
    let amount = parseAmount(args[0]);

    if (isNaN(amount) || amount <= 0) return message.reply("❌ দয়া করে সঠিক টাকার পরিমাণ লিখুন।");
    if (amount > MAX_BET) return message.reply(`❌ জানু, একবারে সর্বোচ্চ ${(MAX_BET / 1000000)}M পর্যন্ত স্লট মারা যাবে।`);
    if (amount > userData.money) return message.reply(`❌ আপনার কাছে পর্যাপ্ত টাকা নেই! আপনার আছে: $${userData.money.toLocaleString()}`);

    // limit / cooldown
    const now = Date.now();
    if (!userData.data) userData.data = {};
    if (!userData.data.slotInfo) userData.data.slotInfo = { count: 0, lastTime: now };
    let { count, lastTime } = userData.data.slotInfo;

    if (now - lastTime > COOLDOWN_MS) { count = 0; lastTime = now; }

    if (count >= MAX_SPINS) {
      const remaining = COOLDOWN_MS - (now - lastTime);
      const hours = Math.floor(remaining / (60 * 60 * 1000));
      const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
      return message.reply
