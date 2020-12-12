const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const Genders = Object.freeze({
    Male: 'male',
    Female: 'female',
});

const dogSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
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
    gender: {
        type: String,
        required: true,
        enum: Object.values(Genders)
    },
    age: {
        type: Number, 
        required: true
    },
    spade: {
        type: Boolean,
        required: true, 
    },
    likes: {
        type: Number
    },
    liked: {

    },
    dislikes: {

    }
});

dogSchema.statics.findByCredentials = async (email, password) => {
    const dog = await dog.findOne({ email })

    if (!dog) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, dog.password)

    if(!isMatch) {
        throw new Error('Unable to login')
    }

    return dog
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

const dog = mongoose.model('dog', dogSchema);

module.exports = dog;