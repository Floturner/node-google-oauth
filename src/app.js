const path = require('path');
const express = require('express');
const helmet = require('helmet');
const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
const cookieSession = require('cookie-session');

const {
	port,
	cookieSecret1,
	cookieSecret2,
	googleOauthClientID,
	googleOauthClientSecret,
} = require('./configs/venv');

const app = express();
app.set('port', port);

const GOOGLE_AUTH_OPTIONS = {
	callbackURL: '/auth/google/callback',
	clientID: googleOauthClientID,
	clientSecret: googleOauthClientSecret,
};

const COOKIE_OPTIONS = {
	name: 'session',
	maxAge: 24 * 60 * 60 * 1000,
	keys: [cookieSecret1, cookieSecret2],
};

function verifyCallback(_accessToken, _refreshToken, profile, done) {
	console.log('Google profile', profile);
	done(null, profile);
}

passport.use(new Strategy(GOOGLE_AUTH_OPTIONS, verifyCallback));
// Write session to cookie
passport.serializeUser((user, done) => {
	done(null, user.id);
});
// Read session from cookie
passport.deserializeUser((id, done) => {
	done(null, id);
});

app.use(helmet());
app.use(cookieSession(COOKIE_OPTIONS));
app.use(passport.initialize());
app.use(passport.session());

function checkLoggedIn(req, res, next) {
	console.log('Current user id:', req.user);
	const isLoggedIn = req.isAuthenticated() && req.user;

	if (!isLoggedIn) {
		return res.send('You must log in!');
	}

	next();
}

app.get(
	'/auth/google',
	passport.authenticate('google', {
		scope: ['email'],
	})
);

app.get(
	'/auth/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/failure',
		successRedirect: '/',
	})
);

app.get('/auth/logout', (req, res) => {
	req.logout();
	return res.redirect('/');
});

app.get('/secret', checkLoggedIn, (req, res) => {
	return res.send('Your personal secret value is 77!');
});

app.get('/failure', (_req, res) => {
	return res.send('Failed to log in!');
});

app.get('/', (_req, res) => {
	return res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
