const express = require('express');
const router = new express.Router();
const Task = require('../models/task');

router.post('/task', async (req, res) => {
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

router.get('/tasks', async(req, res) => {
    try {
        const tasks = await Task.find({})
        res.status(200).send(tasks)
    } catch(e) {
        res.status(500).send(e)
    }
});

router.get('/tasks/:id', async(req, res) => {
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

router.patch('/task/:id', async (req, res) => {
    const updates = Object.keys(req.body),
        allowedUpdates = ['completed', 'description'],
        isValidOperation = updates.every((update) => allowedUpdates.includes(update))

        if(!isValidOperation) {
            return res.status(400).send({error: 'Invalid operation'})
        }
        
    try {
        const task = await Task.findById(req.params.id);

        if(!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        // new : will return the updated task not the one found to be updated!
        // runValidation : will run all the validations on updation too
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

        res.status(201).send(task)
    } catch(e) {
        res.status(500).send(e)
    }

})

router.delete('/task/:id', async(req, res) => {
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

module.exports = router