require('dotenv').config();
const express = require('express');
const Users = require('./models/users');
const Products = require('./models/products');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const SellDetails = require('./models/sellDetails');
const SellProducts = require('./models/sellProducts');
const app = express();
const port = 3000;
const ADMIN_ID = 1000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/register', async (req, res) => {
    try {
        const user = await Users.create({
            profile: 1001,
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
        });

        res.send({
            user: {
                email: user.getDataValue('email'),
                profile: user.getDataValue('profile'),
                id: user.getDataValue('id'),
                name: user.getDataValue('name'),
            },
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/users/:id', async (req, res) => {
    try {
        const userDecoded = jwt.verify(req.headers['x-access-token'], process.env.jwt_private_key);
        if (req.body.id === userDecoded.id || userDecoded.profile === ADMIN_ID) {
            const user = await Users.update(
                {
                    profile: req.body.profile,
                    email: req.body.email,
                    password: req.body.password,
                    name: req.body.name,
                },
                { where: { id: req.params.id } }
            );

            res.send({
                user: {
                    id: req.params.id,
                    profile: req.body.profile,
                    email: req.body.email,
                    password: req.body.password,
                    name: req.body.name,
                },
            });
        } else {
            return res.status(403).send('Unauthorized');
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/login', async (req, res) => {
    try {
        const users = await Users.findAll({
            where: {
                email: req.body.email,
                password: req.body.password,
            },
        });

        if (users.length > 0) {
            const user = users[0];
            const accessToken = jwt.sign(
                { id: user.id, email: user.email, profile: user.profile, name: user.name },
                process.env.jwt_private_key,
                { expiresIn: '1h' }
            );

            res.send({ id: user.id, email: user.email, profile: user.profile, name: user.name, accessToken });
        } else {
            throw new Error('User or password is not exist');
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/products', async (req, res) => {
    try {
        const userDecoded = jwt.verify(req.headers['x-access-token'], process.env.jwt_private_key);

        const newProduct = {
            name: req.body.name,
            description: req.body.description,
            owner: userDecoded.id,
            price: req.body.price,
            created: Date.now(),
        };

        const response = await Products.create(newProduct);
        res.send({ ...newProduct, id: response.getDataValue('id') });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.put('/products/:product_id', async (req, res) => {
    try {
        jwt.verify(req.headers['x-access-token'], process.env.jwt_private_key);

        const newProduct = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
        };

        await Products.update(newProduct, { where: { id: req.params.product_id } });
        res.send({ ...newProduct, id: req.params.product_id });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.delete('/products/:product_id', async (req, res) => {
    try {
        jwt.verify(req.headers['x-access-token'], process.env.jwt_private_key);

        await Products.destroy({ where: { id: req.params.product_id } });
        res.send({ id: req.params.product_id });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/products', async (req, res) => {
    try {
        let query = {};
        const { searchText, minPrice, maxPrice, owner } = req.query;

        if (searchText) {
            const value = {
                [Op.like]: '%' + searchText + '%',
            };

            const fields = ['name', 'description'];

            query[Op.or] = {};
            fields.forEach((item) => (query[Op.or][item] = value));
        }

        if (minPrice && maxPrice) {
            query.price = { [Op.between]: [+minPrice, +maxPrice] };
        }
        if (owner) {
            query.owner = owner;
        }

        const products = await Products.findAll({ where: query });

        res.send(products);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/sell', async (req, res) => {
    try {
        jwt.verify(req.headers['x-access-token'], process.env.jwt_private_key);

        let total = 0;
        req.body.products.forEach(function (item) {
            total = total + item.price;
        });
        if (req.body.discount) {
            total = total * (1 - req.body.discount / 100);
        }

        const newSell = {
            description: req.body.description,
            client: req.body.client,
            total: total,
            discount: req.body.discount,
            created: Date.now(),
        };

        const sellResponse = await SellDetails.create(newSell);

        for (let index = 0; index < req.body.products.length; index++) {
            const product = req.body.products[index];

            const data = {
                product: product.id,
                sellDetails: sellResponse.getDataValue('id'),
            };

            await SellProducts.create(data);
        }

        res.send({ sellId: sellResponse.getDataValue('id') });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/sell', async (req, res) => {
    try {
        jwt.verify(req.headers['x-access-token'], process.env.jwt_private_key);
        const sellDetails = await SellDetails.findAll();
        res.send(sellDetails);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/', async (req, res) => {
    const users = await Users.findAll();
    res.send(users);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
