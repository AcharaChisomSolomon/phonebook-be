const personsRouter = require('express').Router()
const Person = require('../models/person')


personsRouter.get('/', (request, response) => {
    Person.find({}).then((people) => {
        response.json(people);
    });
})

personsRouter.get('/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then((person) => {
        response.json(person);
        })
        .catch((error) => next(error));
})

personsRouter.post('/', (request, response, next) => {
    const body = request.body;

    const newPerson = new Person({
      name: body.name,
      number: body.number,
    });

    newPerson
      .save()
      .then((newPer) => {
        response.json(newPer);
      })
      .catch((error) => next(error));
})

personsRouter.delete('/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
      .then((deletedPerson) => {
        response.json(deletedPerson);
      })
      .catch((error) => next(error));
})

personsRouter.put('/:id', (request, response, next) => {
    const { name, number } = request.body;

    Person.findByIdAndUpdate(
      request.params.id,
      { name, number },
      { new: true, runValidators: true, context: "query" }
    )
      .then((updatedPerson) => {
        response.json(updatedPerson);
      })
      .catch((error) => next(error));
})


module.exports = personsRouter