
import fs from 'fs';
import https from 'https';
// server.js
import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';

const app = express();
const port = 4000;


app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());
const openai = new OpenAI()


// Endpoint to handle OpenAI API requests
app.post('/api/openai/completions', async (req, res) => {
    try {
        const { messages, model, max_tokens } = req.body;
        console.log(model);
        const completion = await openai.chat.completions.create({
            messages,
            model,
            max_tokens
        });

        res.json(completion.choices[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });

https
  .createServer(
    {
      key: fs.readFileSync("server.key"),
      cert: fs.readFileSync("server.crt"),
    },
    app
  )
  .listen(4000, () => {
    console.log("serever is runing at port 4000");
  });

app.get('/', (req, res) => {
    res.send("Hello from express server.");
});