const express = require('express')
const fetch = require('node-fetch')
const formidable = require('express-formidable');
const fs = require('fs')
const app = express()
const port = 8080
const apiUrl = "https://api.sendgrid.com/v3"
const secrets = JSON.parse(fs.readFileSync('secrets.json', 'utf8'))
const {sendgridKey, destinationEmailAddress} = secrets

app.use(formidable());


app.post("/", async(req, res) => {

    let email = req.fields;
    console.log(email);
    let api_res = await fetch(apiUrl + "/mail/send", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sendgridKey
        },
        body: JSON.stringify({
            personalizations: [
                {
                    subject: email.subject,
                    to: [{
                        email: destinationEmailAddress
                    }]
                }
            ],
            from: {
                email: "noreply@realmayus.xyz",
                name: "Email Proxy: " + email.from
            },
            reply_to: {
                email: JSON.parse(email.envelope).from
            },
            content: [
                {
                    type: "text/html",
                    value: email.text
                }
            ]
        })
    })

    api_res = await api_res.text()
    res.json({requestBody: api_res});
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)})
