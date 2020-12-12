const express = require('express');
const { Mongoose } = require('mongoose');
const auth = require('../middleware/auth');
const router = new express.Router();
const Dog = require('../models/dog');

router.post('/dogs/signup', async (req, res) => {
    const dog = new Dog(req.body);

    try {
        await dog.save();
        const token = await dog.generateAuthToken();
        res.status(201).send({ dog, token });
    } catch(e) {
        res.status(400).send(e);
    }
});

router.post('/dogs/login', async (req, res) => {
    try {
        const dog = await Dog.findByCredentials(req.body.email, req.body.password);
        const token = await dog.generateAuthToken();

        res.send({ dog, token })
    } catch(e) {
        res.status(400).send();
    }
});

router.post('/dogs/logout', auth, async (req, res) => {
    try {
        req.dog.tokens = req.dog.tokens.filter(token => token.token !== req.token)
        await req.dog.save();
        res.status(200).send();
    } catch(e) {
        res.status(500);
    }
});

router.post('/dogs/logoutAll', auth, async (req, res) => {
    try {
        req.dog.tokens = [];
        await req.dog.save();
        res.status(200).send();
    } catch(e) {
        res.status(500);
    }
});

router.post('/dogs/onboarding', async (req, res) => {
    try {

    } catch(e) {

    }
});

router.get('/dogs/profile', auth, async (req, res) => {
    res.send(req.dog);
});

//TODO repurpose to show profiles of dogs
router.get('/dogs', auth, async (req, res) => {
    try {
        const dogs = await Dog.find({})
        res.status(200).send(dogs);
    } catch(e) {
        res.status(500).send();
    }
});

router.patch('/dogs/profile', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const updateableFields = ['name', 'email', 'age', 'password', 'spade'];
    const isValidUpdate = updates.every(update => updateableFields.includes(update));

    if(!isValidUpdate) {
        return res.status(400).send('Error: Cannot update field');
    }

    try {
        updates.forEach(update => req.dog[update] = req.body[update]);
        await req.dog.save();

        res.status(204).send(req.dog);
    } catch(e) {
        res.status(400).send(e);
    }
});


router.delete('/dogs/profile', auth, async (req, res) => {

    try {
        await req.dog.remove();
        res.status(200).send();
    } catch(e) {
        res.status(400).send(e);
    }
});


module.exports = router;