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
        try {
            // find the User in db to share task with
            const shareRecipient = await User.findOne({
                userName: req.body.shareReceiver // userName that is sent with the form
            })
            const dbObjectId = req.body.todoId // todo (task) item ID that is sent with the form
            let todo = await Todo.findById(dbObjectId)
            // if user id already in the userId array do not add userId to array
            if (todo.userId.includes(shareRecipient._id)) {
                console.log('Task already shared')
            } else {
                await Todo.findOneAndUpdate(
                    { _id: dbObjectId },
                    {
                        // push the user's ID that you want to share with to the userId array
                        $push: {
                            userId: shareRecipient._id // UserId of the share recipient
                        }
                    }
                )
                console.log('Task Shared')
            }
            res.redirect('/todos')
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
