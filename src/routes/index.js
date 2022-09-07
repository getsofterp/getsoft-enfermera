const express = require('express');
const res = require('express/lib/response');
const { VueElement } = require('vue');
const router = express.Router();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//login
const datos = {};

router.get('/Medico', (request, response) => {

        datos.title = 'Getsoft ERP';
        response.render('medico', datos);
});

module.exports = router;
