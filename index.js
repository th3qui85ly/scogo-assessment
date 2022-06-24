const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({path: __dirname + '/.env'})
const app = express();

const PORT = process.env.PORT || 3030;

// database connection
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log(`Database connected!`))
.catch(console.error);

// bundling the flow to utilise json objects
app.use(express.json());

// routes for all endpoints
var routes = require('./routes/routes');
app.use('/api/', routes);
  
// server driver code/ initiation
app.listen(PORT, () => {
    console.log(`Server started at PORT : ${PORT}`)
})