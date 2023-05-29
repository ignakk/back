import mongoose from "mongoose"
const { Schema } = mongoose;

const blogSchem = new Schema({
    name: {type: String, required: true},
    title: {type: String, required: true},
    text: {type: String, required: true},
    isVisible: {type: Boolean, required: true},
    avatar: {type: String},
    viewsCount : {type: Number, default: 0},
},  
    { timestamps: true }
);

const blogModel = mongoose.model("blogs", blogSchem);

export default blogModel;