const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

router.post('/users', async (req, res) => {
    
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        
        res.status(201).send({user, token})
    } catch(e) {
        res.status(500).send(e);
    }
    
});

router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findUserByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.send({user: user, token})
    } catch(e) {
        res.status(500).send({"error": e.message})
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()

        res.send({data: 'Logged out successfully!!'})
    } catch (e) {
        res.status(500).send({'error': e.message})
    }
})

router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send({data: 'All user logged out successfully!!'})
    } catch (e) {
        res.status(500).send({'error': e.message})
    }
})

router.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users);
    } catch(e) {
        res.status(500).send(e);
    }
});

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.get('/users/:id', async(req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findById(_id)
        if(!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch(e) {
        res.status(500).send(e)
    }
});

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid operation!'})
    }

    try {
        const user = req.user
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.send(user)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid operation!'})
    }

    try {
        const user = await User.findById(req.params.id)

        if(!user) {
            return res.status(404).send()
        }
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()

        res.send(user)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await User.remove({_id: req.user._id})
        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router;