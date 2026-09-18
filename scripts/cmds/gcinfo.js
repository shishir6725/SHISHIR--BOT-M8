"use strict";

module.exports = {
  config: {
    name: "gcinfo",
    version: "2.0",
    author: "𝑺𝑯𝑰𝑺𝑯𝑰𝑹",
    role: 0,
    countDown: 10,
    shortDescription: "𝑼𝒏𝒊𝒒𝒖𝒆 𝑮𝒓𝒐𝒖𝒑 𝑰𝒏𝒇𝒐",
    longDescription: "𝑺𝒉𝒐𝒘 𝒄𝒐𝒎𝒑𝒍𝒆𝒕𝒆 𝒈𝒓𝒐𝒖𝒑 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏",
    category: "box chat",
    guide: "{pn}"
  },

  onStart: async function ({
    api,
    event,
    usersData
  }) {
    const threadID = event.threadID;

    if (!event.isGroup) {
      return api.sendMessage(
        "❌ 𝑻𝒉𝒊𝒔 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒊𝒔 𝒐𝒏𝒍𝒚 𝒇𝒐𝒓 𝑮𝑪.",
        threadID
      );
    }

    try {
      const info = await api.getThreadInfo(threadID);

      const groupName =
        info.threadName || "𝑼𝒏𝒏𝒂𝒎𝒆𝒅 𝑮𝒓𝒐𝒖𝒑";

      const participantIDs = info.participantIDs || [];
      const adminIDs = info.adminIDs || [];

      const members = participantIDs.length;
      const admins = adminIDs.length;
      const emoji = info.emoji || "🌐";

      const approval = info.approvalMode
        ? "𝑶𝑵 ✅"
        : "𝑶𝑭𝑭 ❌";

      let male = 0;
      let female = 0;
      let unknown = 0;

      // ━━━ 𝑮𝑬𝑵𝑫𝑬𝑹 𝑪𝑶𝑼𝑵𝑻 ━━━
      for (const uid of participantIDs) {
        try {
          const data = await usersData.get(uid);
          const gender = data?.gender;

          if (
            gender == 2 ||
            String(gender).toUpperCase() === "MALE"
          ) {
            male++;
          } else if (
            gender == 1 ||
            String(gender).toUpperCase() === "FEMALE"
          ) {
            female++;
          } else {
            unknown++;
          }
        } catch {
          unknown++;
        }
      }

      // ━━━ 𝑨𝑫𝑴𝑰𝑵 𝑵𝑨𝑴𝑬𝑺 ━━━
      const adminNames = [];

      for (const admin of adminIDs) {
        try {
          const adminID =
            typeof admin === "object"
              ? admin.id || admin.uid
              : admin;

          if (!adminID) {
            adminNames.push("♛ 𝑼𝒏𝒌𝒏𝒐𝒘𝒏");
            continue;
          }

          let name = "𝑼𝒏𝒌𝒏𝒐𝒘𝒏";

          try {
            name = await usersData.getName(adminID);
          } catch {
            try {
              const userInfo = await api.getUserInfo(adminID);
              name = userInfo[adminID]?.name || name;
            } catch {}
          }

          adminNames.push(`♛ ${name}`);
        } catch {
          adminNames.push("♛ 𝑼𝒏𝒌𝒏𝒐𝒘𝒏");
        }
      }

      // ━━━ 𝑮𝑹𝑶𝑼𝑷 𝑷𝑰𝑪𝑻𝑼𝑹𝑬 ━━━
      let attachment = null;

      try {
        const picURL =
          `https://graph.facebook.com/${threadID}/picture?width=720&height=720`;

        attachment = await global.utils.getStreamFromURL(picURL);
      } catch (error) {
        console.log("GC PIC ERROR:", error.message);
      }

      // ━━━ 𝑨𝑫𝑴𝑰𝑵 𝑳𝑰𝑺𝑻 ━━━
      const adminList = adminNames.length
        ? adminNames.map(name => `┃ ${name}`).join("\n")
        : "┃ ♛ 𝑵𝒐 𝑨𝒅𝒎𝒊𝒏 𝑭𝒐𝒖𝒏𝒅";

      // ━━━ 𝑮𝑹𝑶𝑼𝑷 𝑰𝑵𝑭𝑶 ━━━
      const msg =
`╭━━━〔 𝑮𝑪 𝑰𝑵𝑭𝑶 〕━━━╮
┃
┃ 🏷️ 𝑵𝒂𝒎𝒆
┃ ➤ ${groupName}
┃
┃ ${emoji} 𝑮𝒓𝒐𝒖𝒑 𝑬𝒎𝒐𝒋𝒊
┃ ➤ ${emoji}
┃
┣━━━━━━━━━━━━━━━━━━
┃ 👥 𝑴𝒆𝒎𝒃𝒆𝒓𝒔 ➤ ${members}
┃ 🛡️ 𝑨𝒅𝒎𝒊𝒏𝒔 ➤ ${admins}
┃
┃ 👦 𝑴𝒂𝒍𝒆 ➤ ${male}
┃ 👧 𝑭𝒆𝒎𝒂𝒍𝒆 ➤ ${female}
┃ ❔ 𝑼𝒏𝒌𝒏𝒐𝒘𝒏 ➤ ${unknown}
┃
┃ 🔐 𝑨𝒑𝒑𝒓𝒐𝒗𝒂𝒍 ➤ ${approval}
┣━━━━━━━━━━━━━━━━━━
┃ 👑 𝑮𝑹𝑶𝑼𝑷 𝑨𝑫𝑴𝑰𝑵𝑺
${adminList}
┣━━━━━━━━━━━━━━━━━━
┃ 🤖 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝑩𝒚
┃ ➤ 𝑺𝑯𝑰𝑺𝑯𝑰𝑹 𝑩𝑶𝑻 🖤
╰━━━━━━━━━━━━━━━━━━╯`;

      // ━━━ 𝑺𝑬𝑵𝑫 𝑴𝑬𝑺𝑺𝑨𝑮𝑬 ━━━
      return api.sendMessage(
        attachment
          ? {
              body: msg,
              attachment: attachment
            }
          : msg,
        threadID
      );

    } catch (error) {
      console.error("GCINFO ERROR:", error);

      return api.sendMessage(
        "❌ 𝑮𝒓𝒐𝒖𝒑 𝒊𝒏𝒇𝒐 𝒇𝒆𝒕𝒄𝒉 𝒌𝒐𝒓𝒂 𝒋𝒂𝒚𝒏𝒊।",
        threadID
      );
    }
  }
};
