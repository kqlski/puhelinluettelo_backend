require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan((tokens, req, res) => {
    const method = tokens.method(req, res)
    const postData = method === 'POST'
        ? JSON.stringify(req.body)
        : null
    return [
        method,
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        postData
    ].join(' ')
}))

//send the infopage to /info
app.get('/info', (req, res) => {
    Person.find({})
    .then(persons=>{
        res.send(`
        <div>
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
        </div>
        `)
    })
    
})
//get all
app.get('/api/persons', (req, res) => {
    Person.find({})
        .then((persons) => {
            res.json(persons)
        })

})
//get single with id
app.get('/api/persons/:id', (req, res,next) => {
    Person.findById(req.params.id)
        .then(result => {
            if (result)
                res.json(result)
            else
                res.status(404).end()
        }
        )
        .catch(error=>next(error))
})

//create a new person
app.post('/api/persons', (req, res,next) => {

    const body = req.body

    console.log(body, typeof body);
    console.log(body.name);
    console.log(body.number);
    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
    .catch(error=>next(error))
})
//update information for a person
app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    console.log(body);
    const person = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})
//delete a person
app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})
const errorHandler = (error, request, response, next) => {
    console.log(error);
    console.log('name ',error.name);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    if(error.name=='ValidationError'){
        return response.status(400).send(error.message)
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})