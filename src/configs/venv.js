require('dotenv').config();

module.exports = {
	port: process.env.PORT || 3000,
	googleOauthClientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
	googleOauthClientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
	cookieSecret1: process.env.COOKIE_SECRET_1,
	cookieSecret2: process.env.COOKIE_SECRET_2,
};
