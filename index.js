const express = require('express');
const Users = require('./models/users');
const app = express();
const port = 3000;

app.get('/register', async (req, res) => {
    console.log(req);

    res.send('Hola soy Resister');
});

app.get('/login', async (req, res) => {
    console.log(req);
    const user = { email: 'nan_carp@hotmail.com', password: '12345' };
    Users.findOne(user);
    res.send(await Users.findOne(user));
});

app.get('/', async (req, res) => {
    console.log(await Users.findAll());
    const users = await Users.findAll();
    res.send(users);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
