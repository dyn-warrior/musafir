
import React from 'react';

interface LoginProps {
  onLogin: () => void;
}

const LoginView: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-[#f1f0e8] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex max-w-5xl w-full h-[600px]">
        {/* Left Side - Form */}
        <div className="flex-1 p-12 flex flex-col justify-center space-y-8">
           <div className="space-y-2">
             <h1 className="serif text-5xl font-bold text-gray-800">Welcome Back,<br/>Traveler.</h1>
             <p className="text-gray-500 text-sm">Sign in to continue your journey of discovery.</p>
           </div>

           <div className="space-y-4">
             <div className="space-y-1">
               <input 
                type="text" 
                placeholder="Email or Username" 
                className="w-full border border-gray-200 rounded-xl px-4 py-4 text-sm focus:ring-1 focus:ring-[#c58f7a] focus:outline-none"
              />
             </div>
             <div className="space-y-1 relative">
               <input 
                type="password" 
                placeholder="Password" 
                className="w-full border border-gray-200 rounded-xl px-4 py-4 text-sm focus:ring-1 focus:ring-[#c58f7a] focus:outline-none"
              />
               <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-medium">Forgot Password?</button>
             </div>
           </div>

           <button 
             onClick={onLogin}
             className="w-full bg-[#c58f7a] text-white py-4 rounded-xl font-bold shadow-md hover:bg-[#b07b68] transition"
           >
             Login
           </button>

           <div className="flex items-center gap-4 text-[10px] text-gray-300 font-bold uppercase tracking-widest">
             <div className="flex-grow h-px bg-gray-100"></div>
             OR
             <div className="flex-grow h-px bg-gray-100"></div>
           </div>

           <div className="space-y-3">
             <button className="w-full border border-gray-200 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition">
               <span className="w-4 h-4 bg-red-100 rounded-full"></span> Continue with Google
             </button>
             <button className="w-full border border-gray-200 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition">
               <span className="w-4 h-4 bg-blue-100 rounded-full"></span> Continue with Facebook
             </button>
           </div>

           <p className="text-center text-xs text-gray-400">
             Don't have an account? <span className="text-[#c58f7a] font-bold cursor-pointer">Sign Up</span>
           </p>
        </div>

        {/* Right Side - Image Overlay */}
        <div className="hidden lg:block flex-1 relative">
           <img src="https://picsum.photos/id/1048/800/1000" className="w-full h-full object-cover" alt="" />
           <div className="absolute inset-0 bg-black/10"></div>
           <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-24 h-48 bg-[#f1f0e8]/80 backdrop-blur-sm rounded-l-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
