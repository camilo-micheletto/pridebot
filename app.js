require("dotenv").config();
const { App } = require("@slack/bolt");
const { parsedDoc } = require("./services/gsServices");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const slackApp = new App({
	token: process.env.SLACK_BOT_TOKEN,
	signingSecret: process.env.SLACK_SIGNING_SECRET,
	socketMode: true,
	appToken: process.env.SLACK_APP_TOKEN,
	port,
});

const getPatterns = async () => {
	try {
		const docContent = await parsedDoc();
		createChatListeners(docContent);
	} catch (err) {
		console.log(err);
	}
};

/**
 * Função que retorna um bloco de resposta formatado em Block Kit.
 *  @function responseBlock
 * @param {Object} word - Objeto que contém a entrada de palavra a ser corrigida.
 * @param {string} word.explicacao - Explicação do porquê a palavra pode ser ofensiva ou excludente.
 * @param {string} word.sugestoes - Recomendação de uma palavra pra substituir o termo.
 * @param {Object} message - Objeto message que vem como response da função `.message` do slackApp.
 * @returns {Array} - Bloco de resposta formatado com as entradas da planilha referentes a palavra identificada
 */

const responseBlock = ({ explicacao, sugestoes }, message) => {
	const hasSuggestion = sugestoes
		? {
			type: "context",
			elements: [
				{
					type: "mrkdwn",
					text: "🌈 *Você pode dizer* " + `${sugestoes}`,
				},
			],
		}
		: {};

	return [
		{
			type: "context",
			elements: [
				{
					type: "mrkdwn",
					text: `Olá <@${message.user}>!`,
				},
			],
		},
		{
			type: "context",
			elements: [
				{
					type: "mrkdwn",
					text: `💬 *Você disse* "${message.text}"`,
				},
			],
		},
		{
			type: "context",
			elements: [
				{
					type: "mrkdwn",
					text: `🤔 *Porquê corrigir?*  ${explicacao}`,
				},
			],
		},
		hasSuggestion,
	];
};

const createChatListeners = (patterns) => {
	for (let words of patterns) {
		const { termo } = words;
		let regexPattern = new RegExp(termo, "gi");

		slackApp.message(regexPattern, async ({ message, client }) => {
			try {
				await client.chat.postEphemeral({
					channel: message.channel,
					user: message.user,
					blocks: responseBlock(words, message),
					text: "Deu algo de errado com as nossas sugestões 😔",
				});
			} catch (error) {
				console.error(error);
			}
		});
	}
};

(async () => {
	await getPatterns();
	await slackApp.start();

	console.log("⚡️ Bolt app is running!");
})();

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
