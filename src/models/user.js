const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Task = require('../models/task')

const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true
        },
        age: {
            type: Number,
            validate(value) {
                if(value < 0) {
                    throw new Error('Age must be a positive number!')
                }
            }
        }, 
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Email is invalid!!');
                }
            }
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            validate(value) {
                if(value.toLowerCase().includes('password')) {
                    throw new Error('Password should not contain password')
                }
            }
        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }]
    }, {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
  });

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function() {
    let user = this
    let token = jwt.sign({_id: user._id.toString()}, 'Mynameisneha', {expiresIn: '1h'})

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.statics.findUserByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    
    if(!user) {
        throw new Error('Unable to login!');
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error('Unable to login!');
    }

    return user;
}

userSchema.pre('save', async function(next) {
    const user = this;

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next()

})

userSchema.pre('remove', async function() {
    const user = this
    await Task.deleteMany({'owner': user._id})

    next()
})

const User = mongoose.model('User', userSchema);

module.exports = User