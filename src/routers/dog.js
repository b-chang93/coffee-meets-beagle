const express = require('express');
const { Mongoose } = require('mongoose');
const router = new express.Router();
const Dog = require('../models/dog');

router.post('/dogs', async (req, res) => {
    const dog = new Dog(req.body)

    try {
        await dog.save() 
        res.status(201).send(dog)
    } catch(e) {
        res.status(400).send(e);
    }
})

router.get('/dogs', async (req, res) => {
    try {
        const dogs = await Dog.find({})
        res.status(200).send(dogs);
    } catch(e) {
        res.status(500).send();
    }
});

router.patch('/dogs/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const updateableFields = ['name', 'email', 'age', 'password', 'spade'];
    const isValidUpdate = updates.every(update => updateableFields.includes(update));

    if(!isValidUpdate) {
        return res.status(400).send('Error: Cannot update field');
    }

    try {
        const dog = await Dog.findById(req.params.id);
    
        updates.forEach(update => dog[update] = req.body[update]);

        await user.save();

        if(!dog) {
            return res.status(404).send();
        }

        res.status(204).send(dog);
    } catch(e) {
        res.status(400).send(e);
    }
});


router.delete('/dogs/:id', async (req, res) => {
    try {
        await Dog.findByIdAndDelete(req.params.id);
        res.status(200).send();
    } catch(e) {
        res.status(400).send(e);
    }
});


module.exports = router;