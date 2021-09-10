const express = require('express');
const Users = require('./models/users');
const app = express();
const port = 3000;

app.post('/register', async (req, res) => {
    console.log(req);

    res.send('Hello World!');
});

app.get('/', async (req, res) => {
    console.log(await Users.findAll());
    res.send('Hello World!!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
