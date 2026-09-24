const { GoatWrapper } = require('fca-liane-utils');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
	config: {
		name: "owner2",
		author: "Ahmed Shishir",
		role: 0,
		shortDescription: "Owner Information",
		longDescription: "Shows SHISHIR owner information.",
		category: "admin",
		guide: "{pn}"
	},

	onStart: async function ({ api, event }) {
		try {
			const videoPath = path.join(__dirname, "28084.mp4");

			if (!fs.existsSync(videoPath)) {
				return api.sendMessage(
					"❌ 28084.mp4 ফাইলটি owner2.js-এর একই folder-এ নেই!",
					event.threadID,
					event.messageID
				);
			}

			const response = `
╭━━━〔 𝗦𝗛𝗜𝗦𝗛𝗜𝗥 𝗢𝗪𝗡𝗘𝗥 〕━━━╮

✦ 𝗡𝗮𝗺𝗲 : 𝗔𝗵𝗺𝗲𝗱 𝗦𝗵𝗶𝘀𝗵𝗶𝗿
✦ 𝗔𝗴𝗲 : 𝟭𝟳 𝗬𝗲𝗮𝗿𝘀 𝗢𝗹𝗱
✦ 𝗚𝗲𝗻𝗱𝗲𝗿 : 𝗠𝗮𝗹𝗲
✦ 𝗦𝘁𝗮𝘁𝘂𝘀 : 𝗦𝘁𝘂𝗱𝗲𝗻𝘁
✦ 𝗟𝗼𝗰𝗮𝘁𝗶𝗼𝗻 : 𝗦𝗶𝗿𝗮𝗷𝗴𝗮𝗻𝗷, 𝗕𝗮𝗻𝗴𝗹𝗮𝗱𝗲𝘀𝗵
✦ 𝗛𝗼𝗯𝗯𝘆 : 𝗖𝗼𝗱𝗶𝗻𝗴 & 𝗧𝗲𝗰𝗵𝗻𝗼𝗹𝗼𝗴𝘆
✦ 𝗥𝗲𝗹𝗮𝘁𝗶𝗼𝗻𝘀𝗵𝗶𝗽 : 𝗦𝗶𝗻𝗴𝗹𝗲

╭─〔 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞 〕─╮
│ ${"https://facebook.com/share/19STNvexB1/"}
╰────────────────╯

╭─〔 𝗕𝗜𝗢 〕─╮
│ 𝗞𝗲𝗲𝗽 𝗖𝗮𝗹𝗺 & 𝗖𝗼𝗱𝗲 𝗢𝗻 🖤
╰───────────╯

╰━━━〔 𝗠𝗔𝗗𝗘 𝗕𝗬 𝗦𝗛𝗜𝗦𝗛𝗜𝗥 〕━━━╯
`;

			await api.sendMessage({
				body: response,
				attachment: fs.createReadStream(videoPath)
			}, event.threadID, event.messageID);

			api.setMessageReaction(
				"🚀",
				event.messageID,
				() => {},
				true
			);

		} catch (error) {
			console.error("OWNER2 ERROR:", error);

			return api.sendMessage(
				`❌ 𝗢𝘄𝗻𝗲𝗿 𝗶𝗻𝗳𝗼 𝗲𝗿𝗿𝗼𝗿:\n${error.message}`,
				event.threadID,
				event.messageID
			);
		}
	}
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
