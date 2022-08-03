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

  if (contact) {
    contact = { id: Date.now(), ...contact, meetings: [] };
    contacts.push(contact);

    res.status(201).json({ contact });
  } else res.status(400).json('Provide a Contact');
});

app.post('/contacts/:contactId/meetings', (req, res) => {
  const contactId = Number(req.params.contactId);
  const meeting = { id: Date.now(), contactId, ...req.body };
  const contact = isContact(contactId);

  if (contact && meeting) {
    contact.meetings = [...contact.meetings, meeting];
    res.status(201).json({ meeting });
  } else {
    !contact
      ? res.status(404).json('Contact Not Found')
      : res.status(400).json('Provide a Meeting');
  }
});

app.get('/contacts', (req, res) => res.status(200).json({ contacts }));

app.get('/contacts/:contactId', (req, res) => {
  const contactId = Number(req.params.contactId);
  const contact = isContact(contactId);

  if (contact) res.status(200).json({ contact });
  else res.status(404).json('Contact Not Found');
});

app.get('/contacts/:contactId/meetings', (req, res) => {
  const contactId = Number(req.params.contactId);
  const contact = isContact(contactId);

  if (contact) {
    const meetings = contact.meetings;
    res.status(200).json({ meetings });
  } else res.status(404).json('Contact Not Found');
});

app.put('/contacts/:contactId', (req, res) => {
  const contactId = Number(req.params.contactId);
  const contact = isContact(contactId);

  if (contact) {
    const updated = { id: contactId, ...req.body, meetings: contact.meetings };
    contacts = contacts.map(item => (item === contact ? updated : item));

    res.status(201).json({ contact: updated });
  } else res.status(404).json('Contact Not Found');
});

app.delete('/contacts/:contactId', (req, res) => {
  const contactId = Number(req.params.contactId);

  if (isContact(contactId)) {
    contacts = contacts.filter(contact => contact.id !== contactId);
    res.status(200).json('');
  } else res.status(404).json('Contact Not Found');
});

//
//
//

const port = 4040;
app.listen(port, () => console.log(`server on http://localhost:${port}`));
