const mongoose = require('mongoose')

if (process.argv.length < 3 || process.argv.length === 4) {
  console.log('invalid arguments')
  process.exit(1)
}


const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]
const url =
  `mongodb+srv://kqlski:${password}@cluster.c2hx3.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const getPersons = () => {
  Person.find({}).then(resp => {
    console.log('phonebook:')
    resp.forEach(n => console.log(n.name, n.number))
    mongoose.connection.close()
  })
}

const addPerson = () => {


  const person = new Person({
    name,
    number
  })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}
if (process.argv.length === 3) {
  getPersons()
} else if (process.argv.length > 4)
  addPerson()