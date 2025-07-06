import React, { useEffect, useState } from 'react';
import { Upload, Plus, Edit2, Trash2, Eye, MessageCircle, Clock, CheckCircle, AlertTriangle, User, Paperclip, Download, X } from 'lucide-react';
import type { Assignment, AssignmentSubmission, AssignmentFile, FileUrls } from '../types';
import Loader from './Loader';

const Assignments: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [expandedAssignment, setExpandedAssignment] = useState<string | null>(null);
  const [feedbackModal, setFeedbackModal] = useState<{ assignmentId: string; submissionId: string } | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [urls, updateUrls] = useState<FileUrls[]>([]);
  const [hTime, updateTime] = useState(0);
  const [isLoad, updateLoad] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<AssignmentFile[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: 0,
    totalMarks: 100,
  });

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Calculus Assignment - Derivatives',
      description: 'Solve the problems related to derivatives and limits. Show all working steps.',
      dueDate: "sfonw",
      dueDateTime:23434,
      timeOfCreation: 235345345,
      totalMarks: 100,
      attachments: [
        {
          id: 'f1',
          name: 'calculus_problems.pdf',
          size: 245760,
          type: 'application/pdf',
          url: '#'
        }
      ],
      submissions: [
        {
          id: 's1',
          sId: '1',
          name: 'Alice Johnson',
          pfp: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
          dateOfSubmission: '2024-12-28',
          marks: 85,
          feedback: 'Good work! Minor calculation errors in question 3.',
          attachments: [
            {
              id: 'sf1',
              name: 'alice_solution.pdf',
              size: 189440,
              type: 'application/pdf',
              url: '#'
            }
          ]
        }
      ]
    }
  ]);

  useEffect(() => {
    try {
      updateLoad(true)
      fetch(`https://homebackend-3y7i.onrender.com/getAssignments?batchId=${localStorage.getItem("batchId")}&adminId=${localStorage.getItem("sId")}`)
      .then(res => res.json())
      .then(dat => {
        updateLoad(false);
        if(dat.status==200) {
          setAssignments(dat.data)
        }
        else {alert("Error!!")}
      });
    } catch(err) {
      alert("Error");
    }
  }, []);

  // const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = Array.from(e.target.files || []);
  //   const newFiles: AssignmentFile[] = files.map((file) => {
  //     let a:any = Date.now().toString() + Math.random().toString(36).substr(2, 9)
  //     let url = uploadFile(URL.createObjectURL(file), a)
  //     return {
  //     id: a,
  //     name: file.name,
  //     size: file.size,
  //     type: file.type,
  //     url: URL.createObjectURL(file)
  //   };
  // });
    
  // };
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);
  
  const newFiles: AssignmentFile[] = await Promise.all(
    files.map(async (file) => {
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      let aa = URL.createObjectURL(file)
      const fileUrl = await uploadFile(aa, id); // Assuming `uploadFile` returns uploaded file URL

      return {
        id,
        name: file.name,
        size: file.size,
        type: file.type,
        url: fileUrl,
      };
    })
  );
  setUploadedFiles([...uploadedFiles, ...newFiles]);

  // Now you can do something with `newFiles`, e.g., set state
};


  const removeFile = (fileId: string) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAssignment: Assignment = {
      id: editingAssignment?.id || Date.now().toString(),
      ...formData,
      timeOfCreation: new Date().getTime(),
      attachments: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      submissions: editingAssignment?.submissions || []
    };

    if (editingAssignment) {
      updateLoad(true);
      fetch(`https://homebackend-3y7i.onrender.com/createAssign?adminId=${localStorage.getItem("sId")}&batchId=${localStorage.getItem("batchId")}&mainBody=${JSON.stringify(newAssignment)}&urlBody=${JSON.stringify(urls)}`)
      .then(res => res.json())
      .then(dat => {
        updateLoad(false)
        if(dat.status==200) {
          setAssignments(assignments.map(a => a.id === editingAssignment.id ? newAssignment : a));
          setEditingAssignment(null);
          setShowForm(false);
        }
        else {
          alert("Error!");
        }
      });
      
    } else {
      console.log(newAssignment)
      updateLoad(true);
      fetch(`https://homebackend-3y7i.onrender.com/createAssign?adminId=${localStorage.getItem("sId")}&batchId=${localStorage.getItem("batchId")}&mainBody=${JSON.stringify(newAssignment)}&urlBody=${JSON.stringify(urls)}&update=0`)
      .then(res => res.json())
      .then(dat => {
        updateLoad(false);
        if(dat.status==200) {
          setAssignments([newAssignment, ...assignments]);
          setFormData({
            title: '',
            description: '',
            dueDate: 0,
            totalMarks: 100,
          });
          setUploadedFiles([]);
          setShowForm(false);
        }
        else {
          alert("Error!");
        }
      });
    }

  };

  const uploadFile = async (blobUrl: string, a: string): Promise<string> => {
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

  updateLoad(false);

  const data = await uploadRes.json();
  console.log('✅ Uploaded PDF URL:', data.secure_url);

  // updateUrls((prev) => [...prev, { id: a, url: data.secure_url }]);

  return data.secure_url; // ✅ Return value to resolve Promise<string>
};

  const handleEdit = (assignment: Assignment) => {
    // console.log()
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      totalMarks: assignment.totalMarks,
    });
    setUploadedFiles(assignment.attachments || []);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    updateLoad(true);
    fetch(`https://homebackend-3y7i.onrender.com/deleteAssign?adminId=${localStorage.getItem('sId')}&batchId=${localStorage.getItem("batchId")}&id=${id}`)
    .then(res => res.json())
    .then(dat => {
      updateLoad(false);
      if(dat.status==200) {
        setAssignments(assignments.filter(a => a.id !== id));
      } 
      else {
        alert("Error!!")
      }
    });
  
  };

  const handleFeedbackSubmit = () => {
    if (!feedbackModal) return;
    else {
      fetch(`https://homebackend-3y7i.onrender.com/submitRemarks?batchId=${localStorage.getItem("batchId")}&adminId=${localStorage.getItem("sId")}&studentId=${localStorage.getItem("submissionSID")}&assignmentId=${localStorage.getItem("assignmentId")}&msg=${feedbackText}`)
      .then(res => res.json())
      .then(dat => {
        if(dat.status==200) {
      setAssignments(assignments.map(assignment => 
        assignment.id === feedbackModal.assignmentId 
          ? {
              ...assignment,
              submissions: assignment.submissions.map(submission =>
                submission.id === feedbackModal.submissionId
                  ? { ...submission, feedback: feedbackText, status: 'graded' as const }
                  : submission
              )
            }
          : assignment
      ));

      setFeedbackModal(null);
      setFeedbackText('');
      localStorage.removeItem("submissionSID");
      localStorage.removeItem("assignmentId");
    }
    else {
      alert("Error Occured!!");
    }
  })
  }
};

  const handleDownload = (file: AssignmentFile) => {
    // In a real app, this would download the actual file
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSubmissionStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <Clock className="text-orange-600" size={16} />;
      case 'graded': return <CheckCircle className="text-green-600" size={16} />;
      case 'late': return <AlertTriangle className="text-red-600" size={16} />;
      default: return <Clock className="text-gray-600" size={16} />;
    }
  };
  const getSubmissionStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-orange-100 text-orange-800';
      case 'graded': return 'bg-green-100 text-green-800';
      case 'late': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
   const dateToTimestamp = (dateString:string) => {
  const a:any = dateString.split('-');
  const year:any = a[0];
  const month:any = a[1];
  const day:any = a[2];
  return new Date(year, month - 1, day).getTime();
};
  
  // if(isLoad) {
  //   return (<Loader />);
  // }

  return (
    <div className="space-y-6 lg:space-y-8 relative max-w-[100%] overflow-hidden">
      {/* {true&&"hi"} */}
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">Assignments</h1>
          <p className="text-lg sm:text-xl text-gray-900/80 font-medium mt-2">
            Upload and manage assignments for your students
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-800 text-white rounded-full font-semibold hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 sm:hover:scale-110 hover:shadow-xl hover:shadow-blue-800/40 flex items-center justify-center space-x-2"
        >
          <Plus size={20} />
          <span>Create Assignment</span>
        </button>
      </div>
      
      {/* Assignment Form */}
      {showForm && (
        <div className="bg-white/70 backdrop-blur-lg border-2 border-blue-800/20 rounded-2xl sm:rounded-3xl shadow-xl shadow-blue-800/10 p-4 sm:p-6 lg:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
            {editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Assignment Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/50 border border-blue-800/20 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300"
                placeholder="Enter assignment title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/50 border border-blue-800/20 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300 resize-none"
                placeholder="Enter assignment description and instructions"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => {setFormData({ ...formData, dueDate: e.target.value, dueDateTime:dateToTimestamp(e.target.value)});console.log(e.target.value)}}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/50 border border-blue-800/20 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Total Marks *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.totalMarks}
                  onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/50 border border-blue-800/20 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300"
                />
              </div>
              {/* <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/50 border border-blue-800/20 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div> */}
            </div>

            {/* File Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Attachments (PDF, Images)
              </label>
              <div className="border-2 border-dashed border-blue-800/30 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center hover:border-blue-800/50 transition-all duration-300">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.gif"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="mx-auto text-blue-800 mb-2" size={32} />
                  <p className="text-blue-800 font-medium">Click to upload files</p>
                  <p className="text-sm text-gray-900/60 mt-1">PDF, JPG, PNG up to 10MB each</p>
                </label>
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-900">Uploaded Files:</p>
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-gray-900/10">
                      <div className="flex items-center space-x-3">
                        <Paperclip className="text-blue-800" size={16} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-900/60">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-all duration-300"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 max-w-[100%]">
              <button
                type="submit"
                className=" max-w-[100%] sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-800 text-white rounded-full font-semibold hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 sm:hover:scale-110 hover:shadow-xl hover:shadow-blue-800/40"
              >
                {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingAssignment(null);
                  setUploadedFiles([]);
                  setFormData({
                    title: '',
                    description: '',
                    dueDate: '',
                    totalMarks: 100,
                    status: 'draft'
                  });
                }}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-blue-800 text-blue-800 rounded-full font-semibold hover:bg-blue-800 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-800/30"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Assignments List */}
      <div className="bg-white/70 backdrop-blur-lg border-2 border-blue-800/20 rounded-2xl sm:rounded-3xl shadow-xl shadow-blue-800/10 p-4 sm:p-6 lg:p-8 max-w-[100%]">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center space-x-3">
          <Upload className="text-blue-800" size={24} sm:size={28} />
          <span>Created Assignments</span>
        </h2>
        
        {assignments.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Upload className="mx-auto text-gray-400 mb-4" size={40} sm:size={48} />
            <p className="text-lg sm:text-xl text-gray-900/60">No assignments created yet</p>
            <p className="text-gray-900/40 mt-2">Create your first assignment to get started</p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="bg-white/50 border border-gray-900/10 rounded-xl sm:rounded-2xl hover:border-blue-800/30 hover:bg-blue-300/10 transition-all duration-300">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col space-y-4 lg:flex-row lg:items-start lg:justify-between lg:space-y-0">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{assignment.title}</h3>
                        <span className={`self-start px-3 py-1 rounded-full text-xs font-medium ${
                          assignment.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {assignment.status}
                        </span>
                      </div>
                      <p className="text-gray-900/70 mb-3 leading-relaxed text-sm sm:text-base">{assignment.description}</p>
                      
                      {/* Assignment Attachments */}
                      {assignment.attachments && assignment.attachments.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-900 mb-2">Attachments:</p>
                          <div className="flex flex-wrap gap-2">
                            {assignment.attachments.map((file) => (
                              <div key={file.id} onClick={() => {window.location.href=`${file.url}`}} className="flex items-center space-x-2 px-3 py-1 bg-blue-100 rounded-lg max-w-[100%] overflow-scroll h-auto pr-[5px]">
                                <Paperclip className="text-blue-800" size={14} />
                                <span className="text-sm text-blue-800 ">{file.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-900/60">
                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                        <span>Total Marks: {assignment.totalMarks}</span>
                        <span>Submissions: {assignment.submissions.length}</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                      <button
                        onClick={() => setExpandedAssignment(
                          expandedAssignment === assignment.id ? null : assignment.id
                        )}
                        className="px-3 sm:px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
                      >
                        <Eye size={16} />
                        <span>View Submissions</span>
                      </button>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(assignment)}
                          className="p-2 text-blue-800 hover:bg-blue-800/10 rounded-lg transition-all duration-300"
                        >
                          <Edit2 size={16} sm:size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(assignment.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                        >
                          <Trash2 size={16} sm:size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Submissions */}
                {(expandedAssignment === assignment.id) && (
                  <div className="border-t border-gray-900/10 p-4 sm:p-6 bg-gray-50/50">
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                      Student Submissions ({assignment.submissions.length})
                    </h4>
                    {assignment.submissions.length === 0 ? (
                      <p className="text-gray-900/60 text-center py-6 sm:py-8">No submissions yet</p>
                    ) : (
                      <div className="space-y-3 sm:space-y-4">
                        {assignment.submissions.map((submission) => (
                          <div key={submission.id} className="bg-white/70 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-900/10">
                            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                              <div className="flex items-center space-x-3 sm:space-x-4">
                                <img
                                  src={submission.pfp}
                                  alt={submission.name}
                                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                                />
                                <div>
                                  <h5 className="font-medium text-gray-900 text-sm sm:text-base">{submission.name}</h5>
                                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-900/60">
                                    {/* /*{getSubmissionStatusIcon(submission.status)} */}
                                    <span>Submitted on {new Date(submission.timeOfSubmission).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium`}>
                                  {/* {submission.teacherRemarks.} */}
                                </span>
                                {(submission.teacherRemarks.length==1) && (
                                  <span className="text-sm font-medium text-gray-900">
                                    {submission.teacherRemarks[0].msg}
                                  </span>
                                )}
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => {
                                      localStorage.setItem("submissionSID", submission.sId);
                                      localStorage.setItem("assignmentId", assignment.id);
                                      setFeedbackModal({ assignmentId: assignment.id, submissionId: submission.id });
                                      setFeedbackText(submission.feedback || '');
                                    }}
                                    className="p-1.5 sm:p-2 text-blue-800 hover:bg-blue-800/10 rounded-lg transition-all duration-300"
                                  >
                                    <MessageCircle size={14} sm:size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Student Attachments */}
                            {(submission.attachments) && (submission.attachments.length > 0) && (
                              <div className="mt-3 pt-3 border-t border-gray-900/10">
                                <p className="text-sm font-medium text-gray-900 mb-2">Student Files:</p>
                                <div className="flex flex-wrap gap-2">
                                  {submission.attachments.map((file) => (
                                    <button
                                      key={file.id}
                                      onClick={() => handleDownload(file)}
                                      className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-all duration-300"
                                    >
                                      <Download size={14} />
                                      <span className="text-sm">{file.name}</span>
                                      <span className="text-xs">({formatFileSize(file.size)})</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {submission.feedback && (
                              <div className="mt-3 p-3 bg-blue-50/50 rounded-lg">
                                <p className="text-sm text-gray-900/70">
                                  <strong>Feedback:</strong> {submission.feedback}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {feedbackModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-md">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Leave Feedback</h3>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={4}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300 resize-none"
              placeholder="Enter your feedback for the student..."
            />
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4">
              <button
                onClick={() => {handleFeedbackSubmit()}}
                className="flex-1 px-4 py-2 bg-blue-800 text-white rounded-lg sm:rounded-xl font-medium hover:bg-blue-900 transition-all duration-300"
              >
                Save Feedback
              </button>
              <button
                onClick={() => {
                  setFeedbackModal(null);
                  setFeedbackText('');
                  localStorage.removeItem("submissionSID");
                  localStorage.removeItem("assignmentId");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl font-medium hover:bg-gray-50 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;