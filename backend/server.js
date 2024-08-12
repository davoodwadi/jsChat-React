import {getDB, getUser, addUser, getAllMatchingUsers, getLatestSession, updateInfo, addSaveContainer, id2User} from './mongo.js' 
import express from 'express'
import session from 'express-session';
import path from 'path'
import { fileURLToPath } from 'url';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { load, save, signup, login, authenticate, logout, profile, test } from './loginRequests.js';
import { getHfCompletions, getStreamGPT, headStreamGpt, hfCompletions, hfCompletions70b, hfCompletions8b, streamGpt } from './apiRequests.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const isHttps = true;
const port = process.env.PORT || 3000;

const app = express();
console.log('process.env.NODE_ENV')
console.log(process.env.NODE_ENV)

// const allowedOrigins = [
//   'http://localhost:3000', // Development
//   'http://127.0.0.1:3000',
//   'https://start.intelchain.io',     // Production domain
//   'https://chat.intelchain.io',     // Production domain
//   'https://db.intelchain.io',     // Production domain
//   'https://jschatapi.onrender.com',
// ];

// app.use(cors({
//   origin: (origin, callback) => {
//       console.log('Incoming Origin:', origin); // Log the incoming request origin
//       // Allow requests with no origin (like mobile apps or curl requests)
//       if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//           console.log('passing the request')
//           callback(null, true);
//       } else {
//           console.log('killing the request')
//           callback(new Error('Not allowed by CORS'));
//       }
//   },
//   methods: 'GET, POST, PUT, DELETE',
//   credentials: true,
// }));

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// app.use(cookieParser()); // To parse cookies from request headers

// trust first proxy
// app.set('trust proxy', 1)
// Add session middleware
// app.use(session({
//     secret: process.env.SESSION_SECRET || 'default_secret',  // replace with a strong secret
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days (adjust as necessary)
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production', // Use secure flag in production
//         sameSite: 'Lax', // None for cross-site in production
//         domain: '.intelchain.io',

//     }
// }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false
}))

app.use(express.json())


// Route for the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// test session storage
app.get('/test-session', test);

app.post('/users/load', load);
app.post('/users/save', save);

app.post('/users/signup', signup)
app.post('/users/login', login);
app.get('/users/logout', logout);

app.get('/users/profile', authenticate, profile);



// LLM calls start
// Endpoint to handle API requests
// app.get("/", (req, res) => res.type('html').send(html));
// openai endpoint
app.post('/api/gpt/completions/stream', streamGpt);
// Adding a HEAD method for the touch
app.head('/api/gpt/completions/stream', headStreamGpt);
app.get('/api/gpt/completions/stream', getStreamGPT);

app.post('/api/hf/8b/completions', hfCompletions8b);
app.post('/api/hf/70b/completions', hfCompletions70b);
app.post('/api/hf/completions', hfCompletions);
app.get('/api/hf/completions', getHfCompletions);
// LLM calls end

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});