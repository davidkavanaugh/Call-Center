const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
const passport = require("passport");
const path = require('path');
const usersRouter = require("./routes/users");
const callCenterRouter = require('./routes/call-centers')
const clientRouter = require('./routes/clients');

const { PORT, MONGO_URI } = config;

app.use(cors());
app.use(express.json());

// Bodyparser middleware
app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );
  app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use('/api/users', usersRouter);
app.use('/api/call-centers', callCenterRouter);
app.use('/api/clients', clientRouter);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || `${PORT}`;

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

// DB Config
const db = `${MONGO_URI}`
mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('Connected to MongoDB database.');
});