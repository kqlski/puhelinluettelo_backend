const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan((tokens,req,res)=>{
    const method = tokens.method(req,res)
    const postData = method==='POST'
    ?JSON.stringify(req.body)
    :null
    return [
        method,
        tokens.url(req,res),
        tokens.status(req,res),
        tokens.res(req,res,'content-length'),'-',
        tokens['response-time'](req,res),'ms',
        postData
    ].join(' ')
}))

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendick",
        number: "39-23-6423122",
        id: 4
    }
]
console.log(persons);
//send the infopage to /info
app.get('/info', (req, res) => {
    res.send(`
        <div>
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
        </div>
        `)
})
//get all
app.get('/api/persons', (req, res) => {
    res.json(persons)
})
//get single with id
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(n => n.id === id)
    if (person)
        res.json(person)
    else
        res.status(404).end()
})

const generateId = () => Math.floor(Math.random() * 10000)
//create a new person
app.post('/api/persons', (req, res) => {

    const body = req.body
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'not enough information'
        })
    } else if (persons.find(n => n.name === body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }
    console.log(body,typeof body);
    console.log(body.name);
    console.log(body.number);
    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    persons = persons.concat(person)
    res.json(person)
})
//delete a person
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(n => n.id !== id)
    res.status(204).end()
})



const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})