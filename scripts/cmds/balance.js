"use strict";

const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { Canvas, loadImage } = require("canvas");

module.exports = {
	config: {
		name: "balance",
		aliases: ["bal"],
		version: "1.4",
		author: "shishir",
		countDown: 5,
		role: 0,

		shortDescription: {
			en: "View your wealth card."
		},

		longDescription: {
			en: "View your wealth card and global economy rank."
		},

		category: "economy",

		guide: {
			en: "{pn} | {pn} @tag | {pn} [reply]"
		},

		envConfig: {
			ACCESS_TOKEN: "YOUR_FACEBOOK_ACCESS_TOKEN"
		}
	},

	onStart: async function ({
		usersData,
		message,
		event,
		envCommands
	}) {
		const {
			senderID,
			mentions = {},
			type,
			messageReply
		} = event;

		// ==============================
		// CONFIG
		// ==============================

		const ACCESS_TOKEN =
			envCommands?.balance?.ACCESS_TOKEN ||
			this.config.envConfig.ACCESS_TOKEN;

		const BACKGROUND_URL =
			"https://i.imgur.com/4d1N3jV.jpeg";

		// ==============================
		// MONEY FORMAT
		// ==============================

		const formatMoney = (n) => {
			n = Number(n) || 0;

			const units = [
				{ value: 1e303, symbol: "Ct" },
				{ value: 1e100, symbol: "Googol" },
				{ value: 1e93, symbol: "Tg" },
				{ value: 1e90, symbol: "NVg" },
				{ value: 1e87, symbol: "OVg" },
				{ value: 1e84, symbol: "SVg" },
				{ value: 1e81, symbol: "SxVg" },
				{ value: 1e78, symbol: "QVg" },
				{ value: 1e75, symbol: "QaVg" },
				{ value: 1e72, symbol: "TVg" },
				{ value: 1e69, symbol: "DVg" },
				{ value: 1e66, symbol: "UVg" },
				{ value: 1e63, symbol: "V" },
				{ value: 1e60, symbol: "ND" },
				{ value: 1e57, symbol: "OD" },
				{ value: 1e54, symbol: "SD" },
				{ value: 1e51, symbol: "SxD" },
				{ value: 1e48, symbol: "QD" },
				{ value: 1e45, symbol: "QaD" },
				{ value: 1e42, symbol: "TD" },
				{ value: 1e39, symbol: "DD" },
				{ value: 1e36, symbol: "UD" },
				{ value: 1e33, symbol: "Dc" },
				{ value: 1e30, symbol: "No" },
				{ value: 1e27, symbol: "Oc" },
				{ value: 1e24, symbol: "Sp" },
				{ value: 1e21, symbol: "Sx" },
				{ value: 1e18, symbol: "Qa" },
				{ value: 1e15, symbol: "Q" },
				{ value: 1e12, symbol: "T" },
				{ value: 1e9, symbol: "B" },
				{ value: 1e6, symbol: "M" },
				{ value: 1e3, symbol: "K" }
			];

			for (const u of units) {
				if (n >= u.value) {
					return (n / u.value).toFixed(2) + u.symbol;
				}
			}

			return n.toLocaleString("en-US");
		};

		// ==============================
		// GET ALL USERS
		// ==============================

		const allUsers = await usersData.getAll();

		const combinedData = allUsers
			.map(user => ({
				uid: String(user.userID),
				name: user.name || "Facebook User",
				money: Number(user.money) || 0
			}))
			.sort((a, b) => b.money - a.money);

		combinedData.forEach((user, index) => {
			user.rank = index + 1;
		});

		// ==============================
		// TARGET USER
		// ==============================

		let targetUsers = [];

		if (
			type === "message_reply" &&
			messageReply?.senderID
		) {
			targetUsers = [String(messageReply.senderID)];
		}
		else if (
			mentions &&
			Object.keys(mentions).length > 0
		) {
			targetUsers = Object.keys(mentions);
		}
		else {
			targetUsers = [String(senderID)];
		}

		// ==============================
		// CREATE CACHE FOLDER
		// ==============================

		const cacheDir = path.join(__dirname, "cache");

		await fs.ensureDir(cacheDir);

		// ==============================
		// CREATE CARD
		// ==============================

		for (const uid of targetUsers) {

			const user =
				combinedData.find(u => u.uid === String(uid)) ||
				{
					uid: String(uid),
					name: "Unknown",
					money: 0,
					rank: "N/A"
				};

			const canvas = new Canvas(800, 600);
			const ctx = canvas.getContext("2d");

			// ==========================
			// BACKGROUND
			// ==========================

			try {
				const bg = await loadImage(BACKGROUND_URL);

				ctx.drawImage(
					bg,
					0,
					0,
					800,
					600
				);
			}
			catch (error) {
				ctx.fillStyle = "#1a1a1a";
				ctx.fillRect(0, 0, 800, 600);
			}

			// Dark overlay
			ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
			ctx.fillRect(0, 0, 800, 600);

			// ==========================
			// TITLE
			// ==========================

			ctx.textAlign = "center";
			ctx.fillStyle = "#FFD700";
			ctx.font = "bold 40px Arial";

			ctx.fillText(
				"WEALTH CARD",
				400,
				60
			);

			// ==========================
			// AVATAR
			// ==========================

			try {

				if (
					ACCESS_TOKEN &&
					ACCESS_TOKEN !== "YOUR_FACEBOOK_ACCESS_TOKEN"
				) {

					const avatarURL =
						`https://graph.facebook.com/${uid}/picture` +
						`?width=512&height=512` +
						`&access_token=${ACCESS_TOKEN}`;

					const avatarRes = await axios.get(
						avatarURL,
						{
							responseType: "arraybuffer",
							timeout: 10000
						}
					);

					const avatar =
						await loadImage(avatarRes.data);

					ctx.save();

					ctx.beginPath();
					ctx.arc(
						150,
						200,
						90,
						0,
						Math.PI * 2
					);

					ctx.clip();

					ctx.drawImage(
						avatar,
						60,
						110,
						180,
						180
					);

					ctx.restore();

					// Avatar border
					ctx.beginPath();

					ctx.arc(
						150,
						200,
						92,
						0,
						Math.PI * 2
					);

					ctx.strokeStyle = "#FFD700";
					ctx.lineWidth = 5;
					ctx.stroke();
				}

			}
			catch (error) {
				console.log(
					"[BALANCE] Avatar Error:",
					error.message
				);
			}

			// ==========================
			// USER NAME
			// ==========================

			ctx.textAlign = "left";

			ctx.fillStyle = "#FFFFFF";
			ctx.font = "bold 45px Arial";

			const displayName =
				String(user.name)
					.replace(/\n/g, " ")
					.slice(0, 15);

			ctx.fillText(
				displayName,
				270,
				180
			);

			// ==========================
			// RANK
			// ==========================

			ctx.fillStyle = "#C0C0C0";
			ctx.font = "25px Arial";

			ctx.fillText(
				`Ranked #${user.rank} Globally`,
				270,
				220
			);

			// ==========================
			// DIVIDER
			// ==========================

			ctx.fillStyle =
				"rgba(255, 255, 255, 0.2)";

			ctx.fillRect(
				50,
				320,
				700,
				2
			);

			// ==========================
			// STATUS
			// ==========================

			ctx.textAlign = "center";

			ctx.fillStyle = "#C0C0C0";
			ctx.font = "bold 24px Arial";

			ctx.fillText(
				"STATUS",
				200,
				400
			);

			ctx.fillStyle = "#FFD700";
			ctx.font = "bold 50px Arial";

			ctx.fillText(
				typeof user.rank === "number" &&
				user.rank <= 10
					? "TYCOON"
					: "CITIZEN",
				200,
				470
			);

			// ==========================
			// BALANCE
			// ==========================

			ctx.fillStyle = "#C0C0C0";
			ctx.font = "bold 24px Arial";

			ctx.fillText(
				"BALANCE",
				600,
				400
			);

			const moneyText =
				formatMoney(user.money) + "$";

			ctx.fillStyle = "#00FF00";

			ctx.font =
				moneyText.length > 10
					? "bold 40px Arial"
					: "bold 55px Arial";

			ctx.fillText(
				moneyText,
				600,
				470
			);

			// ==========================
			// SAVE IMAGE
			// ==========================

			const filePath = path.join(
				cacheDir,
				`wealth_${uid}.png`
			);

			await new Promise((resolve, reject) => {

				const out =
					fs.createWriteStream(filePath);

				const stream =
					canvas.createPNGStream();

				stream.pipe(out);

				out.on("finish", resolve);
				out.on("error", reject);
			});

			// ==========================
			// SEND IMAGE
			// ==========================

			await message.reply({
				attachment: fs.createReadStream(filePath)
			});

			// ==========================
			// DELETE CACHE
			// ==========================

			setTimeout(() => {

				fs.remove(filePath)
					.catch(() => {});

			}, 10000);
		}
	}
};

Install করার আগে: তোমার আগের "balance.js" পুরোটা delete করে এইটা বসাবে। "envConfig"-এর "YOUR_FACEBOOK_ACCESS_TOKEN" জায়গায় নিজের valid token/config ব্যবহার করবে।
