require("dotenv").config();
const { App } = require("@slack/bolt");
const { parsedDoc } = require("./services/gsServices");
const express = require('express');
const eapp = express();
const port = 3000;

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000,
});

const getPatterns = async () => {
    try {
        const doc = await parsedDoc();
        applyListeners(doc);
    } catch (err) {
        console.log(err);
    }
};

const applyListeners = (patterns) => {
  for (let words of patterns) {
    const { termo, explicacao, sugestoes } = words;
    let regexPattern = new RegExp(termo, "gi");
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
                  text: `🤔 *Porque corrigir?*  ${explicacao}`,
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
};

(async () => {
  await getPatterns();
  await app.start();

  console.log("⚡️ Bolt app is running!");
})();

eapp.get('/', (req, res) => {
  res.send('Hello World!')
})

eapp.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

