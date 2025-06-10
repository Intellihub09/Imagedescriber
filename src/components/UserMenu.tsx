import React, { useState } from 'react';
import { User, LogOut, History, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UserMenuProps {
  user: any;
  onViewHistory: () => void;
}

export default function UserMenu({ user, onViewHistory }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 rounded-2xl px-4 py-3 transition-all duration-300 group"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full blur-sm opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
          <User className="relative h-6 w-6 text-cyan-400" />
        </div>
        <span className="text-white font-medium hidden sm:block">
          {user.email?.split('@')[0]}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-700/30 py-2 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl"></div>
            
            {/* User Info */}
            <div className="relative px-4 py-3 border-b border-gray-700/30">
              <p className="text-white font-medium">{user.email}</p>
              <p className="text-gray-400 text-sm">Signed in</p>
            </div>

            {/* Menu Items */}
            <div className="relative py-2">
              <button
                onClick={() => {
                  onViewHistory();
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300"
              >
                <History className="h-5 w-5" />
                <span>View History</span>
              </button>
              
              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-900/20 transition-all duration-300"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}