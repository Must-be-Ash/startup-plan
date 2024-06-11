const express = require('express');
const bodyParser = require('body-parser');
const pdf = require('html-pdf');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const configuration = new Configuration({
    apiKey: 'YOUR_OPENAI_API_KEY',
});
const openai = new OpenAIApi(configuration);

app.post('/generate-pdf', async (req, res) => {
    const idea = req.body.idea;

    try {
        const completion = await openai.createCompletion({
            model: 'text-davinci-002',
            prompt: `This is a startup idea: ${idea}. How would a supportive mother respond to this idea?`,
            max_tokens: 150,
        });

        const momResponse = completion.data.choices[0].text.trim();
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
