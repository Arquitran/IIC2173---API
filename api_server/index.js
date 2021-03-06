const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');

// DB

//mongoose.connect('mongodb://localhost:auth/auth');
const HOST = process.env.MONGO_HOST || '127.0.0.1'
mongoose.Promise = Promise;
mongoose.connect(`mongodb://${HOST}/auth`);

// APP

app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }))
router(app);


// Server

const port = 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Listening on:', port);
