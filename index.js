// index.js (backend)
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
const app = express();

// otetaan cors käyttöön
app.use(cors());
// Etsitään build-tiedostoa
app.use(express.static('build'));
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

// Näytetään etusivu
app.get('/', (_req, res) => {
  res.send('<h1>It is me, the puhelinluettelo!</h1>');
});

// Näytetään ../info-sivu
app.get('/info', (_req, res) => {
  Person.find({}).then((result) => {
    res.send(
      `<p>Phonebook has info for ${result.length} people</p>
       <p>${new Date()}</p>`
    );
  });
});

// Näytetään ../persons-sivu
app.get('/api/persons', (_req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

// Näytetään yksittäinen resurssi
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) res.json(person);
      if (!person) res.status(400).end();
    })
    .catch((err) => next(err));
});

// Poistetaan yksittäinen resurssi
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

// Lisätään yksittäinen resurssi

app.post('/api/persons', (req, res, next) => {
  const body = req.body;

  if (!body.name) return res.status(400).json({ error: 'Name is missing' });

  if (!body.number) return res.status(400).json({ error: 'Number is missing' });

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((err) => next(err));
});

// RESURSSIN MUOKKAAMINEN (HTTP PUT)

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body;

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((err) => next(err));
});

// Virheiden käsittely middleware

const unknownEndpoint = (_req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

// Olemattomien osoitteiden käsittely
app.use(unknownEndpoint);

const errorHandler = (err, _req, res, next) => {
  console.log(err.message);
  if (err.name === 'CastError')
    return res.status(400).send({ error: 'malformatted id' });

  if (err.name === 'ValidationError')
    return res.status(400).json({ error: err.message });

  next(err);
};

// Virheellisten pyyntöjen käsittely.
app.use(errorHandler);

// Palvelin kuittaa
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// TEHTY
// 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 3.11, 3.12, 3.13, 3.14, 3.15, 3.16, 3.17, 3.18, 3.19, 3.20, 3.21, 3.22
