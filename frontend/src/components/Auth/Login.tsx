import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onClose: () => void;
  onSwitchToSignup: () => void;
  onLogin: () => void;
}

export default function Login({ onClose, onSwitchToSignup, onLogin }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('https://backend-health-lens.vercel.app/auth/login', {
        email: email,
        password: password,
      });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Welcome Back</h2>
      {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center">
          <Label htmlFor="email" className="self-center mb-2">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="Enter your email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="max-w-xs w-full"
          />
        </div>
        <div className="flex flex-col items-center">
          <Label htmlFor="password" className="self-center mb-2">Password</Label>
          <div className="relative max-w-xs w-full">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <Button type="submit" className="w-full max-w-xs mx-auto block bg-indigo-600 hover:bg-indigo-700 text-white">
          Sign In
        </Button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignup}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Sign up
          </button>
        </p>
      </div>
      <div className="mt-2 text-center">
        <button onClick={onClose} className="text-sm text-indigo-600 hover:text-indigo-800">
          Cancel
        </button>
      </div>
    </motion.div>
  );
}