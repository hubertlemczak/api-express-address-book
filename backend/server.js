const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

let contacts = require('./data/contacts.js');
let meetings = require('./data/meetings.js');

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const isContact = id => contacts.find(contact => contact.id === id);

app.post('/contacts', (req, res) => {
  let contact = req.body;
  if (!contact) throw Error('provide a contact');

  contact = { id: Date.now(), ...contact, meetings: [] };
  contacts.push(contact);

  res.json({ contact });
});

app.post('/contacts/:contactId/meetings', (req, res) => {
  const contactId = Number(req.params.contactId);
  const meeting = { id: Date.now(), contactId, ...req.body };

  if (!isContact(contactId)) throw Error('Contact Not Found');
  if (!meeting) throw Error('Provide a Meeting');

  const contact = isContact(contactId);
  contact.meetings = [...contact.meetings, meeting];

  res.json({ meeting });
});

app.get('/contacts', (req, res) => {
  res.json({ contacts });
});

app.get('/contacts/:contactId', (req, res) => {
  const contactId = Number(req.params.contactId);
  const contact = isContact(contactId);

  if (!contact) throw Error('Contact Not Found');

  res.json({ contact });
});

app.get('/contacts/:contactId/meetings', (req, res) => {
  const contactId = Number(req.params.contactId);
  const contact = isContact(contactId);

  if (!contact) throw Error('Contact Not Found');

  const meetings = contact.meetings;
  res.json({ meetings });
});

app.put('/contacts/:contactId', (req, res) => {
  const contactId = Number(req.params.contactId);
  const contact = isContact(contactId);

  if (!contact) throw Error('Contact Not Found');

  const updated = { id: contactId, ...req.body, meetings: contact.meetings };
  contacts = contacts.map(item => (item === contact ? updated : item));

  res.json({ contact: updated });
});

app.delete('/contacts/:contactId', (req, res) => {
  const contactId = Number(req.params.contactId);

  if (!isContact(contactId)) throw Error('Contact Not Found');

  contacts = contacts.filter(contact => contact.id !== contactId);
  res.status(200).json();
});

//
//
//

const port = 4040;
app.listen(port, () => console.log(`server on http://localhost:${port}`));
