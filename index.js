const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

let notes = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

// app.get('/', (request, response) => {
//   response.send('<h1>Hello World!</h1>')
// })


app.use(morgan('combined'))
app.use(cors())

app.get('/', function (req, res) {
  res.send('<h1>Hello morgan!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

//post 500 不知为何
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

app.get('/api/persons', (request, response) => {
  response.json(notes)
})

app.get('/info', (request, response) => {
  response.send(`<h1>phonebooks has info for ${notes.length} peoples</h1><h1>${new Date()}</h1>`)

})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  if (note) {
    response.send(`<h1>id: ${note.id}</h1>
                   <h1>name: ${note.name}</h1>
                   <h1>number: ${note.number}</h1>`)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

// app.use(bodyParser.json());

// morganBody(app);

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));

 
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})