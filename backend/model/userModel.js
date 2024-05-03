import mongoose from "mongoose";
import validator from "validator";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        },
        unique: true
    },
    emailDomain:{
        type:String,
    },
    requests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    requested: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    connectedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    socketId:{
        type: String,
    },
    online:{
        type:Boolean,
        default:false
    },
    bio:{
        type: String,
    },
    branch:{
        type: String,
    },
    pass_out_year:{
        type:Number
    },
})

const User = mongoose.model("User",userSchema)
export default User