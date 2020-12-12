const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Genders = Object.freeze({
    Male: 'male',
    Female: 'female',
});

const dogSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 1
    },
    email: {
        type: String, 
        required: true,
        trim: true, 
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        rim: true,
        minlength: 7,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('Password must be at least 6 characters long')
            }
        }
    },
    description: {
        type: String
    },
    gender: {
        type: String,
        enum: Object.values(Genders)
    },
    age: {
        type: Number
    },
    spade: {
        type: Boolean
    },
    likes: {

    },
    liked: {

    },
    dislikes: {

    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

dogSchema.statics.findByCredentials = async (email, password) => {
    const dog = await Dog.findOne({ email });
    
    if (!dog) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, dog.password);

    if(!isMatch) {
        throw new Error('Unable to login');
    }

    return dog;
};

dogSchema.methods.generateAuthToken = async function() {
    const dog = this;
    const token = jwt.sign({ _id: dog._id.toString() }, 'mytempsecret');

    // const data = jwt.verify(token, 'mytempsecret')
    dog.tokens = dog.tokens.concat({ token });
    await dog.save();
    return token;
};

dogSchema.methods.toJSON = function() {
    const dog = this;
    const dogObject = dog.toObject();

    delete dogObject.password;
    delete dogObject.tokens;

    return dogObject;
};

Object.assign(dogSchema.statics, {
    Genders,
});
  

dogSchema.pre('save', async function(next) {
    const dog = this;

    if (dog.isModified('password')) {
        dog.password = await bcrypt.hash(dog.password, 8)
    }

    next();
});

const Dog = mongoose.model('Dog', dogSchema);

module.exports = Dog;