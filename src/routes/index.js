const express = require('express');
const res = require('express/lib/response');
const { VueElement } = require('vue');
const router = express.Router();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//login
const datos = {};

router.get('/enfermera', (request, response) => {

        datos.title = 'Getsoft ERP';
        response.render('enfermera', datos);
});

module.exports = router;
