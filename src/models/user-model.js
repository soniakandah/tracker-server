'use strict';

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

/**
 * The schema definition for a user record
 * @type {mongoose.Schema}
 */
const users = new mongoose.Schema({
    email: { type: String, required: true },
    fname: { type: String },
    lname: { type: String },
    profile: { type: String },
});

/**
 * This function generates a JSON Web Token from a user's id and the application's secret
 * Because this is a methods function, `this` refers to an individual user record
 * @return {string} The generated jwt token
 */
users.methods.generateToken = function() {
    let token = {
        id: this._id,
    };

    let secret = process.env.SECRET;
    return jwt.sign(token, secret);
};

/**
 * Exporting a mongoose model generated from the above schema, statics, methods and middleware
 * @type {mongoose model}
 */
module.exports = mongoose.model('users', users);
