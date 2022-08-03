const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const contacts = require('./data/contacts.js');
const meetings = require('./data/meetings.js');

const app = express();
app.use(morgan('dev'));
app.use(cors());

app.get('/contacts', (req, res) => {
  console.log('request to /contacts');

  res.json({ contacts });
});

app.get('/contacts/:id', (req, res) => {
  console.log('request to /contacts/:id');

  res.json({ contact: { id: ':id' } });
});

app.get('/contacts/:contactId/meetings', (req, res) => {
  console.log('request to /contacts/:id/meetings');

  res.json({ meetings: { contactId: ':contactId' } });
});

//
//
const port = 4040;
app.listen(port, () => console.log(`server on http://localhost:${port}`));
