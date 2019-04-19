const express = require('express')
require('./db/mongoose')

// Router
const taskRouter = require('./routers/task')
const userRouter = require('./routers/user')

// Initialise app
const app = express()
const port = process.env.PORT || 1800

// provide resources
app.use(express.json())
app.use(taskRouter)
app.use(userRouter)

// start app
app.listen(port, () => {
    console.log(`Server is up and running at ${port}`)
})
