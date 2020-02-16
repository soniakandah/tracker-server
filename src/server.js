'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

// Esoteric Resources
const oauth = require('./oauth/oauth-router');

// Prepare the express app
const app = express();

// App Level MW
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res, next) => {
    res.send('API up and running');
});

app.use(oauth);

module.exports = {
    server: app,
    start: port => {
        const PORT = port || process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`Server Up on ${PORT}`);
        });

        // Start up DB Server
        if (process.env.MONGODB_URI) {
            const PATH = process.env.MONGODB_URI;
            const options = {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true,
            };

            mongoose.connect(PATH, options);
        }
    },
};
