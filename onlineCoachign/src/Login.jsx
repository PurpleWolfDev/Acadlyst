import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Loader from './Loader.jsx';
import axios from 'axios';
export function Login() {
  const [currentPage, setCurrentPage] = useState('login'); // 'login' or 'register'
  const [activeTab, setActiveTab] = useState('student');
  const [nav, updateNav] = useState(false);
  const [isLoad, updateLoad] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
    const [navStudent, updateNavStudent] = useState(false);
    const [navTeacher, updateNavTeacher] = useState(false);
  
  // Login form data
  const [loginData, setLoginData] = useState({
    mobile: '',
    password: ''
  });

  // Registration form data
  const [registerData, setRegisterData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    image: null,
    classes: [],
    subjects: []
  });
// console.log(nav);
  useEffect(() => {
    try {
      let a = localStorage.getItem("userData");
      if(a.length>5) {
        if(localStorage.getItem("role") == "student") updateNavStudent(true);
        if(localStorage.getItem("role") == "teacher") updateNavTeacher(true);
      }
    } catch(err) {
      console.log(err)
      // alert("Some Error Occured")
    }
  }, []);
  const availableClasses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const availableSubjects = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Computer Science', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography'];

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const convertToFiles = (e) => {
    console.log(e[0])
        updateLoad(true);
        try {
            const fi = e[0];
            var f = new FileReader();
            f.readAsDataURL(fi);
            f.onload = (r) => {
              updateLoad(false)
              console.log(r.target.result)
                setRegisterData({
        ...registerData,
        image: r.target.result
      });
            }
    } catch(err) {
        alert("PLease re-upload the image!");
              updateLoad(false)
        // convertToFiles(e);
        console.log(err)
    }
    }

  const handleRegisterChange = (e) => {
    if (e.target.type === 'file') {
      console.log(e)
      setTimeout(() => {convertToFiles(e.target.files)}, 100)
      
      
    } else {
      setRegisterData({
        ...registerData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleMultiSelect = (field, value) => {
    const currentValues = registerData[field];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(item => item !== value)
      : [...currentValues, value];
    
    setRegisterData({
      ...registerData,
      [field]: newValues
    });
  };

  const handleLoginSubmit = () => {
    if(activeTab=='student') {
      updateLoad(true);
      let url = `https://onlinecoachinglogin.onrender.com/loginStudent`;
      let data = {
        phone: Number(loginData.mobile),
        pass: loginData.password,
      };
      axios.post(url, data)
      .then((d) => {
        updateLoad(false);
        console.log(d.data)
        if(d.data.status==200) {
          localStorage.setItem("role", "student");

          let dat = d.data.data;
          console.log(d.data.data);
          localStorage.setItem('userData', JSON.stringify(dat));
          updateNavStudent(true);

          alert("Login was successfull... redirecting you to dashboard");
        }
        else if(d.data.status==500) {
          alert("Some Internal Error Occcured!");
        }
        else if(d.data.status==101) {
          alert("We had send you verifiation link through email and sms, kindly verify you account first!");
        }
        else {
          alert("Invalid Credentials");
        }
      })
    }


    else {
      let url = `https://onlinecoachinglogin.onrender.com/loginTeacher`;
      let data = {
        phone: Number(loginData.mobile),
        pass: loginData.password,
      };
      updateLoad(true);
      axios.post(url, data)
      .then((d) => {
        updateLoad(false);
        console.log(d.data)
        if(d.data.status==200) {
          // let dat = d.data.data;
          console.log(d.data.data);
          alert("Login was successfull... redirecting you to dashboard");
          localStorage.setItem("userData", JSON.stringify(d.data.data));
          localStorage.setItem("role", "teacher");
          updateNavTeacher(true);
          // window.location.href = 'http://localhost:5174/validate?valid='+d.data.data.teacherToken+'&session='+d.data.data.sId;

        }
        else if(d.data.status==500) {
          alert("Some Internal Error Occcured!");
        }
        else if(d.data.status==101) {
          alert("We had send you verifiation link through email and sms, kindly verify you account first!");
        }
        else {
          alert("Invalid Credentials");
        }
      })
    }
    console.log('Login attempt:', { ...loginData, userType: activeTab });
  };

  const handleRegisterSubmit = () => {
    if(activeTab=='student') {
      let url = `https://onlinecoachinglogin.onrender.com/registerStudent`;
      let data = {
        name: registerData.name,
        phone: Number(registerData.phone),
        email: registerData.email,
        pass: registerData.password,
        pfp: registerData.image,
        cls: registerData.classes[0],
      };
      updateLoad(true)
      axios.post(url, data)
      .then((d) => {
        updateLoad(false)
        console.log(d.data)
        if(d.data.status==200) {
          setActiveTab("login")
          setCurrentPage("student")
          alert("Account Succesfully Created, An Email/SMS is sent to you, kindly verify your details");
        }
        else if(d.data.status==500) {
          alert("Some Internal Error Occcured!");
        }
        else if(d.data.status==101) {
          alert("User Already Exist!!!!");
        }
        else {
          alert("Please Re-Check Your informations");
        }
      })
    }


    else {
      let url = `https://onlinecoachinglogin.onrender.com/registerTeacher`;
      let data = {
        name: registerData.name,
        phone: Number(registerData.phone),
        email: registerData.email,
        pass: registerData.password,
        pfp: registerData.image,
        cls: registerData.classes,
        subjects: registerData.subjects,
      };
      updateLoad(true);
      axios.post(url, data)
      .then((d) => {
        updateLoad(false);
        console.log(d.data)
        if(d.data.status==200) {
          setActiveTab("login");
          setCurrentPage("teacher")
          alert("Account Succesfully Created, An Email/SMS is sent to you, kindly verify your details");
        }
        else if(d.data.status==500) {
          alert("Some Internal Error Occcured!");
        }
        else if(d.data.status==101) {
          alert("User Already Exist!!!!");
        }
        else {
          alert("Please Re-Check Your informations");
        }
      })
    }
    
    console.log('Registration attempt:', { ...registerData, userType: activeTab });
  };

  const switchPage = (page) => {
    setCurrentPage(page);
    setActiveTab('student');
    setLoginData({ mobile: '', password: '' });
    setRegisterData({ name: '', phone: '', email: '', password: '', image: null, classes: [], subjects: [] });
    setShowPassword(false);
  };

  if (currentPage === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-300 via-green-100 to-blue-800 text-gray-900 font-sans flex items-center justify-center px-6 py-12">
        {isLoad?<Loader />:null}
      {nav?<Navigate to="/forgotPassword" />:null}
      {navStudent?<Navigate to="/dashboardv2" />:null}
      {navTeacher?<Navigate to="/dashboardv1" />:null}

        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-800 rounded-full opacity-15 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-green-400 rounded-full opacity-10 animate-pulse"></div>

        <div className="w-full max-w-md relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
             {/* <img src={logo} className="w-24 h-18 bg-[#231F20] rounded-lg flex items-center justify-center text-white font-bold text-xl" /> */}
            <h1 className="text-4xl font-bold mb-2 text-gray-900">
              Welcome Back
            </h1>
            <p className="text-gray-900/70 font-medium">
              Sign in to your account to continue
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white/80 backdrop-blur-lg border-2 border-blue-800/20 rounded-3xl p-8 shadow-xl shadow-blue-800/10">
            {/* Tab Navigation */}
            <div className="flex bg-green-100/60 rounded-2xl p-1 mb-8 border border-blue-800/10">
              <button
                onClick={() => setActiveTab('student')}
                className={`focus:outline-none flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300  ${
                  activeTab === 'student'
                    ? 'bg-blue-800 text-white shadow-lg'
                    : 'bg-white text-black'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => setActiveTab('teacher')}
                className={`focus:outline-none flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'teacher'
                    ? 'bg-blue-800 text-white shadow-lg'
                    : 'bg-white text-black'
                }`}
              >
                Teacher
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={loginData.mobile}
                  onChange={handleLoginChange}
                  className="w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your mobile number"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className="w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300 pr-12"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-800 text-white focus:outline-none border-none shadow-lg hover:text-blue-800 transition-colors"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <button onClick={() => {updateNav(true)}} className="bg-white text-black font-medium text-sm transition-colors">
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleLoginSubmit}
                className="w-full py-4 bg-blue-800 text-white rounded-xl font-semibold text-lg hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-800/40"
              >
                Sign In as {activeTab === 'student' ? 'Student' : 'Teacher'}
              </button>
            </div>

            {/* Register Link */}
            <div className="text-center mt-8 pt-6 border-t border-gray-300">
              <p className="text-gray-900/70">
                Don't have an account?{' '}
                <button 
                  onClick={() => switchPage('register')}
                  className="bg-white text-black hover:text-purple-800 font-semibold transition-colors"
                >
                  Register here
                </button>
              </p>
            </div>
          </div>

          {/* Features */}
          {/* <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-blue-800/10">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-xs text-gray-900/70 font-medium">Interactive Learning</p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-blue-800/10">
              <div className="text-2xl mb-2">📊</div>
              <p className="text-xs text-gray-900/70 font-medium">Progress Tracking</p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-blue-800/10">
              <div className="text-2xl mb-2">⏰</div>
              <p className="text-xs text-gray-900/70 font-medium">Flexible Schedule</p>
            </div>
          </div>*/}
        </div> 
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-green-100 to-blue-800 text-gray-900 font-sans flex items-center justify-center px-6 py-12">
      {/* Background decorative elements */}
      {nav?<Navigate to="/forgotPassword" />:null}
      {navStudent?<Navigate to="/dashboardv2" />:null}
      {navTeacher?<Navigate to="/dashboardv1" />:null}

      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-300 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-800 rounded-full opacity-15 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-green-400 rounded-full opacity-10 animate-pulse"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">
            Join Us Today
          </h1>
          <p className="text-gray-900/70 font-medium">
            Create your account to get started
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white/80 backdrop-blur-lg border-2 border-blue-800/20 rounded-3xl p-8 shadow-xl shadow-blue-800/10">
          {/* Tab Navigation */}
          <div className="flex bg-green-100/60 rounded-2xl p-1 mb-8 border border-blue-800/10">
            <button
                onClick={() => setActiveTab('student')}
                className={`focus:outline-none flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300  ${
                  activeTab === 'student'
                    ? 'bg-blue-800 text-white shadow-lg'
                    : 'bg-white text-black'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => setActiveTab('teacher')}
                className={`focus:outline-none flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'teacher'
                    ? 'bg-blue-800 text-white shadow-lg'
                    : 'bg-white text-black'
                }`}
              >
                Teacher
              </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
            {/* Profile Image */}
            {/* <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Profile Image
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleRegisterChange}
                className="w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300"
              />
            </div> */}

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={registerData.name}
                onChange={handleRegisterChange}
                className="w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300"
                placeholder="Enter your full name"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={registerData.phone}
                onChange={handleRegisterChange}
                className="w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                className="w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300"
                placeholder="Enter your email address"
              />
            </div>

            {/* Classes - For both Teacher and Student */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {activeTab === 'teacher' ? 'Teaching Classes (Select Multiple)' : 'Student Class'}
              </label>
              <div className="bg-white/70 border border-gray-300 rounded-xl p-3 max-h-32 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                  {availableClasses.map((cls) => (
                    <label key={cls} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type={activeTab === 'student' ? 'radio' : 'checkbox'}
                        name="classes"
                        value={cls}
                        checked={registerData.classes.includes(cls)}
                        onChange={() => {
                          if (activeTab === 'student') {
                            setRegisterData({ ...registerData, classes: [cls] });
                          } else {
                            handleMultiSelect('classes', cls);
                          }
                        }}
                        className="text-blue-800 focus:ring-blue-800"
                      />
                      <span className="text-sm text-gray-900">{cls}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Subjects - Only for Teacher */}
            {activeTab === 'teacher' && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Teaching Subjects (Select Multiple)
                </label>
                <div className="bg-white/70 border border-gray-300 rounded-xl p-3 max-h-32 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-2">
                    {availableSubjects.map((subject) => (
                      <label key={subject} className=" bg-white text-black flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          value={subject}
                          checked={registerData.subjects.includes(subject)}
                          onChange={() => handleMultiSelect('subjects', subject)}
                          className=" bg-white text-black text-blue-800 focus:ring-blue-800"
                        />
                        <span className="text-sm text-gray-900">{subject}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  className="w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300 pr-12"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="bg-white text-black absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-800 transition-colors"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleRegisterSubmit}
            className="w-full mt-6 py-4 bg-blue-800 text-white rounded-xl font-semibold text-lg hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-800/40"
          >
            Register as {activeTab === 'student' ? 'Student' : 'Teacher'}
          </button>

          {/* Login Link */}
          <div className="text-center mt-8 pt-6 border-t border-gray-300">
            <p className="text-gray-900/70">
              Already have an account?{' '}
              <button 
                onClick={() => switchPage('login')}
                className="text-blue-800 hover:text-purple-800 bg-white text-black font-semibold transition-colors"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}