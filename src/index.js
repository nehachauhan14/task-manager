require('./db/mongoose')
const express = require('express')


const User = require('./models/user')
const Task = require('./models/task')

// Router
const taskRouter = require('./routers/task')
const userRouter = require('./routers/user')

// Initialise app
const app = express()
const port = process.env.PORT || 1800
app.use(express.json())
app.use(taskRouter)
app.use(userRouter)

// start app
app.listen(port, () => {
    console.log(`Server is up and running at ${port}`)
})

// Example for ref
const main = async () => {
    const task = await Task.findById('5ccd9c5341d7392893580fce')
    await task.populate('owner').execPopulate()
    console.log(task.owner)

    const user = await User.findById('5ccd8c8941d7392893580fcb')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}


main()