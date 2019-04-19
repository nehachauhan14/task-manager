const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');
const taskRouter = require('./routers/task');

const app = express(),
    port = process.env.PORT || 1800;

app.use(express.json())
app.use(taskRouter)

// User model APIs
// Create Request
app.post('/users', async (req, res) => {
    
    const user = new User(req.body)
    try {
        const result = await user.save()
        res.status(201).send(result)
    } catch(e) {
        res.status(500).send(e);
    }
    
});

// Read Request 

app.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users);
    } catch(e) {
        res.status(500).send(e);
    }
});

app.get('/users/:id', async(req, res) => {
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

// Task model APIs 



app.listen(port, () => {
    console.log(`Server is up and running at ${port}`)
})
