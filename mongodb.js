// CRUD create read update and delete

// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID;

const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
    if(error) {
        return console.log('Unable to connect to database');
    }

    console.log('connected correctly!!!');

    const db = client.db(databaseName);

    // Create Data:-
    // db.collection('users').insertOne({
    //     name: 'Neha',
    //     Age: 27
    // }, (error, result) => {
    //     if(error) {
    //         return console.log('Unable to add document!');
    //     }
    //     console.log(result.ops);
    // });

    // db.collection('users').insertMany([{
    //     name: 'Vishal',
    //     Age: 26
    // }, {
    //     name: 'Bhavna',
    //     Age: 26
    // }], (error, result) => {
    //     if(error) {
    //         return console.log('Unable to add documents!!!');
    //     }

    //     console.log(result.ops);
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description: 'Clean the house',
    //         completed: true
    //     }, {
    //         description: 'Feed dogs',
    //         completed: true
    //     }, {
    //         description: 'complete mongodb',
    //         completed: false
    //     }], (error, result) => {
    //         if(error) {
    //             return console.log('Unable to create tasks!!!')
    //         }

    //         console.log(result.ops);
    // })

    // retrieve Data:

    // db.collection('tasks').findOne({_id: new ObjectID("5cb069347d215221d5ec9a84")}, (error, task) =>{
    //     if(error) {
    //         return console.log('Unable to retrive Task!');
    //     }

    //     console.log(task);
    // });


    // Update Data using updateOne

    // db.collection('users').updateOne({
    //     _id: new ObjectID("5cb2196eed5096150e62ceec")
    // }, {
    //         $set: {
    //         name: 'Neha Chauhan'
    //         }
    // }).then((result) => {
    //     console.log('record post update: ' + result);
    // }).catch((error) => {
    //     console.log(error);
    // })
    // db.collection('tasks').find({completed: true}).toArray((error, tasks) => {
    //     console.log(tasks);
    // })

    db.collection('users').updateMany(
        { age: {$gt: 25}, name: "Vishal" }, 
        { $set: { Age: 29 } },
        // { upsert: true }
    ).then((result) => {
        console.log('result is' + result);
    }).catch((error) => {
        console.log('error', error);
    })
})