const Todo = require('../models/Todo')
const User = require('../models/User')

module.exports = {
    getTodos: async (req, res) => {
        // console.log(req.user)
        try {
            // ***do we need to change userId to userId: req.user.id || matching req.user.id
            // ***and similarly for itemsLeft ???
            const todoItems = await Todo.find({
                userId: req.user.id
            })
            const sharedItems = await Todo.find({
                userId: req.user.id
            })

            const itemsLeft = await Todo.countDocuments({
                userId: req.user.id,
                completed: false
            })
            // const sharedItemsLeft = await Todo.countDocuments({
            //     sharedId: req.user.id,
            //     completed: false
            // })
            res.render('todos.ejs', {
                todos: todoItems,
                // sharedTodos: sharedItems,
                left: itemsLeft,
                // sharedLeft: sharedItemsLeft,
                user: req.user
            })
            // console.log(sharedItems)
        } catch (err) {
            console.log(err)
        }
    },
    shareTodo: async (req, res) => {
        // console.log(req.user)
        // console.log(req.user.userName)
        // try {
        //     const sharedItems = await Todo.find({
        //         userId: req.user.id
        //     })
        //     const shareCreator = req.user.userName
        //     const shareCreatorId = req.user._id // MongoDb User Id for creator of the share
        //     const shareRecipient = req.body.shareReceiver // userName used to search DB from form
        //     // const dbObjectId = this.parentNode.dataset.id // id from the DOM for a todo item
        //     // const dbObjectData = await User.findById(dbObjectId)
        //     // const recipientData = await User.findOne({
        //     //     userName: shareRecipient
        //     // })
        //     // const recipientId = recipientData._id
        //     // const dbObjectUserArray = dbObjectData.userId
        //     console.log(`${req.body.todoIdFromJSFile} !!!!!!!`)
        //     // console.log(JSON.stringify(this.parentNode))

        //     // console.log(`${dbObjectUserArray} ????????`)

        //     // function to search the DB and find a userName that matches input from form, responds with entire user object
        //     // *** just for now, we are searching by userId, but will later search by userName
        //     // creating a todo for the recipient of the todo
        //     // await Todo.create({
        //     //     todo: itemText, // this is a test todo item will change later
        //     //     completed: false,
        //     //     userId: recipientData._id, // Mongo DB Id for recipient
        //     //     sharedId: shareCreatorId // Added a share creator id for later use
        //     // })
        //     // await Todo.findOneAndUpdate(
        //     //     { _id: dbObjectId },
        //     //     { $push: { userId: { recipientId } } }
        //     // )
        //     // console.log(
        //     //     `${shareCreator} has shared ${todo} todo with ${shareRecipient}`
        //     // )
        //     res.redirect('/todos')
        const shareRecipient = req.body.shareReceiver // userName used to search DB from form
        const dbObjectId = req.body.todoIdFromJSFile // id from the DOM for a todo item
        // const dbObjectData = await User.findById(dbObjectId)
        const recipientData = await User.findOne({
            userName: shareRecipient
        })
        let recipientId = recipientData._id
        recipientId = String(recipientId)

        try {
            console.log(recipientData)
            console.log(recipientId)
            console.log(typeof recipientId)

            await Todo.findOneAndUpdate(
                { _id: req.body.todoIdFromJSFile }, // id of the todo
                { $push: { userId: { recipientId } } }
            )
            console.log('Task Shared')
            res.json('Task Shared')
        } catch (err) {
            console.log(err)
        }
    },
    createTodo: async (req, res) => {
        try {
            await Todo.create({
                todo: req.body.todoItem,
                completed: false,
                userId: req.user.id
            })
            console.log('Todo has been added!')
            res.redirect('/todos')
        } catch (err) {
            console.log(err)
        }
    },
    markComplete: async (req, res) => {
        try {
            await Todo.findOneAndUpdate(
                { _id: req.body.todoIdFromJSFile },
                {
                    completed: true
                }
            )
            console.log('Marked Complete')
            res.json('Marked Complete')
        } catch (err) {
            console.log(err)
        }
    },
    markIncomplete: async (req, res) => {
        try {
            await Todo.findOneAndUpdate(
                { _id: req.body.todoIdFromJSFile },
                {
                    completed: false
                }
            )
            console.log('Marked Incomplete')
            res.json('Marked Incomplete')
        } catch (err) {
            console.log(err)
        }
    },
    deleteTodo: async (req, res) => {
        console.log(req.body.todoIdFromJSFile)
        try {
            await Todo.findOneAndDelete({ _id: req.body.todoIdFromJSFile })
            console.log('Deleted Todo')
            res.json('Deleted It')
        } catch (err) {
            console.log(err)
        }
    }
}
