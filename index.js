const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

// cors es un middleware que permite que un servidor pueda recibir peticiones de otro servidor

// Configura CORS
app.use(cors({
    origin: 'https://miappjson-alicia-diazs-projects.vercel.app' // Reemplaza con el dominio de tu frontend
  }));





app.use(express.json());

const path = require("path");
const moviesPath = path.join(__dirname, "./data/movies.json");
const archivoJSON = fs.readFileSync(moviesPath, "utf-8");
const movies = JSON.parse(archivoJSON);

const readJSONFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) return reject(err);
            try {
                const parsedData = JSON.parse(data);
                resolve(parsedData);
            } catch (err) {
                resolve([]); // Devuelve un array vacío si el JSON no es válido
            }
        });
    });
};


const writeJSONFile = (filePath, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
};

// Rutas de películas


app.get('/movies', async (req, res) => {
    try {
        const movies = await readJSONFile('./data/movies.json');
        res.json(movies);
    } catch (err) {
        res.status(500).json({ error: 'Error leyendo el archivo de películas' });
    }
});


app.get('/movies/:id', async (req, res) => {
    try {
        const movies = await readJSONFile('./data/movies.json');
        const movie = movies.find(m => m.id === parseInt(req.params.id));
        if (!movie) return res.status(404).json({ error: 'Película no encontrada' });
        res.json(movie);
    } catch (err) {
        res.status(500).json({ error: 'Error leyendo el archivo de películas' });
    }
});




// app.post('/movies', async (req, res) => {
//     try {
//         const movies = await readJSONFile('./data/movies.json');
//         const newMovie = { id: Date.now(), ...req.body };//...req.body es para que tome todos los datos que se envian en el body
//         movies.push(newMovie);
//         await writeJSONFile('./data/movies.json', movies);
//         res.status(201).json(newMovie);
//     } catch (err) {
//         res.status(500).json({ error: 'Error guardando la película' });
//     }
// });

app.post("/movies", (req, res) => {
    // Creamos un objeto con los datos que vienen en el cuerpo de la solicitud
    const nuevaPeli = {
        // asignamos un id cada vez que se activa el método post
        id: movies.length + 1,
        // el titulo viene del cuerpo de la solicitud req.body
        title: req.body.title,
        // el director viene del cuerpo de la solicitud req.body
        director: req.body.director,
        // el año viene del cuerpo de la solicitud req.body
        year: req.body.year,
        // el género viene del cuerpo de la solicitud req.body
        genre: req.body.genre,
        // la imagen viene del cuerpo de la solicitud req.body
        image: req.body.image
    }
    // Agregamos la nueva película al array movies
    movies.push(nuevaPeli);
    // convertimos el array movies a un string JSON
    const moviesActualizado = JSON.stringify(movies, null, 2);
    // stringify convierte un objeto o valor de JavaScript en una cadena de texto JSON

    // Guardamos el array en movies.json
    // cargamos el directorio, el archivo actualizado
    // y el formato de codificación de escritura
    fs.writeFileSync(moviesPath, moviesActualizado, "utf-8");

    // Enviamos la respuesta al cliente de exito en la operación
    res.status(201).json({
        mensaje: "Película agregada correctamente",
        pelicula: nuevaPeli
    })

})


// router.post("/add", (req, res)=>{
//     // Obtenemos los datos de la nueva película
//     const {title, director, year} = req.body;

//     // Validamos que los datos no estén vacíos
//     if (!title || !director || !year){
//         return res.status(400).send("Todos los campos son requeridos");
//     }

//     // Creamos un nuevo objeto película
//     const newMovie = {
//         id: movies.length + 1,
//         title,
//         director,
//         year
//     }

//     // Agregamos la nueva película al array de películas
//     movies.push(newMovie);

//     // Convertimos el array de películas a JSON
//     const moviesJSON = JSON.stringify(movies, null, 2);

//     // Guardamos el archivo JSON
//     fs.writeFileSync(moviesPath, moviesJSON);

//     // Enviamos la nueva película
//     res.json(newMovie);
// });


app.put('/movies/:id', async (req, res) => {
    try {
        const movies = await readJSONFile('./data/movies.json');
        const index = movies.findIndex(m => m.id === parseInt(req.params.id));
        if (index === -1) return res.status(404).json({ error: 'Película no encontrada' });
        movies[index] = { ...movies[index], ...req.body };
        await writeJSONFile('./data/movies.json', movies);
        res.json(movies[index]);
    } catch (err) {
        res.status(500).json({ error: 'Error actualizando la película' });
    }
});


app.delete('/movies/:id', async (req, res) => {
    try {
        const movies = await readJSONFile('./data/movies.json');
        const newMovies = movies.filter(m => m.id !== parseInt(req.params.id));
        await writeJSONFile('./data/movies.json', newMovies);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Error eliminando la película' });
    }
});

// Rutas de usuarios


app.get('/users', async (req, res) => {
    try {
        const users = await readJSONFile('./data/users.json');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Error leyendo el archivo de usuarios' });
    }
});



app.post('/users', async (req, res) => {
    try {
        const users = await readJSONFile('./data/users.json');
        const newUser = { id: Date.now(), ...req.body };
        users.push(newUser);
        await writeJSONFile('./data/users.json', users);
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: 'Error guardando el usuario' });
    }
});



app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});