const {Sequelize, DataTypes} = require('sequelize');
const express = require('express');
const router = express.Router();
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_URL);

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        if(process.env.FORMAT === 1)
            await sequelize.sync({force: true});
        console.log('Running on 0.0.0.0:3000');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})()

const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        default: '',
    },
    price: {
        type: DataTypes.DECIMAL,
        default: 0,
    }
}, {});

router.post('/', async function (req, res) {
    if (req.body.name === undefined || req.body.name.trim() === '' || req.body.price < 0)
        return res.sendStatus(400);
    await Product.create({
        name: req.body.name,
        price: req.body.price
    });
    res.sendStatus(200);
});

router.get('/', async function (req, res) {
    if(!['ASC','DESC'].includes(req.query['sort'].toUpperCase()) || !['price','name'].includes(req.query['sortField'].toLowerCase()) || req.query['pageIndex']==="" || req.query['pageIndex']<0 || req.query['pageSize'] === "" || req.query['pageSize']<0)
        return res.sendStatus(400);
    res.send(await Product.findAll({
        attributes: ['id', 'name', 'price'],
        offset: req.query['pageSize'] * (req.query['pageIndex']-1),
        limit: req.query['pageSize'],
        order: [[req.query['sortField'].toLowerCase(), req.query['sort'].toUpperCase()]],
    }));
});

router.get('/count', async function (req, res) {
    res.send(`${await Product.count()}`);
});

router.delete('/', async function (req, res) {
    await Product.destroy({
        where: {},
        truncate: true
    })
    res.sendStatus(200);
});

router.get('/expensivest', async function (req, res) {
    res.json(await Product.findAll({
        attributes: ['id', 'name', 'price'],
        where: {
            price: await Product.max('price'),
        },
    }));
});

router.get('/cheapest', async function (req, res) {
    res.json(await Product.findAll({
        attributes: ['id', 'name', 'price'],
        where: {
            price: await Product.min('price'),
        },
    }));
});

router.get('/median', async function (req, res) {
    let productCount = await Product.count();
    let medianProductCount = productCount % 2 === 0 ? 2 : 1;
    res.send(await Product.findAll({
        attributes: ['id', 'name', 'price'],
        offset: Math.floor(productCount / 2),
        limit: medianProductCount,
        order: [['price', 'ASC']],
    }));
});

router.get('/:id', async function (req, res) {
    res.json(await Product.findAll({
        attributes: ['id', 'name', 'price'],
        where: {
            id: req.params.id,
        },
    }));
});

router.delete('/:id', async function (req, res) {
    await Product.destroy({
        attributes: ['id', 'name', 'price'],
        where: {
            id: req.params.id ,
        },
    });
    res.sendStatus(200);
});

module.exports = router;
