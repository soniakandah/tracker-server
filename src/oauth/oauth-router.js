'use strict';

const express = require('express');

const googleMW = require('./oauth-mw.js');
const router = express.Router();
const users = require('../models/user-model');

router.get('/google', (req, res, next) => {
    console.log('/google');
    let googleOAuthURL = process.env.GOOGLE_AUTH_SERVICE;
    let options = {
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: process.env.HOME_URL + '/google-oauth',
        scope: 'email openid profile',
        prompt: 'consent',
        response_type: 'code',
    };

    googleOAuthURL += '?';

    Object.keys(options).forEach((key, indx) => {
        googleOAuthURL += key + '=' + encodeURIComponent(options[key]);
        googleOAuthURL += '&';
    });

    res.status(200).json({ url: googleOAuthURL });
});

router.get('/google-oauth', async (req, res, next) => {
    let data = await googleMW(req);

    let user = await users.findOne({ email: data.email });

    if (!user) {
        user = new users({
            email: data.email,
            fname: data.given_name,
            lname: data.family_name,
            profile: data.picture,
        });

        user.save();
    }

    let token = user.generateToken();

    res.status(200).json({ user, token });
});

module.exports = router;
