const mongoose = require("mongoose");

const batchSchema = mongoose.Schema({
    name:String,
    timeOfCreation:Number,
    bId:String,
    liveStudents:Array,
    adminId:String,
    adminName:String,
    cls:Number,
    subject:String,
    assignments:Array,
// [
//     {
//       id: '1',
//       title: 'Calculus Assignment - Derivatives',
//       description: 'Solve the problems related to derivatives and limits. Show all working steps.',
//       dueDate: 2543453,
//       timeOfCreation: 235345345,
//       totalMarks: 100,
//       attachments: [
//         {
//           id: 'f1',
//           name: 'calculus_problems.pdf',
//           size: 245760,
//           type: 'application/pdf',
//           url: '#'
//         }
//       ],
//       submissions: [
//         {
//           id: 's1',
//           sId: '1',
//           name: 'Alice Johnson',
//           pfp: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
//           dateOfSubmission: '2024-12-28',
//           marks: 85,
//           feedback: 'Good work! Minor calculation errors in question 3.',
//           attachments: [
//             {
//               id: 'sf1',
//               name: 'alice_solution.pdf',
//               size: 189440,
//               type: 'application/pdf',
//               url: '#'
//             }
//           ]
//         }
//       ]
//     }
//   ]



    tests:Array,
    scheduledCls:Array,
// {
//       id: '1',
//       title: 'Calculus - Derivatives Introduction',
//       date: '2024-12-28',
//       time: '10:00',
//       duration: 90,
//       type: 'lecture',
//       meetingLink: 'https://meet.google.com/abc-defg-hij'
//     },


    notifs:Array,
//       id: '3',
//       title: 'New Study Material Available',
//       description: 'I\'ve uploaded additional practice problems for the upcoming exam. Check the resources section.',
//       priority: 'low',
//       createdDate: '2024-12-24',


    polls:Array,
    inviteLink:String,
    allTimeStudents:Array,
    activeStatus:Boolean,
});

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

const recentActivities = mongoose.Schema({
    title:String,
    timeOfCreation:Number,
    bId:String,
    sId:String,
    activityId:String,
    headerName:String
});

module.exports = {batchSchema, studentSchema, teacherSchema, recentActivities};