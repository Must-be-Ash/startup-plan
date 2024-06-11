const express = require('express');
const bodyParser = require('body-parser');
const pdf = require('html-pdf');
const axios = require('axios');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Replace with the actual endpoint and API key
const MOM_TEST_BOT_ENDPOINT = 'https://api.chatgpt.com/g/g-H7fQi3wHH-mom-test-bot';
const API_KEY = 'YOUR_API_KEY_HERE';

// Nodemailer transport configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'YOUR_EMAIL@gmail.com',
        pass: 'YOUR_EMAIL_PASSWORD'
    }
});

app.post('/send-pdf', async (req, res) => {
    const { idea, email } = req.body;

    try {
        const response = await axios.post(MOM_TEST_BOT_ENDPOINT, {
            prompt: idea
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        const momResponse = response.data.reply;
        const html = `<html><body><h1>Startup Idea Feedback</h1><p>${momResponse}</p></body></html>`;

        pdf.create(html).toStream((err, stream) => {
            if (err) return res.status(500).send(err);
            
            const mailOptions = {
                from: 'YOUR_EMAIL@gmail.com',
                to: email,
                subject: 'Your Startup Idea Feedback',
                text: 'Attached is the PDF with the feedback for your startup idea.',
                attachments: [
                    {
                        filename: 'MomTestResponse.pdf',
                        content: stream
                    }
                ]
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(500).send(error.toString());
                }
                res.status(200).send('PDF sent successfully');
            });
        });
    } catch (error) {
        res.status(500).send('Error generating response');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
