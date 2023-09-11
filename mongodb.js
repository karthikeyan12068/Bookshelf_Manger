const { MongoClient } = require('mongodb')

// Create Instance of MongoClient for mongodb
const client = new MongoClient('mongodb://0.0.0.0:27017')
const database='task-manager'
// Connect to database
client.connect().then((client1) => {
    console.log('Connected Successfully')
    /*const db=client1.db(database)
    db.collection('users').insertOne({
        name:'Andrew',
        age:27
    })*/
})
.catch(error => console.log('Failed to connect', error))