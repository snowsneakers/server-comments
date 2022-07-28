//import express package
const express = require('express')
//create variable for express
const app = express()
//connect to database
const MongoClient = require('mongodb').MongoClient
//making a port variable
const PORT = 2121
//makes us able to use .env file
require('dotenv').config()

//creating variable for mongo connection
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

 //connect to mongo db with .env string
 //returns promise, console.logs confirmation
 //sets dbname to db variable
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

//allows the use of views folder .ejs
app.set('view engine', 'ejs')
//allows any static file in public folder to be used
app.use(express.static('public'))
//URL encoding converts characters into a format that can be transmitted over the Internet. URLs can only be sent over the Internet using the ASCII character-set.
app.use(express.urlencoded({ extended: true }))
//allows the use of json
app.use(express.json())


app.get('/', async (request, response)=>{
    //finding all todos and putting them into array
    const todoItems = await db.collection('todos').find().toArray()
    //counts all documents with the key value pair of completed: false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //GET request to http://localhost:2121/ will return the index.ejs file 
    response.render('index.ejs', { items: todoItems, left: itemsLeft })

    //promise way to do the same thing above

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//create http://localhost:2121/addTodo
app.post('/addTodo', (request, response) => {
    //create an item with thing key and completed key
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        //console.log(todo added)
        console.log('Todo Added')
        //if it works it will redirect to home
        response.redirect('/')
    })
    //send an error if it does work
    .catch(error => console.error(error))
})

// update req to http://localhost:2121/markComplete
app.put('/markComplete', (request, response) => {
    //update document that has thing: of entered text
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //will set the completed key to true
        $set: {
            completed: true
          }
    },{
        //will sort documents from newest to oldest
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// update req to http://localhost:2121/markUnComplete
//will undo markcomplete
//sets completed key back to false
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))
})

// delete req to http://localhost:2121/deleteItem
app.delete('/deleteItem', (request, response) => {
    //look through documents for thing key to have value of the texted entered by user
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))
})

//app will use localhost:PORT
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})