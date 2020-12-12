const jwt = require('jsonwebtoken');
const Dog = require('../models/dog');

const auth = async (req, res, next) => {

    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded =  jwt.verify(token, 'mytempsecret');
        const dog = await Dog.findOne({ _id: decoded._id, 'tokens.token': token });
        if(!dog) {
            throw new Error()
        }

        req.token = token;
        req.dog = dog;
        next();
    } catch(e) {
        res.status(401).send({Error: 'Please authenticate.'})
    }
};

module.exports = auth;