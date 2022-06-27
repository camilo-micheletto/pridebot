const { SSM } = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

const argv = yargs(process.argv.slice(2)).argv;
const envName = argv.envName ?? 'dev';
const ssm = new SSM({ region: 'us-east-2' });

async function getParameterValue(parameterName) {
  const result = await ssm
    .getParameter({
      Name: parameterName,
      WithDecryption: true,
    })
    .promise();

  return result.Parameter?.Value;
}

function getParameterNameWithEnv(parameterName) {
  return envName === 'prod' ? parameterName : `${envName}-${parameterName}`;
}

module.exports = (async () => {
  const slack_signin_secret = await getParameterValue(
    getParameterNameWithEnv('slack-signin-secret')
  );
  const slack_app_token = await getParameterValue(
    getParameterNameWithEnv('slack-app-token')
  );
  const slack_bot_token = await getParameterValue(
    getParameterNameWithEnv('slack-bot-token')
  );
  const google_key = await getParameterValue(
    getParameterNameWithEnv('google-key')
  );
  const google_sheet = await getParameterValue(
    getParameterNameWithEnv('google-sheet')
  );

  const configString = `
SLACK_SIGNIN_SECRET=${slack_signin_secret}
SLACK_APP_TOKEN=${slack_app_token}
SLACK_BOT_TOKEN=${slack_bot_token}
GOOGLE_KEY=${google_key}
GOOGLE_SHEET=${google_sheet}
GOOGLE_EMAIL=pridebot@pridebot.iam.gserviceaccount.com`;

  console.log(configString);
  fs.writeFileSync(path.join(__dirname, '../credentials.env'), configStringÎ);
})();
