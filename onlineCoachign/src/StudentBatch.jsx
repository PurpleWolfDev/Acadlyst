import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { Upload, FileText, Calendar, Clock, ChevronDown, ChevronUp, Eye, Download } from 'lucide-react';
import Loader from './Loader';
import { 
  ArrowLeft, 
  Bell, 
  ClipboardList, 
  CheckSquare, 
  Users,
  ChevronRight,
  Plus,
  X,
  Play
} from 'lucide-react';
import { user } from '@heroui/react';

export function StudentBatch() {
  const [activeSection, setActiveSection] = useState('assignments');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [todos, setTodos] = useState([]);
  const [isLoad, updateLoad] = useState(false);
  const [todaySchedule, updateSchedule] = useState([]);
  const [homeNav, updateHomeNav] = useState(false);
  const [newTodo, setNewTodo] = useState('');
 const [assignments, updateAssignments] = useState([]);
  const [expandedRemarks, setExpandedRemarks] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});  // const test = useRef()
  const [searchParams] = useSearchParams();
  const [notices, updateNotice] = useState([]);
  // const [flag, update]
  const [showAddTodo, setShowAddTodo] = useState(false);

  console.log(selectedFiles)
const mockAssignments = [
    // {
    //   id: 1,
    //   title: 'Calculus Problem Set 1',
    //   description: 'Solve the integration problems from Chapter 5 and provide step-by-step solutions.',
    //   dueDate: '2025-07-05T23:59:00',
    //   status: 'pending',
    //   teacherRemark: null,
    //   attachments: ['calculus_problems.pdf'],
    //   submissions: [

    //   ]
    // }
  ];
  const sidebarItems = [
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'notice', label: 'Notice', icon: Bell },
    { id: 'test', label: 'Test', icon: ClipboardList },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'todo', label: 'Todo', icon: CheckSquare }
  ];

  // Initialize todos with default data (no localStorage)
  useEffect(() => {
    try {
    const defaultTodos = [
      // { id: 1, task: 'Complete Math Assignment 3', completed: false},
      // { id: 2, task: 'Study for Physics Test', completed: false},
      // { id: 3, task: 'Submit Chemistry Lab Report', completed: true},
      // { id: 4, task: 'Read Chapter 5 - Biology', completed: false},
    ];
    setTodos(JSON.parse(localStorage.getItem("todo"))?JSON.parse(localStorage.getItem("todo")):[]);
    // Notice Load

    let userData = JSON.parse(localStorage.getItem("userData"));
    updateLoad(true);
    let url1 = `https://homebackend-3y7i.onrender.com/loadBatchNotices?token=${userData.token}&bId=${searchParams.get('bId')}`;
    fetch(url1)
    .then(res => res.json())
    .then(dat => {
      updateLoad(false);
      if(dat.status==200) {
        updateNotice(dat.data.notifs);
      }
      else {
        alert("Error!!");
      }
    });
    } catch(err) {
      console.log(err);
    }

    try {
      updateLoad(true);
      fetch(`https://homebackend-3y7i.onrender.com/loadBatchSchedule?token=${JSON.parse(localStorage.getItem("userData")).token}&bId=${searchParams.get('bId')}&sId=${JSON.parse(localStorage.getItem("userData")).sId}`)
      .then(res => res.json())
      .then(dat => {
        updateLoad(false);
        if(dat.status==200) {
          console.log("bruh", dat.data)
          updateSchedule(dat.data);
        }
        else {
          alert("Error!!")
        }
      });
    } catch(err) {
      console.log(err)
      alert("ERROR!");
    }
  }, []);

// [
//                 { id: 1, title: 'Math Assignment', status: 'pending', teacherRemark: null },
//                 { id: 2, title: 'Physics Assignment', status: 'pending', teacherRemark: null },
//                 { id: 3, title: 'Chemistry Assignment', status: 'submitted', teacherRemark: 'Good work! However, please review question 5 and resubmit with proper calculations.' }
//               ]

  const addTodo = () => {
    if (newTodo.trim()) {
      const newTodoItem = {
        id: Date.now(),
        task: newTodo.trim(),
        completed: false,
        priority: 'Medium'
      };
      setTodos([...todos, newTodoItem]);
      localStorage.setItem("todo", JSON.stringify([...todos, newTodoItem]));
      setNewTodo('');
      setShowAddTodo(false);
    }
  };
useEffect(() => {
    // Replace this with your actual API call
    updateAssignments(mockAssignments);
    
    
    try {
      updateLoad(true);
      let userData = JSON.parse(localStorage.getItem("userData"));
      fetch(`https://homebackend-3y7i.onrender.com/getStudentAssignment?token=${userData.token}&sId=${userData.sId}&batchId=${searchParams.get("bId")}`)
      .then(res => res.json())
      .then(dat => {
        updateLoad(false);
        if(dat.status==200) {
          console.log(dat.data)
          updateAssignments(dat.data);
        }
        else {
          alert("Error!!");
        }
      });
    } catch(err) {
      console.log(err)
      alert("Error!!");
        updateLoad(false);
    }
    
  }, []);

  const getDueStatus = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const timeDiff = due - now;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (timeDiff < 0) {
      return { text: 'OVERDUE', color: 'bg-red-500 text-white', textColor: 'text-red-600' };
    } else if (daysDiff <= 1) {
      return { text: 'DUE TODAY', color: 'bg-orange-500 text-white', textColor: 'text-orange-600' };
    } else if (daysDiff <= 3) {
      return { text: `${daysDiff} DAYS LEFT`, color: 'bg-yellow-500 text-white', textColor: 'text-yellow-600' };
    } else {
      return { text: `${daysDiff} DAYS LEFT`, color: 'bg-green-500 text-white', textColor: 'text-green-600' };
    }
  };

   const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleRemarks = (assignmentId) => {
    setExpandedRemarks(prev => ({
      ...prev,
      [assignmentId]: !prev[assignmentId]
    }));
  };

 const handleFileSelect = async(assignmentId, files) => {
  if (files && files[0]) {
    const file = files[0];
    console.log(file);
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    
    if (validTypes.includes(file.type)) {

      const blobUrl = URL.createObjectURL(file);
      const fileUrl = await uploadFile(blobUrl);
      console.log('Blob URL:', fileUrl);
      
      setSelectedFiles(prev => ({
        ...prev,
        [assignmentId]: {
          file: file,
          blobUrl: fileUrl
        }
      }));
    } else {
      alert('Please select a PDF or image file (PNG/JPEG)');
    }
  }
};


  const uploadFile = async (blobUrl) => {
  // updateLoad(true);
    updateLoad(true);
  const res = await fetch(blobUrl);
  const blob = await res.blob();

  const file = new File([blob], 'upload.pdf', { type: 'application/pdf' });

  const formData1 = new FormData();
  formData1.append('file', file);
  formData1.append('upload_preset', 'test123');

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/djrkhtfko/upload`, {
    method: 'POST',
    body: formData1,
  });

  // updateLoad(false);

  const data = await uploadRes.json();
  console.log('✅ Uploaded PDF URL:', data.secure_url);
  updateLoad(false);
  // updateUrls((prev) => [...prev, { id: a, url: data.secure_url }]);

  return data.secure_url; // ✅ Return value to resolve Promise<string>
};

  const handleSubmit = (assignmentId) => {
    const file = selectedFiles[assignmentId];
     if (!file) {
      alert('Please select a file to submit');
      return;
    }
    console.log(file);
    let userData = JSON.parse(localStorage.getItem("userData"));
    updateLoad(true);
    let url = `https://homebackend-3y7i.onrender.com/submitAssignment?userData=${localStorage.getItem("userData")}&bId=${searchParams.get("bId")}&fileUrl=${file.blobUrl}&fileName=${file.file.name}&size=${file.file.size}&assignmentId=${assignmentId}&adminId=${searchParams.get("id")}`;
    fetch(url)
    .then(res => res.json())
    .then(dat => {
      console.log(dat)
      updateLoad(false);
      if(dat.status==200) {
        updateAssignments(dat.data);
        alert("Submitted!");
          //  console.log('Submitting file for assignment', assignmentId, file);
    // alert(`File "${file.name}" submitted successfully!`);
    
    // Clear the selected file after submission
    setSelectedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[assignmentId];
      return newFiles;
    });
      }
      else alert("!!");
    });
   
    
    // Here you would implement the actual file upload logic
 
  };


  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
    localStorage.setItem("todo", JSON.stringify(todos.filter(todo => todo.id !== id)));
  };
function formatTimestamp(timestamp) {
  const now = Date.now();
  const diffMs = now - timestamp;

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 60 * 60 * 1000) {
    return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
  } else if (diffMs < 24 * 60 * 60 * 1000) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else {
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }
}

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
    localStorage.setItem("todo", JSON.stringify(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )));

  };

  const renderContent = () => {
    switch(activeSection) {
      case 'assignments':
        return (
          <div className="space-y-6 p-4">
      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Available Assignments</h2>
      {isLoad?<Loader />:null}
      <div className="grid gap-6">
        {assignments.map((assignment) => {
          console.log(assignment)
          const dueStatus = getDueStatus(assignment.dueDateTime);
          const isExpanded = expandedRemarks[assignment.id];
          const selectedFile = selectedFiles[assignment.id];
          console.log("this",selectedFile)
          return (
            <div key={assignment.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
              {/* Header with title and due status */}
              <div className="p-6 pb-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900 flex-1 pr-4">
                    {assignment.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${dueStatus.color}`}>
                    {dueStatus.text}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>Due: {formatDate(assignment.dueDate)}</span>
                </div>
                
                <p className="text-gray-700 text-sm leading-relaxed">
                  {assignment.description}
                </p>
              </div>

              {/* Attachments Section */}
              {assignment.attachments && assignment.attachments.length > 0 && (
                <div className="px-6 pb-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Attachments
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {assignment.attachments.map((attachment, index) => (
                      <button
                        key={index}
                        onClick={() => {window.location.href = attachment.url;}}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs hover:bg-blue-100 transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        {attachment.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Teacher Remarks Section */}
              {/* {console.log(assignment)} */}
              {assignment.submissions[0].teacherRemarks.length==1 && (
                <div className="px-6 pb-4">
                  <button
                    onClick={() => toggleRemarks(assignment.id)}
                    className="bg-indigo text items-center gap-2 text-sm font-semibold transition-colors"
                  >
                    <span>Teacher's Remarks</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  
                  {isExpanded && (
                    <div className="mt-2 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                      <p className="text-sm text-yellow-800">{assignment.submissions[0].teacherRemarks[0].msg}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Submission Section */}
              <div className="px-6 pb-6">
                {((assignment.submissions.length==1)) ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-700">
                        Submitted: {assignment.submissions[0].fileName}
                      </span>
                    </div>
                    <button onClick={() => {window.location.href = assignment.submissions[0].url}} className="text-green-600 hover:text-green-800 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        id={`file-${assignment.id}`}
                        accept=".pdf,.png,.jpeg,.jpg"
                        onChange={(e) => handleFileSelect(assignment.id, e.target.files)}
                        className="hidden"
                      />
                      <label
                        htmlFor={`file-${assignment.id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        <Upload className="w-4 h-4" />
                        Choose File
                      </label>
                      
                      {selectedFile && (
                        <span className="text-sm text-gray-600 flex-1 truncate">
                          {selectedFile.file.name}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleSubmit(assignment.id)}
                        disabled={!selectedFile}
                        className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                          selectedFile
                            ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Submit Assignment
                      </button>
                      
                      {dueStatus.text === 'OVERDUE' && (
                        <span className="px-3 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-lg">
                          Late Submission
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      Accepted formats: PDF, PNG, JPEG (Max 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
        );
      
      case 'notice':
        return (
          <div className="space-y-6">
      {isLoad?<Loader />:null}
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Notice Board</h2>
            <div className="space-y-4">
              {notices.map((item) => (
                
                <div className="bg-white/70 backdrop-blur-lg border-2 border-indigo-200 rounded-3xl shadow-xl shadow-indigo-200/20 p-6 hover:shadow-xl hover:shadow-indigo-200/30 transition-all duration-300 w-full max-[500px]:w-[95%] max-[500px]:mx-auto">
                  <div className="flex items-center gap-4 mb-3">{console.log(item)}
                    <Bell className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm text-gray-600">{formatTimestamp(item.id)}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-base text-gray-700">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'test':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Tests & Examinations</h2>
      {isLoad?<Loader />:null}
            <div className="grid md:grid-cols-2 gap-6">
            <h3 className="text-xl lg:text-3xl font-bold text-gray-900">This section is under development</h3>

              {[
                // { id: 1, title: 'Math Test', canStart: false, status: 'upcoming' },
                // { id: 2, title: 'Physics Test', canStart: true, status: 'ready' },
                // { id: 3, title: 'Chemistry Test', canStart: false, status: 'upcoming' },
                // { id: 4, title: 'Biology Test', canStart: true, status: 'ready' }
              ].map((item) => (
                <div key={item.id} className="bg-white/70 backdrop-blur-lg border-2 border-indigo-200 rounded-3xl shadow-xl shadow-indigo-200/20 p-6 hover:scale-105 transition-all duration-300 w-full max-[500px]:w-[95%] max-[500px]:mx-auto max-[500px]:col-span-2">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.status === 'ready' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {item.status === 'ready' ? 'Ready' : 'Upcoming'}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-base text-gray-700"><strong>Date:</strong> June 30, 2025</p>
                    <p className="text-base text-gray-700"><strong>Time:</strong> 10:00 AM</p>
                    <p className="text-base text-gray-700"><strong>Duration:</strong> 2 hours</p>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <button className="px-4 py-2 bg-transparent border-2 border-gray-400 text-gray-700 hover:bg-gray-100 hover:border-gray-500 transition-all duration-300 hover:scale-105 rounded-lg font-medium">
                      View Syllabus
                    </button>
                    <button
                      disabled={!item.canStart}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                        item.canStart
                          ? 'bg-green-600 text-white hover:bg-green-700 hover:scale-105 cursor-pointer'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <Play className="w-4 h-4" />
                      Start Test
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'schedule':
        const getCurrentDay = () => {
          const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const today = new Date();
          return days[today.getDay()];
        };

        const getCurrentTime = () => {
          const now = new Date();
          return now.getHours() * 60 + now.getMinutes();
        };

        const parseTime = (timeStr) => {
          const [time, period] = timeStr.split(' ');
          const [hours, minutes] = time.split(':').map(Number);
          let totalHours = hours;
          if (period === 'PM' && hours !== 12) totalHours += 12;
          if (period === 'AM' && hours === 12) totalHours = 0;
          return totalHours * 60 + minutes;
        };

        const currentDay = getCurrentDay();
        const currentTime = getCurrentTime();
        
        // // const todaySchedule = [
        // //   { time: '9:00 AM', endTime: '10:30 AM', subject: 'Mathematics', day: 'Thursday', room: 'Room 101' },
        // //   { time: '11:00 AM', endTime: '12:30 PM', subject: 'Physics', day: 'Thursday', room: 'Room 205' },
        // //   { time: '2:00 PM', endTime: '3:30 PM', subject: 'Chemistry', day: 'Thursday', room: 'Room 301' },
        // //   { time: '4:00 PM', endTime: '5:30 PM', subject: 'Biology', day: 'Thursday', room: 'Room 102' },
        // // ].filter(schedule => schedule.day === currentDay);

        const getClassStatus = (startTime, duration) => {
          const start = startTime;
          console.log(new Date(start));
          console.log(new Date());
          const end = startTime+(duration*60000);
          let t = new Date().getTime();
          console.log(start-t);
          if (t < start) {
            return { status: 'upcoming', canStart: false, statusText: 'Upcoming' };
          } else if (t >= start && t < start) {
            return { status: 'ready', canStart: true, statusText: 'Ready to Start' };
          } else if (t >= start && t < end) {
            return { status: 'ongoing', canStart: true, statusText: 'Ongoing' };
          } else {
            return { status: 'completed', canStart: false, statusText: 'Completed' };
          }
        };

        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Today's Schedule</h2>
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-100 border border-indigo-300 rounded-full">
                <Calendar className="w-4 h-4 text-indigo-700" />
                <span className="text-indigo-700 font-medium">{currentDay}, June 26</span>
              </div>
      {isLoad?<Loader />:null}
            </div>
            
            <div className="bg-white/70 backdrop-blur-lg border-2 border-indigo-200 rounded-3xl shadow-xl shadow-indigo-200/20 p-6 w-full max-[500px]:w-[95%] max-[500px]:mx-auto">
              {todaySchedule.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Classes Today</h3>
                  <p className="text-base text-gray-700">Enjoy your day off!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todaySchedule.map((schedule, index) => {
                    let dayTime = new Date(new Date(schedule.date).getTime()-19800000).getTime();
                    // console.log(new Date(schedule.time).getTime())
                    let [hour, mins] = schedule.time.split(":");
                    const exactTimeStamp = dayTime + (Number(hour)*3600000) + (Number(mins)*60000);
                    const endTime = exactTimeStamp + (schedule.duration*60000);
                    const classInfo = getClassStatus(exactTimeStamp, schedule.duration);
                    // const classInfo = "hi"
                    return (
                      <div key={index} className={`flex justify-between items-center p-4 rounded-2xl transition-all duration-300 ${
                        classInfo.status === 'ongoing' ? 'bg-green-100 border-2 border-green-300' :
                        classInfo.status === 'ready' ? 'bg-blue-100 border-2 border-blue-300' :
                        classInfo.status === 'completed' ? 'bg-gray-100 border border-gray-300' :
                        'bg-white/50 border border-gray-300 hover:border-indigo-300 hover:bg-indigo-50'
                      }`}>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{schedule.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              classInfo.status === 'ongoing' ? 'bg-green-200 text-green-800' :
                              classInfo.status === 'ready' ? 'bg-blue-200 text-blue-800' :
                              classInfo.status === 'completed' ? 'bg-gray-200 text-gray-800' :
                              'bg-orange-200 text-orange-800'
                            }`}>
                              {classInfo.statusText}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{schedule.time} - {`${new Date(endTime).getHours()}:${new Date(endTime).getMinutes()}`}</span>
                            {/* <span>{schedule.room}</span> */}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {/* {console.log(schedule.meetingLink)} */}
                          <button
                            disabled={(!classInfo.canStart)}
                            onClick={() => {if(!(schedule.meetingLink=="")) {window.location.href=`${schedule.meetingLink}`} else alert("Meeting Link Wasn't Given")}}
                            className={`px-2 py-2 rounded-lg font-medium transition-all duration-300 ${
                              classInfo.canStart
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 cursor-pointer'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
                            }`}
                          >
                            {classInfo.status === 'ongoing' ? 'Join Class' : 'Start Class'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );

      case 'todo':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Todo List</h2>
              <button
                onClick={() => setShowAddTodo(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Todo
              </button>
            </div>
      {isLoad?<Loader />:null}

            {showAddTodo && (
              <div className="bg-white/70 backdrop-blur-lg border-2 border-indigo-200 rounded-3xl shadow-xl shadow-indigo-200/20 p-4 w-full max-[500px]:w-[95%] max-[500px]:mx-auto">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Enter new todo..."
                    className="bg-white text-black flex-1 px-4 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                  />
                  <button
                    onClick={addTodo}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-300"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowAddTodo(false);
                      setNewTodo('');
                    }}
                    className="px-4 py-2 bg-transparent border-2 border-gray-400 text-gray-700 hover:bg-gray-100 hover:border-gray-500 transition-all duration-300 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              {todos.map((item) => (
                <div key={item.id} className={`bg-white/70 backdrop-blur-lg border-2 border-indigo-200 rounded-3xl shadow-xl shadow-indigo-200/20 p-4 hover:scale-105 transition-all duration-300 w-full max-[500px]:w-[95%] max-[500px]:mx-auto ${item.completed ? 'opacity-60' : ''}`}>
                  <div className="flex items-center gap-4">
                    {console.log(todos)}
                    <CheckSquare className={`w-5 h-5 ${item.completed ? 'text-green-600' : 'text-gray-400'}`} />
                    <div className="flex-1">
                      <h4 className={`font-semibold ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {item.task}
                      </h4>
                    </div>
                    {/* <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.priority === 'High' ? 'bg-red-100 text-red-800' :
                      item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.priority}
                    </span> */}
                    <button
                      onClick={() => toggleTodo(item.id)}
                      className="px-4 py-2 bg-transparent border-2 border-indigo-400 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-500 transition-all duration-300 hover:scale-105 rounded-lg font-medium"
                    >
                      {item.completed ? 'Undo' : 'Done'}
                    </button>
                    <button
                      onClick={() => deleteTodo(item.id)}
                      className="bg-red-500 text-white p-2 transition-all duration-300 hover:scale-105 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {todos.length === 0 && (
                <div className="text-center py-12">
                  <CheckSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Todos Yet</h3>
                  <p className="text-base text-gray-700">Add your first todo item to get started!</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-indigo-200">
      {/* Header */}
      <header className="bg-white/20 backdrop-blur-sm border-b border-gray-300 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => {updateHomeNav(true)}} className="flex items-center gap-2 px-2 py-2 bg-transparent border-2 border-indigo-400 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-500 transition-all duration-300 hover:scale-105 rounded-lg font-medium">
                <ArrowLeft className="w-4 h-4" />
      {isLoad?<Loader />:null}
              </button>
              <div className="flex items-center gap-3">
                {/* <div className="w-24 h-18 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TeachOnline</span>
                </div> */}
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 mx-5">Batch Dashboard</h1>
                  <p className="text-sm text-gray-600 mx-5">{searchParams.get("batch")}</p>
                  {homeNav?<Navigate to="/dashboardv2" />:null}
                </div>
              </div>
            </div>
            {/* <div className="flex items-center gap-4">
              <Users className="w-6 h-6 text-indigo-600" />
              <span className="text-sm font-medium text-gray-900">32 Students</span>
            </div> */}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 bg-white/30 backdrop-blur-sm min-h-screen border-r border-gray-300">
          <nav className="p-6">
            <ul className="space-y-2 mt-20">
              {sidebarItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 ${
                        activeSection === item.id
                          ? 'bg-indigo-600 text-white shadow-lg'
                          : 'bg-transparent text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      {item.label}
                      {activeSection === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-white/70 backdrop-blur-lg border border-indigo-200 rounded-lg shadow-lg"
        >
          <ChevronRight className={`w-5 h-5 text-indigo-600 transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)}>
            <aside className="w-64 bg-white/90 backdrop-blur-lg h-full border-r border-gray-300">
              <nav className="p-6 pt-20">
                <ul className="space-y-2 mt-20">
                  {sidebarItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => {
                            setActiveSection(item.id);
                            setSidebarOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 ${
                            activeSection === item.id
                              ? 'bg-indigo-600 text-white shadow-lg'
                              : 'bg-transparent text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                          {item.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}