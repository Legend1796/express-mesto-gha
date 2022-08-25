const express = require('express');
const path = require('path');

const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

const { userRouters } = require('./routes/user');

app.use(express.static(path.join(__dirname, 'public')));

app.use(userRouters);

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
  });

  await app.listen(PORT);

  console.log(`App listening on port ${PORT}`);
}

main();
