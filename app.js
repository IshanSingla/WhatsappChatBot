// requirements: node.js, npm, express, body-parser, axios, dotenv
const express = require("express");
const body_parser = require("body-parser");
require("dotenv").config();
const app = express();
const axios = require("axios");

// set up the server
app.use(body_parser.json());

// home route
app.get("/", (req, res) => {
    res.status(200).send("Hello World");
});

// webhook route get for verification
app.get("/webhook", (req, res) => {
    let mode = req.query["hub.mode"];
    let challange = req.query["hub.challenge"];
    let token = req.query["hub.verify_token"];
    if (mode && token == process.env.VERIFY_TOKEN) {
        res.status(200).send(challange);
    } else {
        res.sendStatus(403);
    }
});

// webhook route post for get messages
app.post("/webhook", (req, res) => {
    if (req.body.entry) {
        // perameters from send messages
        let phon_no_id = req.body.entry[0].changes[0].value.metadata.phone_number_id;
        let from = req.body.entry[0].changes[0].value.messages[0].from;
        let name = req.body.entry[0].changes[0].value.contacts[0].profile.name;
        let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body;
        axios({
            method: "POST",
            url: `https://graph.facebook.com/v13.0/${phon_no_id}/messages?access_token=${process.env.ACCESS_TOKEN}`,
            data: {
                messaging_product: "whatsapp",
                to: from,
                text: {
                    body: `Hi.. ${name} \nI'm InducedBot Made for replying to your messages\nMade By: IshanSingla \nYou said: ${msg_body}`,
                },
            },
            headers: {
                "Content-Type": "application/json",
            },
        });
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

// set up the server port
app.listen(process.env.PORT || 3000, () => {
    console.log("webhook is listening");
});
