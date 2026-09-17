
const { getTime } = global.utils;

module.exports = {
  config: {
    name: "leave",
    version: "4.0",
    author: "SHISHIR",
    category: "events"
  },

  onStart: async function ({
    threadsData,
    message,
    event,
    api,
    usersData
  }) {
    if (event.logMessageType !== "log:unsubscribe") return;

    try {
      const { threadID, author } = event;
      const data = event.logMessageData || {};
      const leftID = data.leftParticipantFbId;

      if (!leftID) return;

      if (String(leftID) === String(api.getCurrentUserID())) return;

      const threadData = await threadsData.get(threadID);

      if (
        threadData.settings &&
        threadData.settings.sendLeaveMessage === false
      ) return;

      const userName = await usersData.getName(leftID);
      const hours = Number(getTime("HH"));
      const minutes = getTime("mm");

      const time = `${String(hours).padStart(2, "0")}:${minutes}`;

      const isKicked =
        author && String(leftID) !== String(author);

      const status = isKicked
        ? "𝐊𝐈𝐂𝐊𝐄𝐃 𝐅𝐑𝐎𝐌 𝐓𝐇𝐄 𝐆𝐑𝐎𝐔𝐏"
        : "𝐋𝐄𝐅𝐓 𝐓𝐇𝐄 𝐆𝐑𝐎𝐔𝐏";

      const leaveMessage =
`╔═══━━━─── • ───━━━═══╗
       🖤 𝐒𝐇𝐈𝐒𝐇𝐈𝐑 𝐁𝐎𝐓 🖤
╚═══━━━─── • ───━━━═══╝

🥀 𝐋𝐄𝐀𝐕𝐄 𝐀𝐋𝐄𝐑𝐓 🥀

👤 𝐔𝐬𝐞𝐫 : @${userName}
🚪 𝐒𝐭𝐚𝐭𝐮𝐬 : ${status}
🕒 𝐓𝐢𝐦𝐞 : ${time}

╭───「 🔄 𝐀𝐔𝐓𝐎 𝐑𝐄-𝐀𝐃𝐃 」───╮
│ ⏳ 𝐏𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠...
╰────────────────────╯`;

      await message.send({
        body: leaveMessage,
        mentions: [{
          tag: `@${userName}`,
          id: leftID
        }]
      });

      // Auto Add only for voluntary leave
      if (!isKicked) {
        try {
          await api.addUserToGroup(leftID, threadID);

          await message.send({
            body:
`╔═══━━━─── • ───━━━═══╗
       🖤 𝐒𝐇𝐈𝐒𝐇𝐈𝐑 𝐁𝐎𝐓 🖤
╚═══━━━─── • ───━━━═══╝

✨ 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐁𝐀𝐂𝐊 ✨

👤 𝐔𝐬𝐞𝐫 : @${userName}
✅ 𝐒𝐭𝐚𝐭𝐮𝐬 : 𝐑𝐄-𝐀𝐃𝐃𝐄𝐃 𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋𝐋𝐘

╰━━━─── • 🖤 • ───━━━╯`,
            mentions: [{
              tag: `@${userName}`,
              id: leftID
            }]
          });

        } catch (error) {
          console.error("[AUTO ADD ERROR]", error.message);
        }
      }

    } catch (error) {
      console.error("[LEAVE ERROR]", error.message);
    }
  }
};
