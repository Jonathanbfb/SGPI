const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

async function connectMongoDB() {
try{


    await  mongoose.connect('mongodb+srv://mestrado:projetomestrado@cluster0.cusbk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        console.log("Conectado ao mongoDB")
}
catch (err){
    console.log("Erro ao conectar ao mongoDB", Error)
}
}
connectMongoDB();
app.use(express.json());
app.use(cors());
app.use(routes);

app.listen(4557, '0.0.0.0', () => {
    console.log('listening on port 3010')
});
