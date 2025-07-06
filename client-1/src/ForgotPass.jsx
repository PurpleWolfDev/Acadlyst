import React, { useState, useEffect } from 'react';
import { data, Navigate } from 'react-router-dom';

export function ForgotPassword() {
    const [nav, updateNav] = useState(false);
    const [nav2, updateNav2] = useState(false);
    const [phone, updatePhone] = useState(null);
    const [tempToken, updateTemp] = useState(0);
  const [step, setStep] = useState('request'); // 'request', 'verify', 'reset'
  const [formData, setFormData] = useState({
    mobile: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

useEffect(() => {
    try {
      let a = localStorage.getItem("userData");
      if(a.length>5) {
        updateNav2(true);
      }
    } catch(err) {
      console.log(err)
    }
  }, []);

  const handleRequestOTP = () => {
    if (!formData.mobile) {
      alert('Please enter your mobile number');
      return;
    }
    setIsLoading(true);
    
    fetch('https://onlinecoachinglogin.onrender.com/forgotPassOtp?phone='+formData.mobile)
    .then(res => res.json())
    .then(dat => {
      if(dat.status==200) {
        updatePhone(formData.mobile);
        setIsLoading(false);
        setStep('verify');
        setTimer(30);
        // Start countdown
        const countdown = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(countdown);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
      else {
        alert("No User Exists!");
      }
    });
  };

  const handleVerifyOTP = () => {
    if (!formData.otp || formData.otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }
    fetch(`https://onlinecoachinglogin.onrender.com/verifyOtp?phone=${phone}&otp=${formData.otp}`)
    .then(res => res.json())
    .then(dat => {
      if(dat.status==200) {
        updateTemp(dat.token)
      setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
          setIsLoading(false);
          setStep('reset');
        }, 1500);
      }
      else if(dat.status==400){
        alert("Wrong OTP");
      }
      else {
        alert("Some internal error occured!");
      }
    })
    
        
  };

  const handleResetPassword = () => {
    if (!formData.newPassword || !formData.confirmPassword) {
      alert('Please fill in both password fields');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (formData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    fetch(`https://onlinecoachinglogin.onrender.com/resetPass?pass=${formData.newPassword}&token=${tempToken}&phone=${phone}`)
    .then(res => res.json())
    .then(dat => {
      if(dat.status==200) {
    setIsLoading(true);
    // Simulate API call
      setIsLoading(false);
      alert('Password reset successful! You can now login with your new password.');
      // In real app, redirect to login page
      setStep('request');
      setFormData({ mobile: '', otp: '', newPassword: '', confirmPassword: '' });
      }
      else if(dat.status==400) {
        alert("Some Error Occured!")
      }
      else {
        alert("Some Error Occured!")

      }
    });
    
  };

  const resendOTP = () => {
    if (timer > 0) return;
    setTimer(30);
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    // Simulate resend API call
    handleRequestOTP()
    console.log('OTP resent to:', formData.mobile);
  };

  const goBack = () => {
    if (step === 'verify') {
      setStep('request');
    } else if (step === 'reset') {
      setStep('verify');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-green-100 to-blue-800 text-gray-900 font-sans flex items-center justify-center px-6 py-12">
      {/* Background decorative elements */}
            {nav?<Navigate to="/login" />:null}
            {nav2?<Navigate to="/dashboard" />:null}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-300 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-800 rounded-full opacity-15 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-green-400 rounded-full opacity-10 animate-pulse"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">
            {step === 'request' && 'Forgot Password'}
            {step === 'verify' && 'Verify OTP'}
            {step === 'reset' && 'Reset Password'}
          </h1>
          <p className="text-gray-900/70 font-medium">
            {step === 'request' && 'Enter your mobile number to receive OTP'}
            {step === 'verify' && 'Enter the 6-digit code sent to your mobile'}
            {step === 'reset' && 'Create your new password'}
          </p>
        </div>

        {/* Main Form Container */}
        <div className="bg-white/80 backdrop-blur-lg border-2 border-blue-800/20 rounded-3xl p-8 shadow-xl shadow-blue-800/10">
          
          {/* Step 1: Request OTP */}
          {step === 'request' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your registered mobile number"
                  maxLength="10"
                />
              </div>

              <button
                onClick={handleRequestOTP}
                disabled={isLoading}
                className="w-full py-4 bg-blue-800 text-white rounded-xl font-semibold text-lg hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-800/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </div>
          )}

          {/* Step 2: Verify OTP */}
          {step === 'verify' && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">
                  OTP sent to +91 {formData.mobile}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300 text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength="6"
                />
              </div>

              <div className="text-center">
                <button
                  onClick={resendOTP}
                  disabled={timer > 0}
                  className="bg-white text-black hover:text-purple-800 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                </button>
              </div>

              <button
                onClick={handleVerifyOTP}
                disabled={isLoading}
                className="w-full py-4 bg-blue-800 text-white rounded-xl font-semibold text-lg hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-800/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
          )}

          {/* Step 3: Reset Password */}
          {step === 'reset' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300 pr-12"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-800 transition-colors focus:outline-none"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300 pr-12"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-800 transition-colors focus:outline-none"
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-600 bg-blue-50/50 p-3 rounded-xl">
                <p className="font-medium mb-1">Password Requirements:</p>
                <ul className="text-xs space-y-1">
                  <li>• At least 6 characters long</li>
                  <li>• Should contain letters and numbers</li>
                  <li>• Avoid common passwords</li>
                </ul>
              </div>

              <button
                onClick={handleResetPassword}
                disabled={isLoading}
                className="w-full py-4 bg-blue-800 text-white rounded-xl font-semibold text-lg hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-800/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </div>
          )}

          {/* Back Button and Login Link */}
          <div className="mt-8 pt-6 border-t border-gray-300">
            {step !== 'request' && (
              <div className="text-center mb-4">
                <button 
                  onClick={goBack}
                  className="bg-white text-black hover:text-purple-800 font-semibold transition-colors"
                >
                  ← Go Back
                </button>
              </div>
            )}
            
            <div className="text-center">
              <p className="text-gray-900/70">
                Remember your password?{' '}
                <button onClick={() => {updateNav(true)}} className="bg-white text-black hover:text-purple-800 font-semibold transition-colors">
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-blue-800/10">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🔒</span>
            <p className="text-xs text-gray-900/70 font-medium">
              Your security is important to us. The OTP will expire in 10 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}