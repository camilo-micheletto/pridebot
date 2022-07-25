const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");
const fs = require("fs");
const path = require("path");

const client = new SSMClient({ region: "us-east-2" });

async function getParameterValue(parameterName) {
	const input = {
		Name: parameterName,
		WithDecryption: true
	};

	const command = new GetParameterCommand(input);
	const response = await client.send(command);
	return response.Parameter?.Value;
}

(async () => {
	const GOOGLE_EMAIL = await getParameterValue("PRIDE_BOT_GOOGLE_EMAIL");
	const GOOGLE_KEY = await getParameterValue("PRIDE_BOT_GOOGLE_KEY");
	const GOOGLE_SHEET = await getParameterValue("PRIDE_BOT_GOOGLE_SHEET");
	const SLACK_APP_TOKEN = await getParameterValue("PRIDE_BOT_SLACK_APP_TOKEN");
	const SLACK_BOT_TOKEN = await getParameterValue("PRIDE_BOT_SLACK_BOT_TOKEN");
	const SLACK_SIGNING_SECRET = await getParameterValue("PRIDE_BOT_SLACK_SIGNING_SECRET");

	const configSting = 
`GOOGLE_EMAIL=${GOOGLE_EMAIL}
GOOGLE_KEY="${GOOGLE_KEY}"
GOOGLE_SHEET=${GOOGLE_SHEET}
SLACK_APP_TOKEN=${SLACK_APP_TOKEN}
SLACK_BOT_TOKEN=${SLACK_BOT_TOKEN}
SLACK_SIGNING_SECRET=${SLACK_SIGNING_SECRET}`;

	fs.writeFileSync(path.join(__dirname, "../.env"), configSting);
})();

