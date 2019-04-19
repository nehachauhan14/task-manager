require('../src/db/mongoose');
const Task = require('../src/models/task');

Task.findByIdAndDelete('5cb385eb4ce8fb6f43c954b1').then((task) => {
    console.log(task);
    return Task.countDocuments({completed: false})
}).then((result) => {
    console.log(result)
}).catch((e) => {
    console.log('e is:', e);
});

const deleteTaskAndCount = async () => {
    const task = await Task.findByIdAndDelete('5cb5dc3b5a1a2e77b030997f')
    const count = await Task.countDocuments({ completed : false })
    
    return count
}

deleteTaskAndCount().then((count) => {
    console.log('Incomplete task: ', count);
}).catch((error) => {
    console.log('error is', error);
})