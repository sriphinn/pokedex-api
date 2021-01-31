require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

//create the app as an instance of express
const app = express();
const PORT = process.env.PORT || 8000;
const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`]
const POKEDEX = require('./pokedex.json')

// MIDDLEWARE
//tell app to use morgan on every request, so we don't have to write a callback in all the requests
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'dev';
app.use(morgan(morganSetting));
app.use(cors());
app.use(helmet());  
//tell app to use validateBearerToken function on every route
app.use(validateBearerToken);

// //this code runs no matter what the route is
// //but add optional third param 'next' and it goes to the next request
// app.use((req,res,next) => {
//     // res.send('Hello World');
//     next();
// });

// ROUTES
app.get('/types', handleGetTypes);
app.get('/pokemon', handleGetPokemon);

// FUNCTIONS
function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization');
    const apiToken = process.env.API_TOKEN;
    
    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({error: 'Unathorized Request'})
    }
    // move to next middleware
    next();
}

function handleGetTypes(req,res) {
    res.json(validTypes);
}

function handleGetPokemon(req,res) {
    let response = POKEDEX.pokemon;

    // filter out pokemon by name if name query param is present
    if (req.query.name) {
        response = response.filter(pokemon => 
            pokemon.name.toLowerCase().includes(req.query.name.toLowerCase())
        )
    }
    // filter out pokemon by type is type query param is present
    if (req.query.type) {
        response = response.filter(pokemon =>
            pokemon.type.includes(req.query.type)
        )
    }
    res.json(response)
}

app.use((error, req, res, next) => {
    let response;
    if(process.env.NODE_ENV === 'production') {
        response = { error: {message: 'server error'}}
    } else {
        response = { error }
    }
    res.status(500).json(response);
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});  