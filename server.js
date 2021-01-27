const express = require('express');
const morgan = require('morgan');

//create the app as an instance of express
const app = express();
//tell app to use morgan on every request
app.use(morgan('dev'));
//this code runs no matter what the route is
app.use((req,res) => {
    res.send('Hello World');
});

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

