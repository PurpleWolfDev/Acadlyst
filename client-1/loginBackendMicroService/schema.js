const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
    name:String,
    phone:Number,
    cls:Number,
    pfp:String,
    pass:String,
    email:String,
    timeOfCreation:Number,
    sId:String,
    isVerified:{
        type:Boolean,
        default:false
    },
    batchesJoined:{
        type:Array,
        default:[] //contains inviteId
    },
    chatId:String,
    token:String,
    otp:Number

});

const teacherSchema = mongoose.Schema({
    name:String,
    phone:Number,
    cls:{
        type:Array,
        default:[]
    },
    pfp:String,
    pass:String,
    subjects:{
        type:Array,
        default:[]
    },
    email:String,
    timeOfCreation:Number,
    sId:String,
    isVerified:{
        type:Boolean,
        default:false
    },
    batches:{
        type:Array,
        default:[]
    },
    chatId:String,
    token:String,
    otp:Number
});



module.exports = {studentSchema, teacherSchema};