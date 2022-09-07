const { VueElement } = require('vue');
const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));
// iniciando servidor 3000

VueElement.prototype.$dataSesion = null;
VueElement.prototype.$razonSocial = null;
VueElement.prototype.$nombreComercial = null;
VueElement.prototype.$imgUsuario = null;
VueElement.prototype.$imgSucursal = null;
VueElement.prototype.$server = 'http://localhost:5006';
//middlewares

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

//routes
app.use(require('./routes/index'));


//static files

app.listen(4006, () => {
    console.log('corriendo en el puerto   4006');

});
