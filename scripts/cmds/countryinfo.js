const axios = require("axios");

const BASE_API = "https://xalman-apis.vercel.app";

module.exports = {
  config: {
    name: "countryinfo",
    aliases: ["country", "countryinfo"],
    version: "2.0.0",
    author: "SHISHIR",
    countDown: 10,
    role: 0,
    description: {
      bn: "যেকোনো দেশের বিস্তারিত তথ্য দেখুন",
      en: "Get detailed information about any country"
    },
    category: "info",
    guide: {
      bn: "{pn} <দেশের নাম>",
      en: "{pn} <country name>"
    }
  },

  langs: {
    bn: {
      noInput: "⚠️ একটি দেশের নাম লিখুন!\n\nউদাহরণ: country Bangladesh",
      notFound: "❌ \"%1\" দেশের তথ্য পাওয়া যায়নি।",
      error: "❌ Country Info API-তে সমস্যা হয়েছে।\n\n📌 %1"
    },
    en: {
      noInput: "⚠️ Please provide a country name!\n\nExample: country Bangladesh",
      notFound: "❌ Information for \"%1\" was not found.",
      error: "❌ Country Info API error.\n\n📌 %1"
    }
  },

  onStart: async function ({ args, message, getLang }) {
    const countryName = args.join(" ").trim();

    if (!countryName) {
      return message.reply(getLang("noInput"));
    }

    try {
      const url =
        `${BASE_API}/api/country?name=${encodeURIComponent(countryName)}`;

      const res = await axios.get(url, {
        timeout: 15000
      });

      if (!res.data || !res.data.data) {
        return message.reply(getLang("notFound", countryName));
      }

      const d = res.data.data;

      const population = Number(d.population || 0).toLocaleString();
      const area = Number(d.area || 0).toLocaleString();

      const languages = Array.isArray(d.languages)
        ? d.languages.join(", ")
        : (d.languages || "N/A");

      const currency = Array.isArray(d.currency)
        ? d.currency.join(", ")
        : (d.currency || "N/A");

      const borders = Array.isArray(d.borders) && d.borders.length
        ? d.borders.join(", ")
        : "None";

      const msg =
`╭━━━〔 🌍 𝐂𝐎𝐔𝐍𝐓𝐑𝐘 𝐈𝐍𝐅𝐎 〕━━━╮
┃
┃ 🌍 𝐍𝐚𝐦𝐞: ${d.name || "N/A"} ${d.emoji || ""}
┃ 🏛️ 𝐂𝐚𝐩𝐢𝐭𝐚𝐥: ${d.capital || "N/A"}
┃ 👥 𝐏𝐨𝐩𝐮𝐥𝐚𝐭𝐢𝐨𝐧: ${population}
┃ 📏 𝐀𝐫𝐞𝐚: ${area} Sq Km
┃ 📚 𝐋𝐚𝐧𝐠𝐮𝐚𝐠𝐞𝐬: ${languages}
┃ 🚩 𝐑𝐞𝐠𝐢𝐨𝐧: ${d.region || "N/A"}
┃ 💰 𝐂𝐮𝐫𝐫𝐞𝐧𝐜𝐲: ${currency}
┃ ⏰ 𝐓𝐢𝐦𝐞𝐳𝐨𝐧𝐞: ${d.timezone || "N/A"}
┃ 🚧 𝐁𝐨𝐫𝐝𝐞𝐫𝐬: ${borders}
┃ 🌐 𝐃𝐨𝐦𝐚𝐢𝐧: ${d.tld || "N/A"}
┃ 📍 𝐌𝐚𝐩: ${d.map || "N/A"}
┃
╰━━━〔 💫 𝐌𝐀𝐃𝐄 𝐁𝐘 𝐒𝐇𝐈𝐒𝐇𝐈𝐑 〕━━━╯`;

      // Flag থাকলে ছবি পাঠাবে, না থাকলে শুধু text
      if (d.flag) {
        try {
          return message.reply({
            body: msg,
            attachment: await global.utils.getStreamFromURL(d.flag)
          });
        } catch (flagError) {
          console.log("Country flag error:", flagError.message);
        }
      }

      return message.reply(msg);

    } catch (err) {
      console.error("Country Info Error:", err.message);
      return message.reply(getLang("error", err.message));
    }
  }
};
