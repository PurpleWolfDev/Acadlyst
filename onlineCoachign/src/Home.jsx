import logo from './assets/ChatGPT Image Jun 20, 2025, 03_40_58 PM (1).png';
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [nav, updateSign] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: "Interactive Virtual Classrooms",
      description: "Seamlessly conduct live sessions with advanced whiteboard tools",
      icon: "🎯",
      mockupContent: {
        header: "Live Classroom Session",
        stats: [
          { label: "Students Online", value: "24", color: "bg-blue-500" },
          { label: "Engagement Rate", value: "96%", color: "bg-green-500" },
          { label: "Session Time", value: "45m", color: "bg-purple-500" },
          { label: "Questions Asked", value: "12", color: "bg-orange-500" }
        ],
        tools: ["Whiteboard", "Screen Share", "Breakout Rooms", "Polls", "Chat", "Recording"]
      }
    },
    {
      title: "Student Progress Tracking", 
      description: "Monitor performance with detailed analytics and insights",
      icon: "📊",
      mockupContent: {
        header: "Student Analytics Dashboard",
        stats: [
          { label: "Avg. Score", value: "87%", color: "bg-green-500" },
          { label: "Completion", value: "92%", color: "bg-blue-500" },
          { label: "Attendance", value: "94%", color: "bg-purple-500" },
          { label: "Improvement", value: "+15%", color: "bg-orange-500" }
        ],
        tools: ["Performance Reports", "Grade Analytics", "Attendance Tracking", "Progress Charts", "Parent Updates", "Assessments"]
      }
    },
    {
      title: "Flexible Scheduling System",
      description: "Manage appointments and sessions with intelligent calendar sync",
      icon: "⏰",
      mockupContent: {
        header: "Smart Scheduling Hub",
        stats: [
          { label: "Sessions Today", value: "8", color: "bg-blue-500" },
          { label: "This Week", value: "42", color: "bg-green-500" },
          { label: "Availability", value: "85%", color: "bg-purple-500" },
          { label: "Bookings", value: "156", color: "bg-orange-500" }
        ],
        tools: ["Calendar Sync", "Auto Booking", "Time Zones", "Reminders", "Rescheduling", "Waitlists"]
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-green-100 to-blue-800 text-gray-900 overflow-hidden font-sans">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-green-100/90 backdrop-blur-lg border-b border-blue-800/20 shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
               <img src={logo} className="w-24 h-18 bg-[#231F20] rounded-lg flex items-center justify-center text-white font-bold text-xl" />
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="hover:text-blue-800 transition-all duration-300 cursor-pointer hover:scale-105 px-2 py-1 rounded-lg hover:bg-blue-800/10 text-gray-900 font-medium">Features</a>
              <a href="#how-it-works" className="hover:text-blue-800 transition-all duration-300 cursor-pointer hover:scale-105 px-2 py-1 rounded-lg hover:bg-blue-800/10 text-gray-900 font-medium">How It Works</a>
              <a href="#pricing" className="hover:text-blue-800 transition-all duration-300 cursor-pointer hover:scale-105 px-2 py-1 rounded-lg hover:bg-blue-800/10 text-gray-900 font-medium">Pricing</a>
            </div>
            <div className="flex space-x-4">
              <button onClick={() => {updateSign(true)}} className="px-4 py-2 border-2 border-blue-800 text-blue-800 bg-transparent hover:bg-blue-800 hover:text-white transition-all duration-300 hover:scale-105 rounded-lg font-medium">
                Sign In
              </button>
              <button onClick={() => {updateSign(true)}} className="px-6 py-2 bg-blue-800 text-white rounded-full hover:bg-gray-900 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-blue-800/30 font-semibold">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-gray-900">
                  Transform Your
                  <span className="bg-gradient-to-r from-blue-800 via-purple-800 to-blue-800 bg-clip-text text-transparent block">
                    Teaching Journey
                  </span>
                </h1>
                <p className="text-xl text-gray-900/80 leading-relaxed font-medium">
                  Seamlessly transition from offline to online coaching with our comprehensive platform designed specifically for educators.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => {updateSign(true)}} className="px-8 py-4 bg-blue-800 text-white rounded-full text-lg font-semibold hover:bg-gray-900 transition-all duration-300 transform hover:scale-110 hover:shadow-xl hover:shadow-blue-800/40">
                  Start Free Trial
                </button>
                <button onClick={() => {updateSign(true)}} className="px-8 py-4 border-2 border-blue-800 text-blue-800 rounded-full text-lg font-semibold bg-transparent hover:bg-blue-800 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-800/30">
                  Watch Demo
                </button>
              </div>

              <div className="flex items-center space-x-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-800">10k+</div>
                  <div className="text-gray-900/70 font-medium">Teachers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-800">500k+</div>
                  <div className="text-gray-900/70 font-medium">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-800">98%</div>
                  <div className="text-gray-900/70 font-medium">Success Rate</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-white/70 backdrop-blur-lg border-2 border-blue-800/20 rounded-3xl p-8 shadow-xl shadow-blue-800/10">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-300 rounded-full flex items-center justify-center">
                      <span className="text-2xl">👩‍🏫</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Sarah Johnson</div>
                      <div className="text-gray-900/60">Mathematics Teacher</div>
                    </div>
                  </div>
                  <div className="bg-green-100/80 rounded-2xl p-6 border border-blue-800/10">
                    <div className="text-sm text-gray-900/80 mb-4 font-medium">Live Session in Progress</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-800/10 rounded-lg p-3 text-center border border-blue-800/20">
                        <div className="text-xs text-gray-900/60 font-medium">Students Online</div>
                        <div className="text-2xl font-bold text-blue-800">24</div>
                      </div>
                      <div className="bg-purple-800/10 rounded-lg p-3 text-center border border-purple-800/20">
                        <div className="text-xs text-gray-900/60 font-medium">Engagement</div>
                        <div className="text-2xl font-bold text-purple-800">96%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-300 rounded-full opacity-30 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-800 rounded-full opacity-20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
              Everything You Need to
              <span className="bg-gradient-to-r from-blue-800 to-purple-800 bg-clip-text text-transparent"> Succeed Online</span>
            </h2>
            <p className="text-xl text-gray-900/80 max-w-3xl mx-auto font-medium">
              Powerful tools designed to make your transition from offline to online coaching effortless and effective.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl border transition-all duration-500 cursor-pointer transform hover:scale-105 hover:shadow-xl hover:shadow-blue-800/20 ${
                    activeFeature === index
                      ? 'bg-blue-300/20 border-blue-800/30 scale-105 shadow-lg shadow-blue-800/20'
                      : 'bg-white/50 border-gray-900/10 hover:border-blue-800/30 hover:bg-blue-300/10'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">{feature.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                      <p className="text-gray-900/70">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-white/80 to-green-100/80 backdrop-blur-lg rounded-3xl p-8 border-2 border-blue-800/20 shadow-xl shadow-blue-800/10">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900">{features[activeFeature].mockupContent.header}</h3>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="bg-green-100/60 rounded-2xl p-6 border border-blue-800/10">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {features[activeFeature].mockupContent.stats.map((stat, idx) => (
                        <div key={idx} className="bg-white/70 rounded-lg p-4 text-center border border-gray-200">
                          <div className="text-xs text-gray-600 font-medium mb-1">{stat.label}</div>
                          <div className={`text-2xl font-bold text-gray-900`}>{stat.value}</div>
                          <div className={`h-2 ${stat.color} rounded-full mt-2 opacity-20`}></div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-gray-700 mb-3">Available Tools:</div>
                      <div className="grid grid-cols-2 gap-2">
                        {features[activeFeature].mockupContent.tools.map((tool, idx) => (
                          <div key={idx} className="bg-white/50 rounded-lg px-3 py-2 text-sm text-gray-700 border border-gray-200">
                            {tool}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
              Get Started in
              <span className="bg-gradient-to-r from-blue-800 to-purple-800 bg-clip-text text-transparent"> 3 Simple Steps</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create Your Profile", desc: "Set up your teaching profile with subjects, experience, and availability", icon: "👤" },
              { step: "02", title: "Design Your Courses", desc: "Upload content, create interactive lessons, and set your pricing", icon: "📚" },
              { step: "03", title: "Start Teaching", desc: "Launch your online coaching and connect with students worldwide", icon: "🚀" }
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="bg-white/70 backdrop-blur-lg border-2 border-blue-300/30 rounded-3xl p-8 text-center hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-blue-800/20 hover:border-blue-800/40">
                  <div className="text-6xl mb-6">{item.icon}</div>
                  <div className="text-blue-800 text-xl font-bold mb-4">{item.step}</div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{item.title}</h3>
                  <p className="text-gray-900/70">{item.desc}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="w-8 h-8 text-blue-800 text-2xl font-bold">→</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
              Start Your Journey
              <span className="bg-gradient-to-r from-blue-800 to-purple-800 bg-clip-text text-transparent"> Completely Free</span>
            </h2>
            <p className="text-xl text-gray-900/80 max-w-3xl mx-auto font-medium">
              No hidden costs, no premium features locked away. Everything you need to transform your teaching career is free forever.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="relative rounded-3xl p-8 bg-white/80 backdrop-blur-lg border-2 border-blue-800 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-800/30">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-semibold">
                  Everything Included
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-3xl font-bold mb-4 text-gray-900">Complete Platform</h3>
                <div className="mb-6">
                  <span className="text-6xl font-bold bg-gradient-to-r from-blue-800 to-purple-800 bg-clip-text text-transparent">FREE</span>
                  <div className="text-gray-900/60 mt-2 font-medium">Forever & Always</div>
                </div>
                
                <ul className="space-y-4 mb-8 text-left">
                  {[
                    "Unlimited students & courses",
                    "Interactive virtual classrooms", 
                    "Advanced analytics & insights",
                    "Flexible scheduling system",
                    "Student progress tracking",
                    "Mobile app access",
                    "24/7 email support",
                    "Custom branding options",
                    "Payment processing",
                    "Marketing tools & resources"
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="text-blue-300 mr-3 text-xl">✓</span>
                      <span className="text-gray-900/80">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button onClick={() => {updateSign(true)}} className="w-full py-4 bg-blue-800 hover:bg-gray-900 text-white rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-800/40">
                  Get Started Now - It's Free!
                </button>
                
                <p className="text-sm text-gray-900/60 mt-4">
                  No credit card required • Setup in under 5 minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
            Ready to Transform Your
            <span className="bg-gradient-to-r from-blue-800 to-purple-800 bg-clip-text text-transparent"> Teaching Career?</span>
          </h2>
          <p className="text-xl text-gray-900/80 mb-8 font-medium">
            Join thousands of teachers who have successfully transitioned to online coaching
          </p>
          <button onClick={() => {updateSign(true)}} className="px-12 py-4 bg-blue-800 text-white rounded-full text-xl font-semibold hover:bg-gray-900 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:shadow-blue-800/40">
            Start Your Journey Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-900/20 bg-white/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
               <img src={logo} className="w-24 h-18 bg-[#231F20] rounded-lg flex items-center justify-center text-white font-bold text-xl" />
              <p className="text-gray-900/70">
                Empowering teachers to build successful online coaching businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Platform</h4>
              <ul className="space-y-2 text-gray-900/70">
                <li><a href="#" className="hover:text-blue-800 transition-all duration-300 hover:scale-105 inline-block hover:translate-x-1">Features</a></li>
                <li><a href="#" className="hover:text-blue-800 transition-all duration-300 hover:scale-105 inline-block hover:translate-x-1">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-800 transition-all duration-300 hover:scale-105 inline-block hover:translate-x-1">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Support</h4>
              <ul className="space-y-2 text-gray-900/70">
                <li><a href="#" className="hover:text-blue-800 transition-all duration-300 hover:scale-105 inline-block hover:translate-x-1">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-800 transition-all duration-300 hover:scale-105 inline-block hover:translate-x-1">Contact</a></li>
                <li><a href="#" className="hover:text-blue-800 transition-all duration-300 hover:scale-105 inline-block hover:translate-x-1">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Company</h4>
              <ul className="space-y-2 text-gray-900/70">
                <li><a href="#" className="hover:text-blue-800 transition-all duration-300 hover:scale-105 inline-block hover:translate-x-1">About</a></li>
                <li><a href="#" className="hover:text-blue-800 transition-all duration-300 hover:scale-105 inline-block hover:translate-x-1">Blog</a></li>
                <li><a href="#" className="hover:text-blue-800 transition-all duration-300 hover:scale-105 inline-block hover:translate-x-1">Careers</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-900/20 mt-8 pt-8 text-center text-gray-900/60">
            <p>&copy; 2025 TeachOnline. All rights reserved.</p>
          </div>
        </div>
      </footer>
      {nav?<Navigate to="/login" />:null}
    </div>
  );
}