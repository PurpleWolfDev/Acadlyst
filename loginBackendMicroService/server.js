require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const otpGenerator = require('otp-generator')
const axios = require("axios");
const port = process.env.PORT || 8080;
const fs = require("fs");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const jsonwebtoken = require('jsonwebtoken');
const mongoose = require("mongoose");
const {studentSchema, teacherSchema} = require("./schema.js");
const randomstring = require("randomstring");
let jwtKey = process.env.jwtKey;
// app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cors({
    origin:'*'
}
));

app.listen(port, () => {
    console.log("Server Is Started!");
});


const sendEmail = async(email, link) => {
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'purplefoxdevs@gmail.com',
            pass:process.env.passKey
        }
    });
    const mailOpt = {
        from : 'Your Email...',
        to: email,
        subject: "Kindly Verify Your Account",
        html:`<p>Hello,</p>
                <p>Please click the link below to verify your email:</p>
                <a href="${link}" target="_blank">
                ${link}
                </a>`
    }
    try {
        const info = await transporter.sendMail(mailOpt);
        console.log(info);
        return true;
    } catch(err) {
        return false;
    }
};

const sendSms = async(phone, link) => {
    return true;
}

mongoose.connect(process.env.mongoDB, {useNewUrlParser : true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, "error"));
db.once('open', ()=>{
    console.log("Connected!");
});

const Student = new mongoose.model("studentSchemam", studentSchema);
const Teacher = new mongoose.model("teacherSchemam2", teacherSchema);

const validateParams = (...args) => {
    let flag = true;
    console.log(args)
    args.map((e) => {
        if(e=="" || e==null) {
            console.log(e)
            flag = false; return flag;
        }
    });
    return flag;
};
// console.log(randomstring.generate(10))
// let a = async() => {
//    let b = await Teacher.findOne({phone:});
//    console.log(b);
// //    b.map(async(e) => {
//     let re = await Teacher.deleteOne({phone: e.phone});
//     console.log(re)
//    })
// }
// a();
app.post("/registerStudent", async(req, res) => {
    try {

        // console.log(req.body)
        let name = req.body.name;
        let email = req.body.email;
        let pfp = 'sample';
        let phone = req.body.phone;
        let cls = req.body.cls;
        let pass = req.body.pass;
        if(validateParams(name, email, phone, cls, pass)) {
            let user1 = await Student.find({phone:phone});
            let user2 = await Teacher.find({phone:phone});
            if(!(user1.length==0)) {
                res.json({
                    status:101
                });
            }
            else if(!(user2.length==0)) {
                res.json({
                    status:101
                });
            }
            else {
                let t = new Date().getTime();
                let sId = randomstring.generate(10) + (t%10000);
                let chatId = randomstring.generate(10) + (t%10000);
                let token = jsonwebtoken.sign({sId: sId}, jwtKey);
                let studentObj = {
                    name:name,
                    email:email,
                    phone:phone,
                    cls:cls,
                    otp:null,
                    pass:pass,
                    timeOfCreation:t,
                    sId:sId,
                    pfp : pfp,
                    chatId:chatId,
                    token:token,
                    batchesJoined:[],
                    isVerified:false,
                };
                const resp = await new Student(studentObj).save();
                let validateUrl = `${process.env.coreURL}/verifyEmail?id=${t}&tab=student`;
                let f1 = await sendEmail(email, validateUrl);
                let f2 = await sendSms(phone, validateUrl);
                if(f1&&f2) {
                    res.json({
                        status:200
                    });
                }
                else {res.json({status:500});}
            }
        }
        else {
            res.json({
                status:400
            });
        }
    } catch(err) {
        console.log("final")
        console.log(err)
        res.json({
            status:500
        })
    }
});


app.post("/registerTeacher", async(req, res) => {
    try {

        // console.log(req.body)
        let name = req.body.name;
        let email = req.body.email;
        let pfp = 'sample';
        let phone = req.body.phone;
        let cls = req.body.cls;
        let pass = req.body.pass;
        let subjects = req.body.subjects;
        let teacherToken = randomstring.generate(200);
        if(validateParams(name, email, phone, cls, pass)) {
            let user1 = await Student.find({phone:phone});
            let user2 = await Teacher.find({phone:phone});
            if(!(user1.length==0)) {
                res.json({
                    status:101
                });
            }
            else if(!(user2.length==0)) {
                res.json({
                    status:101
                });
            }
            else {
                let t = new Date().getTime();
                let sId = randomstring.generate(10) + (t%10000);
                let chatId = randomstring.generate(10) + (t%10000);
                let token = jsonwebtoken.sign({sId: sId}, jwtKey);
                let teacherObj = {
                    name:name,
                    email:email,
                    phone:phone,
                    otp:null,
                    cls:cls,
                    pass:pass,
                    timeOfCreation:t,
                    sId:sId,
                    subjects:subjects,
                    pfp : pfp,
                    chatId:chatId,
                    token:teacherToken,
                    batches:[],
                    isVerified:false,
                };
                const resp = await new Teacher(teacherObj).save();
                let validateUrl = `${process.env.coreURL}/verifyEmail?id=${t}&tab=teacher`;
                let f1 = await sendEmail(email, validateUrl);
                let f2 = await sendSms(phone, validateUrl);
                if(f1&&f2) {
                    res.json({
                        status:200
                    });
                }
                else res.json({status:500});
            }
        }
        else {
            res.json({
                status:400
            });
        }
    } catch(err) {
        console.log(err)
        res.json({
            status:500
        })
    }
});


app.get("/verifyEmail", async(req, res) => {
    try {
        let toc = Number(req.query.id);
        let id = req.query.tab;
        console.log(toc);
        console.log(id);
        if(id=="student") {
            let user = await Student.find({timeOfCreation:toc});
            if(user.length!=0) {
                let result = await Student.updateOne({timeOfCreation:toc}, {$set:{isVerified:true}});
                console.log(result)
                res.send("Account is verified ✔");
            }
            else {
                res.json({status: 400});
            }
        }
        else if(id=="teacher") {
            // console.log("teachr")
            let user = await Teacher.find({timeOfCreation:toc});
            if(user.length!=0) {
                let result = await Teacher.updateOne({timeOfCreation:toc}, {$set:{isVerified:true}});
                console.log(result)
                res.send("Account is verified ✔");
            }
            else {
                res.json({status: 400});
            }
        }
        else {
            res.json({status:400});
        }

    } catch(err) {
        res.json({
            status:500
        });
    }
});
                
// console.log(randomstring.generate(200))

app.post('/loginStudent', async(req, res) => {
    try {
        let phone = Number(req.body.phone);
        let pass = req.body.pass;
        console.log(phone, pass)
        let user = await Student.find({phone:phone, pass:pass});
        console.log(user)
        if((user.length==1)&&user[0]['isVerified']) {
            let parsedData = {
                name:user[0]['name'],
                email:user[0]['email'],
                role:'student',
                sId : user[0].sId
            }
            let token = jsonwebtoken.sign(parsedData, jwtKey);
            let data = {
                token:token,
                name:user[0].name,
                phone:user[0].phone,
                cls:user[0].cls,
                email:user[0].email,
                sId:user[0].sId,
                pfp:user[0].pfp,
                batchesJoined:user[0].batchesJoined,
                chatId:user[0].chatId,
                role:"student"
            }
            res.json({data:data, status:200});
        }
        else if(!(user[0]['isVerified'])) {

            let f1 = await sendEmail(user[0].email, `${process.env.coreURL}/verifyEmail?tab=student&id=${user[0].timeOfCreation}`);
            let f2 = await sendSms(user[0].phone, `${process.env.coreURL}/verifyEmail?tab=student&id=${user[0].timeOfCreation}`);
            if(f1&&f2) {
                res.json({status:101});
            }
            else res.json({status:500})
        }
        else {
            res.json({status:400});
        }
    } catch(err) {
        console.log(err);
        console.log('this wa')
        res.json({status:500})
    }
});

app.post('/loginTeacher', async(req, res) => {
    try {
        let phone = Number(req.body.phone);
        let pass = req.body.pass;
        let user = await Teacher.find({phone:phone, pass:pass});
        console.log(user)
        if((user.length==1)&&user[0]['isVerified']) {
            console.log("heheh")
            let parsedData = {
                name:user[0]['name'],
                email:user[0]['email'],
                role:'teacher',
                sId : user[0].sId,
            }
            let token = jsonwebtoken.sign(parsedData, jwtKey);
            let data = {
                teacherToken:user[0].token,
                sId:user[0].sId,
                role:"teacher",
                name:user[0].name,
                token:token
            }
            res.json({data:data, status:200});
        }
        else if(!(user[0]['isVerified'])) {
            res.json({status:101});
        }
        else {
            res.json({status:400});
        }
    } catch(err) {
        res.json({status:500})
    }
});

app.get("/forgotPassOtp", async(req, res) => {
    try {
        let phone = Number(req.query.phone);
        let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets:false, specialChars: false });
        let std = await Student.updateOne({phone:phone}, {$set:{otp:otp}});
        let tea = await Teacher.updateOne({phone:phone}, {$set:{otp:otp}});
        console.log(std.matchedCount == 1);
        console.log(tea.matchedCount == 1)
            if(std.matchedCount==1) {
                let aa = await Student.find({phone:phone});
                let f1 = await sendEmail(aa[0].email, otp);
                let f2 = await sendSms(phone, otp);
                if(f1 && f2) {
                    res.json({status:200});
                }
                else {
                    console.log("err")
                    res.json({status:500});
                }
            }
            else if(tea.matchedCount==1) {

                let aa = await Teacher.find({phone:phone});
                let f1 = await sendEmail(aa[0].email, otp);
                let f2 = await sendSms(phone, otp);
                // console.log(aa[0].email);
                if(f1 && f2) {
                    res.json({status:200});
                }
                else {
                    res.json({status:500});
                }
            }
    } catch(err) {
        console.log(err)
        res.json({status:500})
    }
});



app.get("/verifyOtp", async(req, res) => {
    try {
        let phone = Number(req.query.phone);
        let otp = String(req.query.otp);
        let user1 = await Student.find({phone:phone, otp:otp});
        let user2 = await Teacher.find({phone:phone, otp:otp});
        console.log(user1, user2)
        if(user1.length==1 || user2.length == 1) {
            let temp = otpGenerator.generate(10, { upperCaseAlphabets: true, lowerCaseAlphabets:true, specialChars: true });
            let rest1 = await Student.updateOne({phone:phone}, {$set:{token:temp}});
            let rest2 = await Teacher.updateOne({phone:phone}, {$set:{token:temp}});
            if((rest1.matchedCount == 1) || (rest2.matchedCount == 1)) {
                res.json({status:200, token:temp});
            }
            else {
                res.json({status:400});
            }
        }
        else {
            res.json({
                status:400
            });
        }
    } catch(err) {
        res.json({status:500})
    }
});

app.get("/resetPass", async(req, res) => {
    try {
        let pass = req.query.pass;
        let token = req.query.token;
        let phone = req.query.phone;
        let result1 = await Student.updateOne({token : token, phone :phone}, {$set:{pass:pass}});
        let result2 = await Teacher.updateOne({token : token, phone :phone}, {$set:{pass:pass}});
        if(result1.matchedCount == 1 || result2.matchedCount == 1) {
            res.json({status:200});
        } 
        else {
            res.json({status:400});
        }
    } catch(err) {
        res.json({status:500});
    }
});

app.listen(port, () => {console.log("Server Started");})

