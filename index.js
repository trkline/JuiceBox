require('dotenv').config();
const PORT = 3000;
const express = require('express');
const server = express();
const apiRouter = require('./api');
const morgan = require('morgan');
const {client} = require('./db');

client.connect();

server.use(morgan('dev'));

server.use(express.json());

server.use('/api', apiRouter);
// console.log(process.env.JWT_SECRET);
server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
});

server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
}); 