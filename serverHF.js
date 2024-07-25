// server.js
import express from 'express';
import cors from 'cors';
// import { OpenAI } from 'openai';

import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());
// const openai = new OpenAI();

const myVariable = process.env.HF_TOKEN;
// HF-api endpoint
const hfUrl =  "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct";
// Endpoint to handle API requests
app.get("/", (req, res) => res.type('html').send(html));

app.post('/api/hf/completions', async (req, res) => {
    try {
        // const { inputs, parameters } = req.body;
        console.log('req.body');
        console.log(req.body);

        const options = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${myVariable}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        };
        console.log('options')
        console.log(options)
        let response = await fetch(hfUrl, options)
        response = await response.json()
        console.log('response')
        console.log(response)
        res.json(response)

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/hf/completions', async (req, res) => {
    try {
        console.log('welcome to node.js')
        res.json('welcome to njs')

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Davood Wadi. Welcome to HF API!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render!
    </section>
  </body>
</html>
`