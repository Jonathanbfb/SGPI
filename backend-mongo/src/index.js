const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
mongoose.connect('mongodb+srv://kaique_:NvTLWlJGFZ7mTaPv@cluster0.tu35bqx.mongodb.net/?retryWrites=true&w=majority');


app.use(express.json());
app.use(cors());
app.use(routes);

app.listen(4557, '0.0.0.0', () => {
    console.log('listening on port 3010')
});
