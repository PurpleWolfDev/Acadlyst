require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const otpGenerator = require('otp-generator')
const axios = require("axios");
const port = process.env.PORT || 80;
const fs = require("fs");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const jsonwebtoken = require('jsonwebtoken');
const mongoose = require("mongoose");
const {batchSchema, studentSchema, teacherSchema, recentActivities} = require("./schema.js");
const randomstring = require("randomstring");
let jwtKey = process.env.jwtKey;
// app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json({ limit: '10mb' }));

app.listen(port, () => {
    console.log("Server Is Started!");
});
app.use(cors({
    origin:'*'
}
));

mongoose.connect(process.env.mongoDB, {useNewUrlParser : true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, "error"));
db.once('open', ()=>{
    console.log("Connected!");
});

const Batch  = new mongoose.model("Batch", batchSchema);
const Student = new mongoose.model("studentSchemam", studentSchema);
const Activities = new mongoose.model("recentActivities", recentActivities);
const Teacher = new mongoose.model("teacherSchemam2", teacherSchema);

const validateParams = (...args) => {
    let flag = true;
    // console.log(args)
    args.map((e) => {
        if(e=="" || e==null) {
            console.log(e)
            flag = false; return flag;
        }
    });
    return flag;
};


const addActivity = async(title, bId, sId, activityId, headerName) => {
    let data = {
        title:title,
        timeOfCreation:new Date().getTime(),
        bId:bId,
        sId:sId,
        activityId:activityId,
        headerName:headerName
    };
    let result = await new Activities(data).save();
    console.log(result);
};


app.get("/verifyUser", async(req, res) => {
    try {
        let token = req.query.token;
        let result = jsonwebtoken.verify(token, jwtKey);
        // console.log(result)
        let flag = false;
        if(result.role=="student") {
            flag = (await Student.find({sId:result.sId})).length==1;
        }
        else if(result.role=="teacher") {
            flag = (await Teacher.find({sId:result.sId})).length==1;
            let a = await Teacher.find({sId:result.sId})
            // console.log(a);
        }
        // console.log(flag)
        if(flag)
        res.json({status:200});
        else {res.json({status:500})}
    } catch(err) {res.json({status:400})}
});


app.get("/createBatch", async(req, res) => {
    try {
        let name = req.query.name;
        let cls = Number(req.query.cls);
        let token = req.query.token;
        let subject = req.query.subject;
        let t = new Date().getTime();
        let bId = randomstring.generate(10) + (t%10000);
        let adminId = req.query.adminId;
        let adminName = req.query.adminName;
        let inviteLink = bId;
        let a = jsonwebtoken.verify(token, jwtKey);
        let obj = {
            name:name,
            timeOfCreation:t,
            bId:bId,
            liveStudents:[],
            adminId:adminId,
            adminName:adminName,
            cls:cls,
            subject:subject,
            assignments:[],
            tests:[],
            scheduledCls:[],
            notifs:[],
            polls:[],
            inviteLink:bId,
            allTimeStudents:[],
            inviteLink:inviteLink,
            activeStatus: true
        };
        let batchObj = await new Batch(obj).save();
        res.json({status:200});
    } catch(err) {
        console.log(err)
        res.json({status:500});
    }
});

app.get("/loadBatches", async(req, res) => {
    try {
        let token = req.query.token;
        let tId = req.query.adminId;
        let tVer = jsonwebtoken.verify(token, jwtKey);
        let data = await Batch.find({adminId:tId}).select("name bId liveStudents adminId cls subject activeStatus -_id");
        res.json({status:200, data:data});
    } catch(err) {
        console.log(err)
        res.json({status:500});
    }
});



app.get("/loadDashboardTeacher", async(req, res) => {
    try {
        let token = req.query.token;
        let adminId = req.query.sId;
        let students = await Batch.find({adminId:adminId}).select("liveStudents");
        let students2 = await Batch.find({adminId:adminId});
        let cls = students2[0].scheduledCls.length;
        console.log(students);
        let inviteLink = students2[0].inviteLink;
        const studentSet = new Set();
        let i = 0;
        students.map((e) => {
            e.liveStudents.map((a) => {
                studentSet.add(a.sId);
            });
        });
        let activeBatches = students.length;
        // logic for classes
        let clsNo = 12;
        res.json({
            status:200,
            inviteLink:inviteLink,
            data:[ { label: 'Total Students', value: studentSet.size, icon: 'Users', color: 'bg-blue-500' },
                   { label: 'Active Batches', value: activeBatches, icon: 'BookOpen', color: 'bg-green-500' },
                   { label: 'Classes This Week', value: cls, icon: 'Calendar', color: 'bg-orange-500' }]
        });
    } catch(err) {
        res.json({status:500});
    }
});

// const stats = [
//     { label: 'Total Students', value: '74', icon: Users, color: 'bg-blue-500' },
//     { label: 'Active Batches', value: '3', icon: BookOpen, color: 'bg-green-500' },
//     { label: 'Classes This Week', value: '12', icon: Calendar, color: 'bg-orange-500' }
//   ];

// name:'',
//     cls:'',
//     subject:'',
//     teacherName:'',

app.get("/getInviteInfo", async(req, res) => {
    try {
        let token = req.query.token;
        let inviteId = req.query.inviteId;
        let verT = jsonwebtoken.verify(token, jwtKey);
        let batchInfo = await Batch.findOne({inviteLink:inviteId}).select("name cls subject adminName liveStudents bId -_id");
        let data = {
            name:batchInfo.name,
            cls:batchInfo.cls,
            subject:batchInfo.subject,
            adminName:batchInfo.adminName,
            students:batchInfo.liveStudents.length,
            bId:batchInfo.bId
        };
        res.json({status:200, data:data});
    } catch(err) {
        res.json({status:500})
    }
});

app.get("/acceptBatchInvite", async(req, res) => {
    try {
        console.log("hey??")
        let token = req.query.token;
        let inviteId = req.query.inviteId;
        // let bId = req.query.bId;
        let phone = req.query.phone;
        let email = req.query.email;
        let bId = req.query.bId;
        let name = req.query.name;
        let sId = req.query.sId;
        let pfp = req.query.pfp;
        console.log(inviteId)
        let chatId = req.query.chatId;
        let verT = jsonwebtoken.verify(token, jwtKey);
        console.log(verT);
        let flagMain = await Batch.findOne({inviteLink:inviteId, "liveStudents.sId": sId});
        if((verT.name == name)&&(verT.email == email)&&(verT.role == 'student')&&(!flagMain)) {
            let obj = {
                name:name,
                sId:sId,
                phone:phone,
                pfp:pfp,
                enrollmentTime: new Date().getTime(),
                chatId:chatId,
                email:email,
            }
            let upd1 = await Batch.updateOne({inviteLink:inviteId}, {$push:{liveStudents:obj}});
            let upd2 = await Student.updateOne({sId:sId}, {$push:{batchesJoined:inviteId}});
            // let a = await Batch.find({inviteLink:inviteId});
            // console.log(a);
            console.log(upd2);
            console.log(upd1);
            let flag1 = (upd1.matchedCount==1)?true:false;
            let flag2 = (upd2.matchedCount==1)?true:false;
            if(flag1&&flag2) {res.json({status:200});
            // let batch = await Batch.find({inviteLink:inviteId})[0].bId;
            await addActivity(`Joined Batch`, bId, sId, randomstring.generate(10), name)}
            else res.json({status:500});

        } else {
            res.json({status:400});
        }

    } catch(err) {
        console.log(err)
        res.json({status:500})
    }
});


app.get("/getTeacherSettings", async(req, res) => {
    try {
        let token = req.query.token;
        let adminId = req.query.adminId;
        let verT = jsonwebtoken.verify(token, jwtKey);
        let data = await Teacher.findOne({sId:adminId}).select("name email pfp cls subjects -_id");
        res.json({status:200, data:data});
    } catch(err) {
        res.json({status:500})
    }
});

app.get("/updateTeacherSettings", async(req, res) => {
    try {
        let token = req.query.token;
        let adminId = req.query.adminId;
        let newData = JSON.parse(req.query.updates);
        let verT = jsonwebtoken.verify(token, jwtKey);
        let result = await Teacher.updateOne({sId:adminId}, {$set:{name:newData.name, pfp : newData.photo, subjects: newData.subjects, cls : newData.classes}});
        if(result.matchedCount==1) {
            res.json({status:200});
        }
        else {
            res.json({status:500});
        }
    } catch(err) {
        res.json({status:500});
    }
});


app.get("/loadStudentBatches", async(req, res) => {
    try {
        let token = req.query.token;
        let sId = req.query.sId;
        let verT = jsonwebtoken.verify(token, jwtKey);
        let batches = await Batch.find({"liveStudents.sId":sId}).select("name bId liveStudents adminId cls subject activeStatus -_id");
        res.json({status:200, data:batches});
    } catch(err) {
        res.json({status:500});
    }
});


app.get("/getStudentSettings", async(req, res) => {
    try {
        let token = req.query.token;
        let adminId = req.query.adminId;
        let verT = jsonwebtoken.verify(token, jwtKey);
        let data = await Student.findOne({sId:adminId}).select("name email pfp cls -_id");
        res.json({status:200, data:data});
    } catch(err) {
        res.json({status:500})
    }
});

app.get("/updateStudentSettings", async(req, res) => {
    try {
        let token = req.query.token;
        let adminId = req.query.adminId;
        let newData = JSON.parse(req.query.updates);
        let verT = jsonwebtoken.verify(token, jwtKey);
        let result = await Student.updateOne({sId:adminId}, {$set:{name:newData.name, pfp : newData.photo, cls : newData.cls}});
        if(result.matchedCount==1) {
            res.json({status:200});
        }
        else {
            res.json({status:500});
        }
    } catch(err) {
        res.json({status:500});
    }
});


app.get('/loadBatchNotices', async(req,res) => {
    try {
        let token = req.query.token;
        let bId = req.query.bId;
        let verT = jsonwebtoken.verify(token, jwtKey);
        let notices = await Batch.findOne({bId:bId}).select("notifs -_id");
        res.json({status:200, data:notices});
    } catch(err) {
        res.json({status:500});
    }
});

app.get("/validateTeacher", async(req, res) => {
    try {
        let validationId = req.query.id;
        let adminId = req.query.adminId;
        let bId = req.query.bId;
        let inviteLink = await Batch.findOne({bId:bId}).inviteLink;
        let result = await Teacher.find({token:validationId, sId:adminId}).select("sId name email phone ");
        if(result.length==1) {
            // res.
        }
    } catch(err) {

    }
});

function parseDate(ddmmyy) {
  const [day, month, year] = ddmmyy.split('/').map(Number);

  // Handle two-digit years (assuming 2000+)
  const fullYear = year < 100 ? 2000 + year : year;

  // Month is 0-based in JavaScript
  return new Date(fullYear, month - 1, day);
}
app.get("/loadTeacherBData", async(req, res) => {
    try {
        let bId = req.query.bId;
        let id = req.query.id;
        let session = req.query.session;
        console.log(session)
        let teacher = await Teacher.find({token:session}).select("name cls subject email chatId -_id isVerified sId chatId token");
        console.log(teacher)
        if((teacher.length==1)&&(teacher[0].isVerified)) {
            res.json({status:200, data:teacher});
        }
        else {
            res.json({status:400});
        }
    } catch(err) {
        res.json({status:500});
    }
});


app.get("/loadBatchHome", async(req, res) => {
    try {
        let bId = req.query.bId;
        let sId = req.query.sId;
        let data = {};
        let batch = await Batch.find({bId:bId});
        let inviteLink;
        if(batch.length==1) {
            batch = batch[0];
            inviteLink = batch.inviteLink;
        let d = parseDate(`${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()%100}`);

        let totalStd = batch.liveStudents.length;
        let activeAssign = 0;
        batch.assignments.map((e) => {
            activeAssign = e.status?activeAssign+1:activeAssign;
        });
        let pendingAssign = batch.assignments.length - activeAssign;
        let activities = await Activities.find({bId:bId}).sort({ timeOfCreation: -1 }).limit(4);
        let cls = [];
        batch.scheduledCls.map((e) => {
            if(e.timeOfCreation>d) {
                cls.push(e);
            }
        });
        data ={
            inviteLink:inviteLink,
            totalStd:totalStd,
            activeAssign:activeAssign,
            pendingAssign:pendingAssign,
            activities:activities,
            cls:cls,
            batchName:batch.name
        }
        res.json({status:200, data:data});
    }
    } catch(err) {
        console.log(err);
        res.json({status:500});
    }
});
// {
//       id: '1',
//       title: 'Calculus - Derivatives Introduction',
//       date: '2024-12-28',
//       time: '10:00',
//       duration: 90,
//       type: 'lecture',
//       meetingLink: 'https://meet.google.com/abc-defg-hij'
//     },
app.get("/getScheduledCls", async(req, res) => {
    try {
        let sId = req.query.sId;
        let batchId = req.query.batchId;
        if(sId==null || batchId == null) {
            res.json({status:400});
        }
        else {
            let batch = await Batch.find({bId:batchId, adminId:sId});
            if(batch.length==1) {
                batch = batch[0];
                let data = [];
                let d = new Date().getDate();
                let m = new Date().getMonth()+1;
                let y = 25;
                let date = parseDate(`${d}/${m}/${y}`);
                batch.scheduledCls.map((e) => {
                    if(e.timeOfCreation>date) {
                        data.push(e);
                    }
                });
                res.json({status:200, cls:data});
            }
            else res.json({status:400});
        }
    } catch(err) {
        console.log(err)
        res.json({status:500});
    }
});

app.get("/createClsSchedule", async(req, res) => {
    try {
        let mainBody = JSON.parse(req.query.mainBody);
        let batchId = req.query.batchId;
        let adminId = req.query.sId;
        let date = mainBody.date;
        let timeOfCreation = new Date().getTime();
        let meetingLink = mainBody.meetingLink;
        let time = mainBody.time;
        let duration = mainBody.duration;
        let clsId = req.query.clsId=="no"?null:req.query.clsId;
        console.log(mainBody)
        let title = mainBody.title;
        let type = mainBody.type;
        let purpose = Number(req.query.isUpdate);
        if(validateParams(batchId, adminId, date, timeOfCreation, time, duration, title, type)) {
            let data = {
                date:date,
                timeOfCreation:timeOfCreation,
                meetingLink:meetingLink,
                duration:duration,
                title:title,
                type:type,
                time:time,
                batchId:batchId,
                adminId:adminId,
                clsId:randomstring.generate(20)
            };
            let result = purpose==0?await Batch.updateOne({bId:batchId, adminId:adminId}, {$push:{scheduledCls:data}}):await Batch.updateOne({bId:batchId, adminId:adminId, 'scheduledCls.clsId':clsId}, {$set:{'scheduledCls.$':data}});
            if(purpose==0) {
                await addActivity(`scheduled on ${date} - ${time}`, batchId, adminId, randomstring.generate(10), `Class`);
            }

            console.log(purpose, result, clsId);
            if(result.matchedCount==1) {
                res.json({status:200});
            }
            else {res.json({status:500});console.log("this is error")}
        }
        else {
            res.json({status:400});
        }
    } catch(err) {
        console.log(err)
        res.json({status:500});
    }
});

app.get("/removeScheduleCls", async(req, res) => {
    try {
        let batchId = req.query.batchId;
        let adminId = req.query.adminId;
        let clsId = req.query.clsId;
        let a = await Batch.findOne({'scheduledCls.clsId': clsId, batchId: batchId, adminId: adminId });
        console.log(a);
        let result = await Batch.updateOne({bId:batchId, adminId:adminId, scheduledCls: { $elemMatch: { clsId: clsId} }}, {$pull:{scheduledCls:{clsId:clsId}}});
        console.log(batchId, adminId, clsId);
        console.log(result);
        if(result.matchedCount==1) {
            res.json({status:200});
        }
        else res.json({status:400});
    } catch(err) {
        res.json({status:500});
    }
});

app.get("/getBatchNotices", async(req, res) => {
    try {
        let batchId = req.query.batchId;
        let adminId = req.query.adminId;
        let batch = await Batch.find({bId:batchId, adminId:adminId});
        if(batch.length==1) {
            notices = batch[0].notifs;
            res.json({status:200, data:notices});
        }
        else res.json({status:400});
    } catch(err) {
        res.json({status:500});
    }
});

app.get("/addNotifs", async(req, res) => {
    try {
        let batchId = req.query.batchId;
        let adminId = req.query.adminId;
        let mainBody = JSON.parse(req.query.mainBody);
        
        let data = {
            title:mainBody.title,
            id: new Date().getTime(),
            desc : mainBody.description,
            priority:mainBody.priority,
            createdDate:mainBody.createdDate,
        }
        let result = await Batch.updateOne({bId:batchId, adminId:adminId}, {$push:{notifs:data}});
        if(result.matchedCount == 1) {
            res.json({status:200});
            addActivity(`posted`, batchId, adminId, randomstring.generate(10), `New Notice`);
        }
        else res.json({status:400})
    } catch(err) {
        console.log(err)
        res.json({status:500});
    }
});

app.get("/deleteNotif", async(req, res) => {
    try {
        let batchId = req.query.batchId;
        let adminId = req.query.adminId;
        let id = Number(req.query.id);
        if(validateParams(batchId, adminId, id)) {
            let result = await Batch.updateOne({bId:batchId, adminId:adminId, notifs: { $elemMatch: { id: id} }}, {$pull:{notifs:{id:id}}});
            if(result.matchedCount==1) res.json({status:200});
            else {console.log(result); }
        }
    } catch(err) {
        console.log(err)
        res.json({status:500});
    }
});

app.get("/loadBatchStudents", async(req, res) => {
    try {
        let adminId = req.query.adminId;
        let batchId = req.query.batchId;
        let result = await Batch.findOne({bId:batchId, adminId:adminId});
        console.log(result.liveStudents)
        res.json({status:200, data:result.liveStudents});
    } catch(err) {
        console.log(err);
        res.json({status:500})
    }
});
app.get("/removeStudent", async(req, res) => {
    try {
        let batchId = req.query.batchId;
        let adminId = req.query.adminId;
        let sId = req.query.sId;
        let name = req.query.name;
        let result = await Batch.updateOne({bId:batchId, adminId:adminId, liveStudents: { $elemMatch: { sId: sId} }}, {$pull:{liveStudents:{sId:sId}}});
        console.log(result)
        await addActivity(`was removed from batch`, batchId, adminId, randomstring.generate(10), name)
        res.json({status:200});
    } catch(err) {
        res.json({status:500});
    }
});


app.get('/loadBatchSettings', async(req, res) => {
    try {
        let batchId = req.query.batchId;
        let adminId = req.query.adminId;
        let batch = await Batch.find({bId:batchId, adminId:adminId}).select("name timeOfCreation cls liveStudents subject scheduledCls -_id");
        if(batch.length==1) {
            batch = batch[0];
            res.json({status:200, data:{
                name:batch.name,
                timeOfCreation:batch.timeOfCreation,
                studentNo: batch.liveStudents.length,
                cls:batch.cls,
                subject:batch.subject,
                scheduledCls:batch.scheduledCls.length
            }});
        }
    } catch(err) {
        res.json({status:500});
    }
});

app.get('/updateBatchSettings', async(req, res) => {
    try {
        let batchId = req.query.batchId;
        let adminId = req.query.adminId;
        let mainBody = JSON.parse(req.query.mainBody);
        let result = await Batch.updateOne({name:mainBody.name,cls:Number(mainBody.cls), subject:mainBody.subject});
        if(result.matchedCount==1) {
            res.json({status:200});
        }
    } catch(err) {
        res.json({status:500});
    }
});


app.get("/deleteBatch", async(req, res) => {
    try {
        let batchId = req.query.batchId;
        let adminId = req.query.adminId;
        let result = await Batch.deleteOne({bId:batchId, adminId:adminId});
        console.log(result);
        res.json({status:200});
    } catch(err) {
        res.json({status:500});
    }
});

app.get("/getAssignments", async(req, res) => {
    try {
        let batchId = req.query.batchId;
        let adminId = req.query.adminId;
        let result = await Batch.findOne({bId:batchId, adminId:adminId}).sort({timeOfCreation:-1});
        result.assignments.sort((a, b) => b.timeOfCreation - a.timeOfCreation);
        // console.log(result.assignments)
        res.json({status:200, data:result.assignments});
    } catch(err) {
        console.log(err);
        res.json({status:500});
    }
});


app.get("/createAssign", async(req, res) => {
    try {
        let adminId = req.query.adminId;
        let batchId = req.query.batchId;
        let update = Number(req.query.update);
        let mainBody = JSON.parse(req.query.mainBody);
        let result = update==0?await Batch.updateOne({adminId:adminId, bId:batchId}, {$push:{assignments:mainBody}}):await Batch.updateOne({bId:batchId, adminId:adminId, 'assignments.id':mainBody.id}, {$set:{'assignments.$':mainBody}});
        if(result.matchedCount==1) {
            res.json({status:200});
            update==0?await addActivity(`was posted`, batchId, adminId, randomstring.generate(10), "Assignment"):null;
        }
        else {
            res.json({status:400});
        }
    } catch(err) {
        console.log(err)
        res.json({status:500});
    }
});

app.get("/deleteAssign", async(req, res) => {
    try {
        let adminId = req.query.adminId;
        let batchId = req.query.batchId;
        let id = req.query.id;
        let result = await Batch.updateOne({bId:batchId, adminId:adminId, assignments: { $elemMatch: { id: id} }}, {$pull:{assignments:{id:id}}});
        if(result.matchedCount==1) {
            res.json({status:200});
            await addActivity(`was removed`, batchId, adminId, randomstring.generate(10), "Assignment");
        }
        else {
            res.json({status:400});
        }
    } catch(err) {
        res.json({status:500});
    }
});


app.get("/getStudentAssignment", async(req, res) => {
    try {
        let sId = req.query.sId;
        let token = req.query.token;
        let batchId = req.query.batchId;
        let verT = jsonwebtoken.verify(token, jwtKey);
        let result = await Batch.find({bId:batchId, 'liveStudents.sId':sId}).sort({timeOfCreation:-1});

        if(result.length==1) {
            result = result[0];
            result.assignments.sort((a, b) => b.timeOfCreation - a.timeOfCreation);
            // console.log(result.assignments.submissions);
            let result2 = result;
            result.assignments.map((e, i) => {
                let submissions = [];
                e.submissions.map((a) => {
                    if(a.sId==sId) submissions.push(a);
                });
                result2.assignments[i].submissions = submissions;

            });
            res.json({status:200, data:result2.assignments});
        }
        else res.json({status:400});
    } catch(err) {
        console.log(err)
        res.json({status:500});
    }
});

app.get("/submitAssignment", async(req, res) => {
    try {
        let userData = JSON.parse(req.query.userData);
        let bId = req.query.bId;
        let assignmentId = req.query.assignmentId;
        let url = req.query.fileUrl;
        let adminId = req.query.adminId;
        let t = new Date().getTime();
        let size = Number(req.query.size);
        let fileName = req.query.fileName;
        console.log(url, size, fileName);
        let data = {
            name : userData.name,
            sId: userData.sId,
            email:userData.email,
            phone:userData.phone,
            chatId:userData.chatId,
            pfp:userData.pfp,
            url:url,
            fileName:fileName,
            timeOfSubmission:t,
            fileSize:size,
            teacherRemarks: []
        };
        let result = await Batch.updateOne({bId:bId, 'assignments.id':assignmentId}, {$push:{'assignments.$.submissions':data}});
        if(result.matchedCount==1) {
            let result3 = await Batch.find({bId:bId, 'liveStudents.sId':userData.sId});

        if(result3.length==1) {
            result3 = result3[0];
            result3.assignments.sort((a, b) => b.timeOfCreation - a.timeOfCreation);
            // console.log(result.assignments.submissions);
            let result2 = result3;
            result3.assignments.map((e, i) => {
                let submissions = [];
                e.submissions.map((a) => {
                    if(a.sId==userData.sId) submissions.push(a);
                });
                result2.assignments[i].submissions = submissions;

            });
            res.json({status:200, data:result2.assignments});
        }
        else res.json({status:400});
            await addActivity(`has submitted assignment.`, bId, adminId, randomstring.generate(10), userData.name);
        }
        else {
            res.json({status:400});
        }
    } catch(err) {
        console.log(err)
        res.json({status:500});
    }
});


app.get("/submitRemarks", async(req, res) => {
    try {
        let adminId = req.query.adminId;
        let assignmentId = req.query.assignmentId;
        let sId = req.query.studentId;
        let batchId = req.query.batchId;
        let msg = req.query.msg;
        let result = await Batch.find({adminId:adminId, bId:batchId});
        let i=-1,j=-1;
        let userName = "";
        console.log(result.length, assignmentId, sId, msg)
        if(result.length==1) {
            result = result[0];
            let resultCopy = result;
            result.assignments.map((assignment) => {
                if((assignment.id==assignmentId)) {
                    i++;
                    assignment.submissions.map((e) => {
                        if(e.sId==sId) {
                            j++; 
                            userName = e.name;                           
                        }
                    })
                }
            });
            console.log(i,j);
            resultCopy.assignments[i].submissions[j].teacherRemarks = [{msg:msg, timeOfCreation: new Date().getTime()}];
        
        let resultFinal = await Batch.updateOne({adminId:adminId, bId:batchId}, {$set:{assignments:resultCopy.assignments}});
        if(resultFinal.matchedCount == 1) {
            res.json({status:200});
            await addActivity(`reviewed ${userName}'s assignment.`, batchId, adminId, randomstring.generate(10), 'You');
        }
        } else {res.json({status:400})}
    } catch(err) {
        console.log(err)
        res.json({status:500});
    }
});

app.get("/loadBatchSchedule", async(req, res) => {
    try {
        let sId = req.query.sId;
        let token = req.query.token;
        let bId = req.query.bId;
        let verT = jsonwebtoken.verify(token, jwtKey);
        let batch = await Batch.find({bId:bId, 'liveStudents.sId':sId});
            if(batch.length==1) {
                batch = batch[0];
                let data = [];
                let d = new Date().getDate();
                let m = new Date().getMonth()+1;
                let y = 25;
                let date = parseDate(`${d}/${m}/${y}`);
                batch.scheduledCls.map((e) => {
                    if(e.timeOfCreation>date) {
                        data.push(e);
                    }
                });
                res.json({status:200, data:data});
            }
            else res.json({status:400});
    } catch(err) {
        console.log(err);
        res.json({status:500});
    }
});
