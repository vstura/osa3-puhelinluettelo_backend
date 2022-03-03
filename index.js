// index.js (backend)

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(cors());

// json-parser
app.use(express.json());

// morgan middleware
morgan.token('person', (req) => {
  const person = {
    name: req.body.name,
    number: req.body.number,
  };

  return JSON.stringify(person);
});

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :person'
  )
);

// persons-taulukko
let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '39-23-6423122',
  },
];

// Näytetään etusivu
app.get('/', (req, res) => {
  res.send('<h1>It is me, the puhelinluettelo!</h1>');
});

// Näytetään ../persons-sivu
app.get('/api/persons', (req, res) => {
  res.json(persons);
});

// Näytetään ../info-sivu
app.get('/info', (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`
  );
});

// Näytetään yksittäinen resurssi
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (!person) res.status(404).end();
  res.send(person);
});

// Poistetaan yksittäinen resurssi
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

// Lisätään yksittäinen resurssi
const generateId = () => Math.floor(Math.random() * 10_000);

app.post('/api/persons', (req, res) => {
  const body = req.body;
  const nameExists = persons.find(
    (p) => p.name.toLowerCase() === body.name.toLowerCase()
  );

  if (!body.name) return res.status(400).json({ error: 'Name is missing' });

  if (!body.number) return res.status(400).json({ error: 'Number is missing' });

  if (nameExists) return res.status(400).json({ error: 'Name must be unique' });

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  res.json(person);
});

// Palvelin kuittaa
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// TEHTY
// 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9,
