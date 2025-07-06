import React, { useState, useEffect, useRef } from 'react';
import { User, Camera, BookOpen, Users, Trash2, Save, X, ArrowLeft } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import Loader from './Loader.jsx';

export const TeacherSettings = () => {
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    photo: null,
    classes: [],
    subjects: []
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newClass, setNewClass] = useState('');
  const [email, updateEmail] = useState("");
  const [isLoad, updateLoad] = useState(false);
  const [name, updateName] = useState("");
  const homeLoad = useRef(false);
  const [navLogin, updateLogin] = useState(false);
  const [pfp, updatePfp] = useState("sample");
  const [cls, updateCls] = useState([]);
  const [subjects, updateSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [dashNav, updateDash] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // const handlePhotoChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setPhotoPreview(e.target.result);
  //       console.log(e.target.result)
  //       setFormData(prev => ({ ...prev, photo: e.target.result }));
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handlePhotoChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formDat = new FormData();
  formDat.append("image", file);

  try {
    updateLoad(true);
    const res = await fetch("https://api.imgbb.com/1/upload?key=408cbde67b037fdd11778e294c0f5f61", {
      method: "POST",
      body: formDat,
    });

    const data = await res.json();
    updateLoad(false);
    console.log("Image URL:", data.data.url);
    setFormData(prev => ({ ...prev, photo: data.data.url }));
    setPhotoPreview(data.data.url);

  } catch (err) {
    console.error("Upload error:", err);
  }
};
  // 408cbde67b037fdd11778e294c0f5f61
  // const handlePhotoChange = (e) => {
  //       // updateLoad(false);
  //       try {
  //           const fi = e[0];
  //           var f = new FileReader();
  //           f.readAsDataURL(fi);
  //           f.onload = (e) => {
  //               setFormData(prev => ({ ...prev, photo: e.target.result }));
  //               console.log(e)
  //               // updateLoad(true);
  //           }
  //   } catch(err) {
  //     console.log(err);
  //       // toast({
  //       //     title: 'Error!',
  //       //     description: "Some internal error occured! Try after some time",
  //       //     status: 'error',
  //       //     duration: 7000,
  //       //     isClosable: true,
  //       // })
  //       // convertToFiles(e);
  //       // console.log(err)
  //   }
  //   }

  const addClass = () => {
    if((newClass>=12)||(newClass<=3)) {
      console.log("hi")
      alert("Class Range is 4-12!");
      return;
    }
    if (!formData.classes.includes(newClass)) {
      setFormData(prev => ({
        ...prev,
        classes: [...prev.classes, newClass.trim()]
      }));
      setNewClass('');
    }
  };
  const addClass2 = (newClass2) => {
    console.log(formData.classes.includes(newClass2))
     if (!(formData.classes.includes(newClass2))) {
      setFormData(prev => ({
        ...prev,
        classes: [...prev.classes, newClass2]
      }));
      setNewClass('');
    }
    
  };

  useEffect(() => {
    try {
      if(true) {
        // console.log(homeLoad.current)
        // homeLoad.current = true;
      let userData = JSON.parse(localStorage.getItem("userData"));
      updateLoad(true);
      let url = `https://homebackend-3y7i.onrender.com/getTeacherSettings?token=${userData.token}&adminId=${userData.sId}`;
      fetch(url)
      .then(res => res.json())
      .then(dat => {
        updateLoad(false);
        if(dat.status==200) {
          handleInputChange('name', dat.data.name);
          handleInputChange('email', dat.data.email);
          setPhotoPreview(dat.data.pfp)
          dat.data.cls.map((e) => {
            addClass2(e);
          });
          dat.data.subjects.map((e) => {
            addSubject2(e);
          });
          // handleInputChange('name', dat.data.name)
          // handleInputChange('name', dat.data.name)
          // handleInputChange('name', dat.data.name)
          // handleInputChange('name', dat.data.name)
        }
        else alert("Invalid!!");
      });
      }
    } catch(err) {

    }
  }, []);

  const removeClass = (classToRemove) => {
    setFormData(prev => ({
      ...prev,
      classes: prev.classes.filter(cls => cls !== classToRemove)
    }));
  };

  const addSubject = () => {
    if (newSubject.trim() && !formData.subjects.includes(newSubject)) {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, newSubject.trim()]
      }));
      setNewSubject('');
    }
  };
  const addSubject2 = (a) => {
    if (a.trim() && !formData.subjects.includes(a)) {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, a.trim()]
      }));
      setNewSubject('');
    }
  };

  const removeSubject = (subjectToRemove) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(sub => sub !== subjectToRemove)
    }));
  };

  const handleSave = () => {
    let userData = JSON.parse(localStorage.getItem("userData"));
    updateLoad(true);
    let url = `https://homebackend-3y7i.onrender.com/updateTeacherSettings?token=${userData.token}&adminId=${userData.sId}&updates=${JSON.stringify(formData)}`;
    fetch(url)
    .then(res => res.json())
    .then(dat => {
      updateLoad(false);
      if(dat.status==200) {
        alert('Your Profile Has Been Updated!');
        window.location.reload();
      }
      else {
        alert("Some internal error occured!");
      }
    });
  };

  const handleDeleteAccount = () => {
    let userData = JSON.parse(localStorage.getItem("userData"));
    updateLoad(true);
    let url = `https://homebackend-3y7i.onrender.com/deleteTeacherAcc?token=${userData.token}&adminId=${userData.sId}`;
    fetch(url)
    .then(res => res.json())
    .then(dat => {
      updateLoad(false);
      if(dat.status==200) {
        setShowDeleteConfirm(false);
        localStorage.clear();
        updateLogin(true);
      }
      else {
        alert("Failed to delete Account!");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-green-100 to-blue-800">
      {/* Navigation Header */}
      <div className="bg-green-100/90 backdrop-blur-lg border-b border-blue-800/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                      {isLoad?<Loader />:null}

              <button 
                onClick={() => {updateDash(true)}}
                className="bg-transparent text-black flex items-center gap-1 sm:gap-2 hover:text-blue-800 transition-all duration-300 cursor-pointer hover:scale-105 px-2 sm:px-3 py-2 rounded-lg hover:bg-blue-800/10 text-gray-900 font-medium active:scale-95 active:bg-blue-800/20 active:text-blue-900 select-none text-sm sm:text-base flex-shrink-0"
              >
                <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Back</span>
              </button>
              <div className="text-gray-900/40 font-medium hidden xs:block">|</div>
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-900/60 min-w-0 overflow-hidden">
                <span className="hover:text-blue-800 transition-colors cursor-pointer hidden sm:inline">Dashboard</span>
                <ArrowLeft size={14} className="rotate-180 hidden sm:block sm:w-4 sm:h-4" />
                <span className="text-blue-800 font-semibold truncate">Settings</span>
              </div>
              {dashNav?<Navigate to={`${JSON.parse(localStorage.getItem("userData")).role=="teacher"?"/dashboardv1":"/dashboardv2"}`} />:null}
            </div>
            <div className="w-10 h-7 sm:w-12 sm:h-9 bg-[#231F20] rounded-lg flex-shrink-0"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Account Settings
          </h1>
          <p className="text-xl text-gray-900/80 font-medium">
            Manage your TeachOnline profile and preferences
          </p>
        </div>

        {/* Settings Form */}
        <div className="bg-white/70 backdrop-blur-lg border-2 border-blue-800/20 rounded-3xl shadow-xl shadow-blue-800/10 p-8">
          <div className="space-y-8">
            
            {/* Profile Information */}
            <div className="bg-white/50 border border-gray-900/10 rounded-2xl p-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <User className="text-blue-800" size={32} />
                Profile Information
              </h2>
              
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-xl font-semibold text-gray-900 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-blue-800/20 bg-white/80 backdrop-blur-sm text-gray-900 font-medium focus:border-blue-800 focus:outline-none transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xl font-semibold text-gray-900 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled={true}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-blue-800/20 bg-white/80 backdrop-blur-sm text-gray-900 font-medium focus:border-blue-800 focus:outline-none transition-all duration-300"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              {/* Photo Upload */}
              <div className="mt-6">
                <label className="block text-xl font-semibold text-gray-900 mb-2">
                  Profile Photo
                </label>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-blue-300/20 border-2 border-blue-800/30 flex items-center justify-center overflow-hidden">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="text-blue-800" size={32} />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="px-4 py-2 border-2 border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white transition-all duration-300 hover:scale-105 rounded-lg font-medium cursor-pointer inline-block"
                    >
                      Choose Photo
                    </label>
                    {photoPreview && (
                      <button
                        onClick={() => {
                          setPhotoPreview(null);
                          setFormData(prev => ({ ...prev, photo: null }));
                        }}
                        className="bg-indigo text-white ml-3 px-4 py-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-105 rounded-lg font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Classes */}
            <div className="bg-white/50 border border-gray-900/10 rounded-2xl p-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Users className="text-blue-800" size={32} />
                Classes
              </h2>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                    placeholder="Add a new class"
                    className="flex-1 px-4 py-3 rounded-lg border-2 border-blue-800/20 bg-white/80 backdrop-blur-sm text-gray-900 font-medium focus:border-blue-800 focus:outline-none transition-all duration-300"
                    onKeyPress={(e) => e.key === 'Enter' && addClass()}
                  />
                  <button
                    onClick={addClass}
                    className="bg-indigo text-white px-6 py-3 bg-blue-800 text-white rounded-lg font-semibold hover:bg-tranparent text-indigo transition-all duration-300 hover:scale-105"
                  >
                    Add
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {formData.classes.map((cls, index) => (
                    <div
                      key={index}
                      className="bg-transparent text-black flex items-center gap-2 px-4 py-2 bg-blue-300/20 border border-blue-800/30 rounded-full text-gray-900 font-medium"
                    >
                      <span>{cls}</span>
                      <button
                        onClick={() => removeClass(cls)}
                        className="bg-red-500 text-white text-red-500 hover:text-red-700 transition-colors duration-200"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Subjects */}
            <div className="bg-white/50 border border-gray-900/10 rounded-2xl p-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <BookOpen className="text-blue-800" size={32} />
                Subjects
              </h2>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Add a new subject"
                    className="flex-1 px-4 py-3 rounded-lg border-2 border-blue-800/20 bg-white/80 backdrop-blur-sm text-gray-900 font-medium focus:border-blue-800 focus:outline-none transition-all duration-300"
                    onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                  />
                  <button
                    onClick={addSubject}
                    className="bg-indigo text-white px-6 py-3 bg-blue-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-all duration-300 hover:scale-105"
                  >
                    Add
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {formData.subjects.map((subject, index) => (
                    <div
                      key={index}
                      className="bg-transparent text-black flex items-center gap-2 px-4 py-2 bg-blue-300/20 border border-blue-800/30 rounded-full text-gray-900 font-medium"
                    >
                      <span>{subject}</span>
                      <button
                        onClick={() => removeSubject(subject)}
                        className="bg-red-500 text-white text-red-500 hover:text-red-700 transition-colors duration-200"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6">
              <button
                onClick={handleSave}
                className="bg-green text-white px-8 py-4 bg-blue-800 text-white rounded-full font-semibold hover:bg-gray-900 transition-all duration-300 transform hover:scale-110 hover:shadow-xl hover:shadow-blue-800/40 flex items-center gap-3"
              >
                <Save size={20} />
                Save Changes
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-500 text-white px-8 py-4 border-2 border-red-500 text-red-500 rounded-full font-semibold hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/30 flex items-center gap-3"
              >
                <Trash2 size={20} />
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl max-w-md w-full p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="text-red-500" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Delete Account
                </h3>
                <p className="text-base text-gray-900/70 mb-8">
                  Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="bg-indigo-600 text-white flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

