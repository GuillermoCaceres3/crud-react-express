const express = require("express");
const cors = require('cors');
const app = express();
const corsOptions = {
    origin: ['http://localhost:5173'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  };



app.use(cors(corsOptions));
app.use(express.json());



app.listen(3001, () =>{
    console.log('Se esta escuchando en el puerto 3001');
});



let personajes = [
    {id: 1, name:'Goku', Movie: 'Dragon ball'},
    {id: 2, name:'Voldemort', Movie: 'Harry Potter'}
];

//Todos los personajes
app.get("/api/personajes", (req,res) =>{
    res.json(personajes)
});

//Un solo personaje por id

app.get("/api/personajes/:id", (req,res) =>{
     const personaje = personajes.find(p => p.id === parseInt(req.params.id))
     if (!personaje) return res.status(404).send('Personaje no encontrado');
     res.json(personaje); 
})

// Crear un personaje
app.post("/api/personajes",(req,res) => {
    const newPersonaje = {
        id: personajes.length + 1,
        name: req.body.name,
        Movie: req.body.Movie
    };
    personajes.push(newPersonaje);
    res.status(201).json(newPersonaje);
})

//Actualizar un personaje por id
app.put('/api/personajes/:id', (req, res) => {
    const personaje = personajes.find(p => p.id === parseInt(req.params.id)); 
    if (!personaje) return res.status(404).send('Personaje not found'); 
    personaje.name = req.body.name; 
    personaje.Movie = req.body.Movie;
    res.json(personaje);
});

//Eliminar un personaje segun su id
app.delete('/api/personajes/:id', (req, res) => {
    const personajeIndex = personajes.findIndex(p => p.id === parseInt(req.params.id));
    if (personajeIndex === -1) return res.status(404).send('User not found'); 
    const deletedPersonaje = personajes.splice(personajeIndex, 1); 
    res.json(deletedPersonaje); 
});