require("dotenv").config();
const { App } = require("@slack/bolt");
const patterns = require("./patterns.json");

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000,
});

for (let words of patterns) {
  const { pattern, response, suggestion } = words;
  let regexPattern = new RegExp(pattern, "gi");
  const hasSuggestion = suggestion
    ? {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: "🌈 *Você pode dizer* " + `${suggestion}`,
          },
        ],
      }
    : {};

  app.message(regexPattern, async ({ message, client }) => {
    try {
      await client.chat.postEphemeral({
        channel: message.channel,
        user: message.user,
        blocks: [
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
                text: "🤔 *Porque corrigir?* " + response,
              },
            ],
          },
          hasSuggestion,
        ],
        text: "Deu algo de errado com as nossas sugestões 😔",
      });
    } catch (error) {
      console.error(error);
    }
  });
}

(async () => {
  await app.start();

  console.log("⚡️ Bolt app is running!");
})();
