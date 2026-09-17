const { getTime, drive } = global.utils;
const axios = require("axios");

module.exports = {
  config: {
    name: "leave",
    version: "2.0",
    author: "SHISHIR",
    category: "events"
  },

  langs: {
    en: {
      session1: "morning",
      session2: "noon",
      session3: "afternoon",
      session4: "evening",
      leaveType1: "left",
      leaveType2: "was kicked from",
      defaultLeaveMessage:
        "╭━━━〔 𝐆𝐑𝐎𝐔𝐏 𝐋𝐄𝐀𝐕𝐄 〕━━━╮\n" +
        "┃ 👤 Member: {userNameTag}\n" +
        "┃ 🚪 Action: {type} {threadName}\n" +
        "┃ 🕒 Time: {time}\n" +
        "┃ 🌤️ Session: {session}\n" +
        "╰━━━━━━━━━━━━━━━━━━╯"
    }
  },

  onStart: async function ({
    threadsData,
    message,
    event,
    api,
    usersData,
    getLang
  }) {
    // Only process member leave or kick events
    if (event.logMessageType !== "log:unsubscribe") return;

    try {
      const { threadID, author } = event;
      const data = event.logMessageData || {};
      const leftID = data.leftParticipantFbId;

      if (!leftID) return;

      // Ignore when the bot itself leaves
      if (String(leftID) === String(api.getCurrentUserID())) return;

      const threadData = await threadsData.get(threadID);

      // Check leave message setting
      if (
        threadData.settings &&
        threadData.settings.sendLeaveMessage === false
      ) {
        return;
      }

      const userName = await usersData.getName(leftID);
      const threadName = threadData.threadName || "the group";

      // If author is different from the leaving user, assume kick
      const isKicked =
        author && String(leftID) !== String(author);

      const type = isKicked
        ? getLang("leaveType2")
        : getLang("leaveType1");

      const hours = Number(getTime("HH"));

      let session;
      if (hours <= 10) {
        session = getLang("session1");
      } else if (hours <= 12) {
        session = getLang("session2");
      } else if (hours <= 18) {
        session = getLang("session3");
      } else {
        session = getLang("session4");
      }

      let leaveMessage =
        (threadData.data && threadData.data.leaveMessage) ||
        getLang("defaultLeaveMessage");

      const form = {
        body: "",
        mentions: []
      };

      // Mention the leaving user
      if (leaveMessage.includes("{userNameTag}")) {
        form.mentions.push({
          tag: userName,
          id: leftID
        });
      }

      // Replace message variables
      leaveMessage = leaveMessage
        .replace(/\{userNameTag\}/g, userName)
        .replace(/\{userName\}/g, userName)
        .replace(/\{type\}/g, type)
        .replace(/\{threadName\}|\{boxName\}/g, threadName)
        .replace(/\{time\}/g, String(hours).padStart(2, "0"))
        .replace(/\{session\}/g, session);

      form.body = leaveMessage;

      // Add kick GIF
      if (isKicked) {
        try {
          const gifRes = await axios.get(
            "https://i.imgur.com/SFQoVw7.gif",
            {
              responseType: "stream",
              timeout: 15000,
              headers: {
                "User-Agent": "Mozilla/5.0"
              }
            }
          );

          form.attachment = gifRes.data;
        } catch (error) {
          console.error(
            "[LEAVE] GIF download failed:",
            error.message
          );
        }
      }

      // Add custom leave attachments
      if (!isKicked && threadData.data?.leaveAttachment) {
        const files = threadData.data.leaveAttachment;

        if (Array.isArray(files) && files.length > 0) {
          const attachments = await Promise.allSettled(
            files.map(file => drive.getFile(file, "stream"))
          );

          const validFiles = attachments
            .filter(result => result.status === "fulfilled")
            .map(result => result.value);

          if (validFiles.length > 0) {
            form.attachment = validFiles;
          }
        }
      }

      // Send the leave message
      await message.send(form);

    } catch (error) {
      console.error(
        "[LEAVE] Error:",
        error.message
      );
    }
  }
};
