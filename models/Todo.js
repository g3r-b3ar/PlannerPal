const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({
    todo: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        required: true
    },
    // userId: {
    //     type: String,
    //     required: true
    // },
    // added a sharedId to record who shared the todo
    userId: {
        type: "array",
        required: true
    }
})

module.exports = mongoose.model('Todo', TodoSchema)
