const express = require('express');
const bodyParser = require('body-parser');
const pdf = require('html-pdf');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Replace with the actual endpoint and API key
const MOM_TEST_BOT_ENDPOINT = 'https://api.chatgpt.com/g/g-H7fQi3wHH-mom-test-bot';
const API_KEY = 'YOUR_API_KEY_HERE';

app.post('/generate-pdf', async (req, res) => {
    const idea = req.body.idea;

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
            res.setHeader('Content-type', 'application/pdf');
            stream.pipe(res);
        });
    } catch (error) {
        res.status(500).send('Error generating response');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
