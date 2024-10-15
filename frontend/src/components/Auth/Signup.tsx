import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate


interface SignupProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function Signup({ onClose, onSwitchToLogin }: SignupProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    height: '',
    weight: '',
    sex: '',
  });

  const navigate = useNavigate(); // Initialize useNavigate
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://backend-health-lens.vercel.app/auth/signup', {
        name: formData.name,
        last_name: formData.lastName,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        height: parseFloat(formData.height) || null,
        weight: parseFloat(formData.weight) || null,
        sex: formData.sex,
      });      
      // Save the token in localStorage
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard'); 
    } catch (error) {
      // show error message
      console.error('Signup error:', error);
      // Handle error (e.g., show an error message)
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" type="text" value={formData.name} onChange={handleInputChange} placeholder="Enter your full name" required />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" type="text" value={formData.lastName} onChange={handleInputChange} placeholder="Enter your last name" required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Enter your email" required />
        </div>
        <div>
          <Label htmlFor="username">Username</Label>
          <Input id="username" type="text" value={formData.username} onChange={handleInputChange} placeholder="Enter a username" required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a password"
              required
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
        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
          Sign Up
        </Button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Log in
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
