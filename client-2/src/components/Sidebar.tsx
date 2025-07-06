import React from 'react';
import { 
  Home, 
  Calendar, 
  FileText, 
  Upload, 
  Users, 
  Settings, 
  Bell,
  Menu,
  X,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen: boolean;
  toggleMobile: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isMobileOpen, 
  toggleMobile 
}) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'schedule', icon: Calendar, label: 'Schedule Class' },
    { id: 'notices', icon: Bell, label: 'Notices' },
    { id: 'assignments', icon: Upload, label: 'Assignments' },
    { id: 'students', icon: Users, label: 'Manage Students' },
    { id: 'settings', icon: Settings, label: 'Batch Settings' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white/80 backdrop-blur-lg rounded-lg shadow-lg border border-blue-800/20"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white/70 backdrop-blur-lg border-r-2 border-blue-800/20 
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="p-6 border-b border-blue-800/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-800 to-purple-800 rounded-lg flex items-center justify-center">
                <BookOpen className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-800 via-purple-800 to-blue-800 bg-clip-text text-transparent">
                  Acadlyst
                </h1>
                <p className="text-sm text-gray-900/60">Batch Manager</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth < 1024) toggleMobile();
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300
                    ${isActive 
                      ? 'bg-blue-300/20 border-blue-800/30 shadow-lg shadow-blue-800/20 text-blue-800' 
                      : 'hover:bg-blue-800/10 hover:text-blue-800 text-gray-900/70'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-blue-800/20">
            <div className="bg-gradient-to-r from-blue-300 to-green-100 rounded-xl p-4 text-center">
              <p onClick={() => {
                navigator.clipboard.writeText(localStorage.getItem("inviteLink") || "")
    .then(() => {
      alert("Copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy:", err);
    });
              }}  className="text-sm font-medium text-gray-900">
                Invitation Link
              </p>
              <p onClick={() => {
                navigator.clipboard.writeText(`https://acadlyst.netlify.app/batchJoin?inviteId=${localStorage.getItem("inviteLink")}&id=${localStorage.getItem("sId")}`)
    .then(() => {
      alert("Copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy:", err);
    });
              }}  className="text-xs text-gray-900/60 mt-1 overflow-hidden">
                Tap to Copy : {`https://acadlyst.netlify.app/batchJoin?inviteId=${localStorage.getItem("inviteLink")}&id=${localStorage.getItem("sId")}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleMobile}
        />
      )}
    </>
  );
};

export default Sidebar;