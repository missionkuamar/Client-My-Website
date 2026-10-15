import React from 'react';
import { Bell, Search } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="bg-white border-b border-slate-100 h-16 flex items-center justify-between px-6 z-10 shadow-sm">
      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 w-96">
        <Search size={18} className="text-slate-400" />
        <input 
          type="text" 
          placeholder="Search projects, blogs, or analytics..." 
          className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder-slate-400"
        />
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full"></span>
        </button>

        {/* Profile Info */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center text-white font-bold justify-center shadow-md shadow-indigo-500/20">
            N
          </div>
          <div className="hidden md:block text-left">
            <h4 className="text-sm font-bold text-slate-800">Nishant Kumar</h4>
            <p className="text-xs text-slate-400">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};

// Yeh default export hona zaroori hai
export default Navbar;