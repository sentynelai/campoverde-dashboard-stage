import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '0000') {
      onLogin();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 bg-dark-950">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #00FF9C 1px, transparent 0)`,
          backgroundSize: '40px 40px',
          filter: 'blur(2px)'
        }} />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950 to-transparent" />
      </div>

      {/* Login form */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-dark-950/50 backdrop-blur-xl rounded-2xl border border-dark-800/50 p-8">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-16 h-16 bg-[#00FF9C]/10 rounded-xl flex items-center justify-center">
                  <Lock className="w-8 h-8 text-[#00FF9C]" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-[#00FF9C] rounded-full"
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center mb-2">Welcome Back</h2>
            <p className="text-dark-400 text-center mb-8">Enter your password to access the dashboard</p>

            <form onSubmit={handleSubmit}>
              <motion.div
                animate={{ x: shake ? [-10, 10, -10, 10, 0] : 0 }}
                transition={{ duration: 0.4 }}
              >
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  placeholder="Enter password"
                  className={`w-full bg-dark-800/50 border ${
                    error ? 'border-red-500' : 'border-dark-700'
                  } rounded-lg px-4 py-3 focus:outline-none focus:border-[#00FF9C] transition-colors`}
                />
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 mt-3 text-red-400 text-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>Invalid password. Please try again.</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                className="w-full mt-6 bg-[#00FF9C] text-dark-950 rounded-lg px-4 py-3 font-medium hover:bg-[#00FF9C]/90 transition-colors"
              >
                Login
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};