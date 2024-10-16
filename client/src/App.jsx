import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useState, useEffect } from 'react';
import axios from "axios";

function App() {

  const [personajes, setPersonajes] = useState([]);
  const [nuevoPersonaje, setNuevoPersonaje] = useState({ name: '', Movie: '' });
  const [personajeEditado, setPersonajeEditado] = useState({ id: '', name: '', Movie: '' });

  const fetchAPI = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/personajes");
      console.log(response.data)
      setPersonajes(response.data)
    } catch (error) {
      console.error('Error al obtener los personajes',error)
      
    }
  }

  useEffect(() => {
    fetchAPI();
  },[])

  const insertarPersonaje = async () =>{
    try {
      const response = await axios.post("http://localhost:3001/api/personajes", nuevoPersonaje);
      setPersonajes([...personajes,response.data])
      setNuevoPersonaje({name:'',Movie:''})
    } catch (error) {
      console.error('Error al insertar personaje',error)
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoPersonaje({...nuevoPersonaje,[name]:value})
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (personajeEditado.id) {
      actualizarPersonaje();
    } else {
      insertarPersonaje();  
    }
  };


  const actualizarPersonaje = async () => {
    try {
      const response = await axios.put(`http://localhost:3001/api/personajes/${personajeEditado.id}`, {
        name: nuevoPersonaje.name,
        Movie: nuevoPersonaje.Movie
      });

      console.log("Datos actualizados desde el servidor:", response.data);

      setPersonajes(personajes.map((personaje) => {
        console.log("Comparando:", personaje.id, "con", personajeEditado.id);
        return personaje.id === personajeEditado.id 
          ? { ...personaje, name: response.data.name, Movie: response.data.Movie } 
          : personaje;
      }));

      setPersonajeEditado({ id: '', name: '', Movie: '' });
      setNuevoPersonaje({ name: '', Movie: '' });  
    } catch (error) {
      console.error('Error al actualizar el personaje', error);
    }
  };
  

  const handleEdit = (personaje) => {
    setPersonajeEditado(personaje); 
    setNuevoPersonaje(personaje);
  };

  const eliminarPersonaje = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/personajes/${id}`);
      setPersonajes(personajes.filter(personaje => personaje.id !== id));
    } catch (error) {
      console.error('Error al eliminar personaje', error);
    }
  };


  return (
    <>
    <div className='crud'>
    <form onSubmit={handleSubmit}>
      <input type="text" name='name' placeholder='Nombre' value={nuevoPersonaje.name}
      onChange={handleInputChange} required/>
      <input type="text" name='Movie' placeholder='Pelicula' value={nuevoPersonaje.Movie}
      onChange={handleInputChange} required />
      <button type='submit'>{personajeEditado.id ? 'Actualizar' : 'Insertar'}</button>
</form>
    <table>
      <thead>
        <tr>
          <th>
            ID
          </th>
          <th>
            Nombre
          </th>
          <th>
            Pelicula
          </th>
        </tr>
      </thead>
      <tbody>
          {personajes.length > 0 ? (
            personajes.map((personaje) => (
              <tr key={personaje.id}>
                <td>{personaje.id}</td>
                <td>{personaje.name}</td>
                <td>{personaje.Movie}</td>
                <td><button onClick={() => handleEdit(personaje)}>Editar</button></td>
                <td><button onClick={() => eliminarPersonaje(personaje.id)}>Eliminar</button></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">Cargando personajes...</td>
            </tr>
          )}
      </tbody>
    </table>
    </div>

    </>
  )
}

export default App