const { GoatWrapper } = require('fca-liane-utils');
const axios = require('axios');
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

			const ownerInfo = {
				name: '𝗔𝗵𝗺𝗲𝗱 𝗦𝗵𝗶𝘀𝗵𝗶𝗿',
				age: '𝟭𝟳 𝗬𝗲𝗮𝗿𝘀 𝗢𝗹𝗱',
				gender: '𝗠𝗮𝗹𝗲',
				status: '𝗦𝘁𝘂𝗱𝗲𝗻𝘁',
				location: '𝗦𝗶𝗿𝗮𝗷𝗴𝗮𝗻𝗷, 𝗕𝗮𝗻𝗴𝗹𝗮𝗱𝗲𝘀𝗵',
				hobby: '𝗖𝗼𝗱𝗶𝗻𝗴 & 𝗧𝗲𝗰𝗵𝗻𝗼𝗹𝗼𝗴𝘆',
				relationship: '𝗦𝗶𝗻𝗴𝗹𝗲',
				fb: 'https://facebook.com/share/19STNvexB1/',
				bio: '𝗞𝗲𝗲𝗽 𝗖𝗮𝗹𝗺 & 𝗖𝗼𝗱𝗲 𝗢𝗻 🖤'
			};

			// তোমার direct MP4 link এখানে বসাবে
			const videoUrl = 'https://i.imgur.com/SyBjkss.mp4';

			const tmpFolderPath = path.join(__dirname, 'tmp');

			await fs.ensureDir(tmpFolderPath);

			const videoPath = path.join(
				tmpFolderPath,
				`shishir_owner_${Date.now()}.mp4`
			);

			const videoResponse = await axios.get(videoUrl, {
				responseType: 'arraybuffer',
				timeout: 30000
			});

			await fs.writeFile(
				videoPath,
				Buffer.from(videoResponse.data)
			);

			const response = `
╭━━━〔 𝗦𝗛𝗜𝗦𝗛𝗜𝗥 𝗢𝗪𝗡𝗘𝗥 〕━━━╮

✦ 𝗡𝗮𝗺𝗲 : ${ownerInfo.name}
✦ 𝗔𝗴𝗲 : ${ownerInfo.age}
✦ 𝗚𝗲𝗻𝗱𝗲𝗿 : ${ownerInfo.gender}
✦ 𝗦𝘁𝗮𝘁𝘂𝘀 : ${ownerInfo.status}
✦ 𝗟𝗼𝗰𝗮𝘁𝗶𝗼𝗻 : ${ownerInfo.location}
✦ 𝗛𝗼𝗯𝗯𝘆 : ${ownerInfo.hobby}
✦ 𝗥𝗲𝗹𝗮𝘁𝗶𝗼𝗻𝘀𝗵𝗶𝗽 : ${ownerInfo.relationship}

╭─〔 𝗦𝗢𝗖𝗜𝗔𝗟 〕─╮
│ 🔗 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 :
│ ${ownerInfo.fb}
╰──────────────╯

╭─〔 𝗕𝗜𝗢 〕─╮
│ ${ownerInfo.bio}
╰───────────╯

╰━━━〔 𝗠𝗔𝗗𝗘 𝗕𝗬 𝗦𝗛𝗜𝗦𝗛𝗜𝗥 〕━━━╯
`;

			await api.sendMessage(
				{
					body: response,
					attachment: fs.createReadStream(videoPath)
				},
				event.threadID,
				event.messageID
			);

			// ফাইল পাঠানোর পর temporary video delete
			await fs.remove(videoPath);

			api.setMessageReaction(
				'🚀',
				event.messageID,
				() => {},
				true
			);

		} catch (error) {
			console.error(
				'❌ Error in owner2 command:',
				error
			);

			return api.sendMessage(
				'❌ 𝗦𝗼𝗿𝗿𝘆! 𝗢𝘄𝗻𝗲𝗿 𝗶𝗻𝗳𝗼 𝗽𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝗲𝗿𝗿𝗼𝗿.',
				event.threadID,
				event.messageID
			);
		}
	}
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
