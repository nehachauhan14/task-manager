const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express(),
    port = process.env.PORT || 1800;

app.use(express.json());

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

// Create Task
app.post('/task', async (req, res) => {
    const task = new Task(req.body);
    
    // using async await
    try {
        const result = await task.save()
        res.status(201).send(result)
    } catch(e) {
        res.status(400).send(error)
    } 

    // Using promise chaining

    // task.save().then((result) => {
    //     res.send(result)
    // }).catch((error) => {
    //     res.status(400).send(error)
    // })
})

// Get Task list
app.get('/tasks', async(req, res) => {
    try {
        const tasks = await Task.find({})
        res.status(200).send(tasks)
    } catch(e) {
        res.status(500).send(e)
    }
});

// Get Task by id
app.get('/tasks/:id', async(req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findById(_id)
        if(!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)
    } catch(e) {
        res.status(500).send(e)
    }
});

// Update task
app.patch('/task/:id', async (req, res) => {
    const updates = Object.keys(req.body),
        allowedUpdates = ['completed', 'description'],
        isValidOperation = updates.every((update) => allowedUpdates.includes(update))

        if(!isValidOperation) {
            return res.status(400).send({error: 'Invalid operation'})
        }
        
    try {

        // new : will return the updated task not the one found to be updated!
        // runValidation : will run all the validations on updation too
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

        if(!task) {
            return res.status(404).send()
        }

        res.status(201).send(task)
    } catch(e) {
        console.log('error', e);
        res.status(500).send(e)
    }

})


// Delete task
app.delete('/task/:id', async(req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)
    } catch(e) {
        res.status(500).send(e)
    }
})

app.listen(port, () => {
    console.log(`Server is up and running at ${port}`)
})