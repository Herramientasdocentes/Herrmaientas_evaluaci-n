const { google } = require('googleapis');

async function getAuthenticatedClient(user) {
  const credentials = require('../credentials.json');
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  oAuth2Client.setCredentials({
    access_token: user.googleAccessToken,
    refresh_token: user.googleRefreshToken,
    expiry_date: user.googleExpiryDate,
    token_type: user.googleTokenType,
    scope: user.googleScope,
  });

  return oAuth2Client;
}

module.exports = { getAuthenticatedClient };
