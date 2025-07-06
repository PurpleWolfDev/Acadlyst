// import React, { useState } from 'react';
// import { 
//   Home, 
//   Settings, 
//   Users, 
//   Plus, 
//   MessageCircle, 
//   Bell, 
//   LogOut, 
//   Menu, 
//   X,
//   BookOpen,
//   TrendingUp,
//   Calendar,
//   User,
//   ChevronRight,
//   AlertCircle,
//   CheckCircle
// } from 'lucide-react';

// export function Chat() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [nav, updateNav] = useState(false);
//   const [showToast, setShowToast] = useState(false);
//   const [showAlert, setShowAlert] = useState(false);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [newMessage, setNewMessage] = useState('');
//   const [batchForm, setBatchForm] = useState({
//     name: '',
//     subject: '',
//     class: ''
//   });
//   const [notifications] = useState([
//     { id: 1, message: "New student joined Math Batch A", time: "2 mins ago", unread: true },
//     { id: 2, message: "Assignment submission from Sarah", time: "1 hour ago", unread: true },
//     { id: 3, message: "Class scheduled for tomorrow", time: "3 hours ago", unread: false }
//   ]);

//   const [contacts] = useState([
//     {
//       id: 1,
//       name: 'Sarah Johnson',
//       avatar: 'SJ',
//       lastMessage: 'Thank you for the assignment feedback!',
//       lastMessageTime: '2 mins ago',
//       unreadCount: 2,
//       isOnline: true,
//       type: 'student'
//     },
//     {
//       id: 2,
//       name: 'Math Batch A',
//       avatar: 'MB',
//       lastMessage: 'When is the next test?',
//       lastMessageTime: '5 mins ago',
//       unreadCount: 5,
//       isOnline: false,
//       type: 'group'
//     },
//     {
//       id: 3,
//       name: 'Alex Chen',
//       avatar: 'AC',
//       lastMessage: 'Can you explain the last topic again?',
//       lastMessageTime: '1 hour ago',
//       unreadCount: 0,
//       isOnline: true,
//       type: 'student'
//     },
//     {
//       id: 4,
//       name: 'Physics Grade 12',
//       avatar: 'PG',
//       lastMessage: 'Assignment submitted',
//       lastMessageTime: '2 hours ago',
//       unreadCount: 1,
//       isOnline: false,
//       type: 'group'
//     },
//     {
//       id: 5,
//       name: 'Emily Davis',
//       avatar: 'ED',
//       lastMessage: 'See you in tomorrow\'s class',
//       lastMessageTime: '3 hours ago',
//       unreadCount: 0,
//       isOnline: false,
//       type: 'student'
//     }
//   ]);

//   const [chatMessages] = useState({
//     1: [
//       { id: 1, senderId: 1, message: 'Hello teacher! I have a question about today\'s homework.', timestamp: '10:30 AM', isOwn: false },
//       { id: 2, senderId: 'me', message: 'Hi Sarah! What\'s your question?', timestamp: '10:32 AM', isOwn: true },
//       { id: 3, senderId: 1, message: 'I\'m having trouble with problem number 5 in the algebra section.', timestamp: '10:33 AM', isOwn: false },
//       { id: 4, senderId: 'me', message: 'Let me help you with that. Can you tell me which step you\'re stuck on?', timestamp: '10:35 AM', isOwn: true },
//       { id: 5, senderId: 1, message: 'Thank you for the assignment feedback!', timestamp: '10:40 AM', isOwn: false }
//     ],
//     2: [
//       { id: 1, senderId: 15, message: 'When is the next test?', timestamp: '9:00 AM', isOwn: false },
//       { id: 2, senderId: 'me', message: 'The test is scheduled for next Friday. I\'ll share the syllabus today.', timestamp: '9:05 AM', isOwn: true },
//       { id: 3, senderId: 12, message: 'Will it cover all chapters?', timestamp: '9:10 AM', isOwn: false },
//       { id: 4, senderId: 'me', message: 'Yes, it will cover chapters 1-5. Make sure to review the practice problems.', timestamp: '9:12 AM', isOwn: true }
//     ],
//     3: [
//       { id: 1, senderId: 3, message: 'Hi teacher!', timestamp: '8:00 AM', isOwn: false },
//       { id: 2, senderId: 'me', message: 'Hello Alex! How are you doing?', timestamp: '8:05 AM', isOwn: true },
//       { id: 3, senderId: 3, message: 'Can you explain the last topic again?', timestamp: '8:10 AM', isOwn: false }
//     ]
//   });

//   const menuItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: Home },
//     { id: 'batches', label: 'My Batches', icon: Users },
//     { id: 'add-batch', label: 'Add Batch', icon: Plus },
//     { id: 'chat', label: 'Chat', icon: MessageCircle },
//     { id: 'settings', label: 'Settings', icon: Settings },
//   ];

//   const batches = [
//     { id: 1, name: 'Mathematics Grade 10', students: 24, status: 'Active', nextClass: 'Today 4:00 PM' },
//     { id: 2, name: 'Physics Grade 12', students: 18, status: 'Active', nextClass: 'Tomorrow 2:00 PM' },
//     { id: 3, name: 'Chemistry Basics', students: 32, status: 'Active', nextClass: 'Today 6:00 PM' }
//   ];

//   const stats = [
//     { label: 'Total Students', value: '74', icon: Users, color: 'bg-blue-500' },
//     { label: 'Active Batches', value: '3', icon: BookOpen, color: 'bg-green-500' },
//     { label: 'Classes This Week', value: '12', icon: Calendar, color: 'bg-orange-500' }
//   ];

//   const Sidebar = () => (
//     <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r-2 border-blue-200 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
//       <div className="flex items-center justify-between h-16 px-6 border-b border-blue-200">
//         <div className="w-24 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold text-sm hover:bg-blue-800 transition-colors duration-300">
//           TeachOnline
//         </div>
//         <button 
//           onClick={() => setSidebarOpen(false)}
//           className="lg:hidden text-gray-600 hover:text-blue-800 transition-colors duration-300"
//         >
//           <X size={24} />
//         </button>
//       </div>
      
//       <nav className="mt-8 px-4">
//         {menuItems.map((item, index) => {
//           const Icon = item.icon;
//           return (
//             <button
//               key={item.id}
//               onClick={() => {
//                 if (item.id === 'chat') {
//                   setActiveTab('chat');
//                   setSidebarOpen(false);
//                 } else {
//                   setActiveTab(item.id);
//                   setSidebarOpen(false);
//                 }
//               }}
//               className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg text-left transition-all duration-300 hover:transform hover:scale-105 ${
//                 activeTab === item.id
//                   ? 'bg-blue-100 border border-blue-300 text-blue-800 shadow-md'
//                   : 'text-gray-700 hover:bg-blue-50 hover:text-blue-800'
//               }`}
//             >
//               <Icon size={20} className="mr-3" />
//               <span className="font-medium">{item.label}</span>
//             </button>
//           );
//         })}
//       </nav>

//       <div className="absolute bottom-6 left-4 right-4">
//         <button className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 hover:transform hover:scale-105">
//           <LogOut size={20} className="mr-3" />
//           <span className="font-medium">Logout</span>
//         </button>
//       </div>
//     </div>
//   );

//   const Header = () => (
//     <header className="bg-white border-b-2 border-blue-200 px-6 py-4">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center">
//           <button 
//             onClick={() => setSidebarOpen(true)}
//             className="lg:hidden mr-6 text-gray-600 hover:text-blue-800 transition-colors duration-300"
//           >
//             <Menu size={24} />
//           </button>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">
//               Welcome back, <span className="text-blue-800">Teacher</span>
//             </h1>
//             <p className="text-gray-600">Here's what's happening with your classes today</p>
//           </div>
//         </div>
        
//         <div className="flex items-center space-x-4">
//         </div>
//       </div>
//     </header>
//   );

//   const handleBatchSubmit = () => {
//     // Check if all fields are filled
//     if (!batchForm.name || !batchForm.subject || !batchForm.class) {
//       setShowAlert(true);
//       // Hide alert after 4 seconds
//       setTimeout(() => {
//         setShowAlert(false);
//       }, 4000);
//       return;
//     }

//     // If all fields are filled, create the batch
//     console.log('Batch created:', batchForm);
    
//     // Show success toast
//     setShowToast(true);
    
//     // Clear form
//     setBatchForm({
//       name: '',
//       subject: '',
//       class: ''
//     });
    
//     // Hide toast after 3 seconds
//     setTimeout(() => {
//       setShowToast(false);
//     }, 3000);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setBatchForm(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const sendMessage = () => {
//     if (newMessage.trim() && selectedChat) {
//       // In a real app, this would send the message to the server
//       console.log('Sending message:', newMessage, 'to chat:', selectedChat);
//       setNewMessage('');
//     }
//   };

//   const ChatInterface = () => {
//     if (!selectedChat) {
//       return (
//         <div className="flex-1 flex items-center justify-center bg-gray-50">
//           <div className="text-center">
//             <MessageCircle size={64} className="mx-auto text-gray-400 mb-4" />
//             <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a conversation</h3>
//             <p className="text-gray-500">Choose a student or batch to start messaging</p>
//           </div>
//         </div>
//       );
//     }

//     const contact = contacts.find(c => c.id === selectedChat);
//     const messages = chatMessages[selectedChat] || [];

//     return (
//       <div className="flex-1 flex flex-col">
//         {/* Chat Header */}
//         <div className="bg-white border-b border-gray-200 px-6 py-4">
//           <div className="flex items-center">
//             <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
//               {contact.avatar}
//             </div>
//             <div>
//               <h3 className="font-semibold text-gray-900">{contact.name}</h3>
//               <p className="text-sm text-gray-500">
//                 {contact.isOnline ? 'Online' : `Last seen ${contact.lastMessageTime}`}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto p-6 space-y-4">
//           {messages.map((message) => (
//             <div
//               key={message.id}
//               className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
//             >
//               <div
//                 className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
//                   message.isOwn
//                     ? 'bg-blue-500 text-white'
//                     : 'bg-gray-200 text-gray-900'
//                 }`}
//               >
//                 <p>{message.message}</p>
//                 <p className={`text-xs mt-1 ${message.isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
//                   {message.timestamp}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Message Input */}
//         <div className="bg-white border-t border-gray-200 px-6 py-4">
//           <div className="flex items-center space-x-4">
//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               placeholder="Type a message..."
//               className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//               onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
//             />
//             <button
//               onClick={sendMessage}
//               className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
//             >
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const ChatContent = () => {
//     <div className="bg-white border-2 border-blue-200 rounded-3xl shadow-lg overflow-hidden" style={{height: '600px'}}>
//       <div className="flex h-full">
//         {/* Contacts Sidebar */}
//         <div className="w-80 border-r border-gray-200 flex flex-col">
//           <div className="p-4 border-b border-gray-200">
//             <h2 className="text-xl font-bold text-gray-900">Messages</h2>
//           </div>
          
//           <div className="flex-1 overflow-y-auto">
//             {contacts.map((contact) => (
//               <div
//                 key={contact.id}
//                 onClick={() => setSelectedChat(contact.id)}
//                 className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
//                   selectedChat === contact.id ? 'bg-blue-50 border-blue-200' : ''
//                 }`}
//               >
//                 <div className="flex items-center">
//                   <div className="relative">
//                     <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
//                       {contact.avatar}
//                     </div>
//                     {contact.isOnline && (
//                       <div className="absolute bottom-0 right-2 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
//                     )}
//                   </div>
                  
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center justify-between">
//                       <h3 className="font-semibold text-gray-900 truncate">{contact.name}</h3>
//                       <span className="text-xs text-gray-500">{contact.lastMessageTime}</span>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <p className="text-sm text-gray-600 truncate">{contact.lastMessage}</p>
//                       {contact.unreadCount > 0 && (
//                         <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2">
//                           {contact.unreadCount}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Chat Interface */}
//         <ChatInterface />
//       </div>
//     </div>
//   };
//     <div className="space-y-8">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {stats.map((stat, index) => {
//           const Icon = stat.icon;
//           return (
//             <div key={index} className="bg-white border-2 border-blue-200 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:transform hover:scale-105 transition-all duration-300">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
//                   <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
//                 </div>
//                 <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
//                   <Icon size={24} className="text-white" />
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <div className="bg-white border-2 border-blue-200 rounded-3xl p-8 shadow-lg">
//         <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Batches</h2>
//         <div className="grid gap-4">
//           {batches.map((batch) => (
//             <div 
//               key={batch.id} 
//               className="bg-gray-50 border border-gray-200 rounded-2xl p-4 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-md cursor-pointer group"
//               onClick={() => console.log('Batch clicked:', batch.name)}
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex-1">
//                   <h3 className="font-semibold text-gray-900 group-hover:text-blue-800 transition-colors duration-300">{batch.name}</h3>
//                   <p className="text-gray-600 text-sm">{batch.students} students enrolled</p>
//                 </div>
//                 <div className="flex items-center space-x-4">
//                   <div className="text-right">
//                     <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
//                       {batch.status}
//                     </span>
//                     <p className="text-sm text-gray-600 mt-1">Next: {batch.nextClass}</p>
//                   </div>
//                   <ChevronRight 
//                     size={20} 
//                     className="text-gray-400 group-hover:text-blue-800 group-hover:transform group-hover:translate-x-1 transition-all duration-300" 
//                   />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   };

//   const renderContent = () => {
//     switch(activeTab) {
//       case 'dashboard':
//         return <DashboardContent />;
//       case 'batches':
//         return (
//           <div className="bg-white border-2 border-blue-200 rounded-3xl p-8 shadow-lg">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">My Batches</h2>
//             <p className="text-gray-600">Manage your teaching batches here...</p>
//           </div>
//         );
//       case 'add-batch':
//         return (
//           <div className="bg-white border-2 border-blue-200 rounded-3xl p-8 shadow-lg max-w-2xl mx-auto">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Batch</h2>
//             <div className="space-y-6">
//               <div>
//                 <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
//                   Batch Name
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={batchForm.name}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white"
//                   placeholder="Enter batch name (e.g., Mathematics Advanced)"
//                 />
//               </div>
              
//               <div>
//                 <label htmlFor="subject" className="block text-sm font-medium text-gray-900 mb-2">
//                   Subject
//                 </label>
//                 <select
//                   id="subject"
//                   name="subject"
//                   value={batchForm.subject}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white"
//                 >
//                   <option value="">Select Subject</option>
//                   <option value="Mathematics">Mathematics</option>
//                   <option value="Physics">Physics</option>
//                   <option value="Chemistry">Chemistry</option>
//                   <option value="Biology">Biology</option>
//                   <option value="English">English</option>
//                   <option value="History">History</option>
//                   <option value="Geography">Geography</option>
//                   <option value="Computer Science">Computer Science</option>
//                   <option value="Hindi">Hindi</option>
//                   <option value="Sanskrit">Sanskrit</option>
//                   <option value="Social Science">Social Science</option>
//                 </select>
//               </div>
              
//               <div>
//                 <label htmlFor="class" className="block text-sm font-medium text-gray-900 mb-2">
//                   Class/Grade
//                 </label>
//                 <select
//                   id="class"
//                   name="class"
//                   value={batchForm.class}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white"
//                 >
//                   <option value="">Select Class</option>
//                   <option value="4">Class 4</option>
//                   <option value="5">Class 5</option>
//                   <option value="6">Class 6</option>
//                   <option value="7">Class 7</option>
//                   <option value="8">Class 8</option>
//                   <option value="9">Class 9</option>
//                   <option value="10">Class 10</option>
//                   <option value="11">Class 11</option>
//                   <option value="12">Class 12</option>
//                 </select>
//               </div>
              
//               <button
//                 type="button"
//                 onClick={handleBatchSubmit}
//                 className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-blue-900 transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//               >
//                 Create Batch
//               </button>
//             </div>
//           </div>
//         );
//       case 'chat':
//         return <ChatContent />;
//       case 'settings':
//         return (
//           <div className="bg-white border-2 border-blue-200 rounded-3xl p-8 shadow-lg">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
//             <p className="text-gray-600">Manage your account settings...</p>
//           </div>
//         );
//       default:
//         return <DashboardContent />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-blue-200">
//       {/* Success Toast Notification */}
//       {showToast && (
//         <div className="fixed bottom-6 right-6 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-500 border-l-4 border-green-400">
//           <div className="flex items-center">
//             <CheckCircle size={20} className="mr-3 flex-shrink-0" />
//             <div>
//               <p className="font-semibold">Success!</p>
//               <p className="text-sm text-green-100">Batch created successfully!</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Error Alert Notification */}
//       {showAlert && (
//         <div className="fixed top-6 right-6 z-50 bg-red-500 text-white px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-500 border-l-4 border-red-400">
//           <div className="flex items-center">
//             <AlertCircle size={20} className="mr-3 flex-shrink-0" />
//             <div>
//               <p className="font-semibold">Missing Information!</p>
//               <p className="text-sm text-red-100">Please fill in all required fields before creating a batch.</p>
//             </div>
//           </div>
//         </div>
//       )}

//       <Sidebar />
      
//       {sidebarOpen && (
//         <div 
//           className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden" 
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       <div className="lg:ml-64">
//         <Header />
//         <main className="p-6">
//           {renderContent()}
//         </main>
//       </div>
//     </div>
//   );
