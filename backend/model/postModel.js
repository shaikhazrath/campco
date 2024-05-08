import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      post:{
        type:String,
        required:true
      },
      DateAndTime: {
        type: Date,
        default: Date.now
      }
})

const Posts = mongoose.model("Posts",postSchema)
export default Posts