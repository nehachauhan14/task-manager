const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express(),
    port = process.env.PORT || 1800;

app.use(express.json());

app.post('/users', (req, res) => {
    const user = new User(req.body);

    user.save().then((result) => {
        res.send(result);
    }).catch((error) => {
        res.send(error)
    })
});

app.post('/task', (req, res) => {
    const task = new Task(req.body);
    
    task.save().then((result) => {
        res.send(result)
    }).catch((error) => {
        res.status(400).send(error)
    })
})

app.listen(port, () => {
    console.log(`Server is up and running at ${port}`);
})