module.exports = {
  config: {
    name: "friendadd",
    aliases: ["fadd", "addfriendlist"],
    version: "1.0.0",
    author: "Mr.King 🎭",
    countDown: 10,
    role: 1, // 👈 [ADMIN ONLY] Admin and Group Moderators can use this to prevent spamming abuse
    category: "group",
    shortDescription: {
      en: "Add bot's facebook friends to the current group chat"
    },
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID } = event;

    try {
      // 1. Fetch current group thread information to see who is already inside
      const threadInfo = await api.getThreadInfo(threadID);
      const participantIDs = threadInfo.participantIDs;

      // 2. Fetch bot's complete account friends profile array mapping list
      api.getFriendsList(async (err, data) => {
        if (err) {
          console.error(err);
          return api.sendMessage("❌ Bot-er facebook friend list fetch korte parlam na!", threadID, messageID);
        }

        if (!data || data.length === 0) {
          return api.sendMessage("📝 Bot-er account e kuno friends add nai, tai group e add kora jabe na।", threadID, messageID);
        }

        // Filter and find friends who are NOT currently in the group chat
        const eligibleFriends = data.filter(friend => !participantIDs.includes(friend.userID));

        if (eligibleFriends.length === 0) {
          return api.sendMessage("✅ Bot-er friendlist e thaka shobai e অলরেডি এই গ্রুপে যুক্ত আছে।", threadID, messageID);
        }

        api.sendMessage(`🔄 Bot-er friendlist theke total ${eligibleFriends.length} jon ke group e add kora shuru hocche... Please wait।`, threadID);

        let successCount = 0;
        let failCount = 0;

        // 3. Dynamic Sequential Loop Processing to bypass Facebook API spam blocks
        for (const friend of eligibleFriends) {
          try {
            await new Promise((resolve) => setTimeout(resolve, 1500)); // 👈 1.5s delay safeguard anti-ban cooldown interval
            
            await api.addUserToGroup(friend.userID, threadID);
            successCount++;
          } catch (addError) {
            // Log individual failed attempts silently to continue loop execution sequence safely
            failCount++;
          }
        }

        // 4. Send final transaction deployment logs to the channel thread layout
        return api.sendMessage(
          `📊 𝗙𝗥𝗜𝗘𝗡𝗗 𝗔𝗗𝗗 𝗥𝗘𝗣𝗢𝗥𝗧\n` +
          `-------------------------\n` +
          `✅ Successfully Added: ${successCount} members\n` +
          `❌ Failed/Blocked: ${failCount} profiles\n\n` +
          `🦭 𝐒𝐲𝐬𝐭𝐞𝐦 𝐁𝐲: SHI'SHIR  🕊️💖`,
          threadID,
          messageID
        );
      });

    } catch (globalError) {
      console.error(globalError);
      return api.sendMessage("❌ Command running engine fatal error logic failure!", threadID, messageID);
    }
  }
};
