import { X } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (name: string, email: string) => void;
}

export function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login submitted:', loginData);
    // Handle login logic here
    // Mock login - in real app, verify credentials with backend
    onLoginSuccess('John Doe', loginData.email);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register submitted:', registerData);
    // Handle registration logic here
    // Mock registration - in real app, create account and login
    onLoginSuccess(registerData.name, registerData.email);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4" 
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(200, 200, 200, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(200, 200, 200, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '30px 30px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)'
      }}
      onClick={onClose}
    >
      <div className="bg-white rounded-lg sm:rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden grid md:grid-cols-2" onClick={(e) => e.stopPropagation()}>
        {/* Left Side - Image */}
        <div className="hidden md:block relative bg-gradient-to-br from-blue-600 to-blue-800">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1758685734470-a75109299497?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwbWF0aGVtYXRpY3MlMjBlZHVjYXRpb24lMjBsYWJvcmF0b3J5fGVufDF8fHx8MTc3MDU1NTczMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Science and Mathematics"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <h3 className="text-3xl font-bold mb-2">Welcome to Varsity Maths</h3>
            <p className="text-blue-100">Learn Smart. Learn Deep. Build Your Future 🚀</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="relative bg-white overflow-y-auto max-h-[95vh] sm:max-h-[90vh]">
          {/* Mobile Header with Logo */}
          <div className="md:hidden bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-center">
            <h3 className="text-xl font-bold text-white mb-1">Varsity Maths<sup className="text-xs">™</sup></h3>
            <p className="text-xs text-blue-100">Learn Smart. Build Your Future 🚀</p>
          </div>

          {/* Header */}
          <div className="relative border-b border-gray-200 p-4 sm:p-6">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors p-2"
              aria-label="Close"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center pr-8">
              Get Started
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3 sm:py-3.5 text-center font-semibold transition-colors text-sm sm:text-base ${
                activeTab === 'login'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-3 sm:py-3.5 text-center font-semibold transition-colors text-sm sm:text-base ${
                activeTab === 'register'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Register
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label htmlFor="login-email" className="block text-gray-700 font-semibold mb-2 text-sm">
                    Email
                  </label>
                  <input
                    type="email"
                    id="login-email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-3 py-3 sm:px-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="login-password" className="block text-gray-700 font-semibold mb-2 text-sm">
                    Password
                  </label>
                  <input
                    type="password"
                    id="login-password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="Enter your password"
                    className="w-full px-3 py-3 sm:px-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 rounded w-4 h-4" />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-lg transition-colors text-base"
                >
                  Login
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label htmlFor="register-name" className="block text-gray-700 font-semibold mb-2 text-sm">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="register-name"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-3 py-3 sm:px-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="register-email" className="block text-gray-700 font-semibold mb-2 text-sm">
                    Email
                  </label>
                  <input
                    type="email"
                    id="register-email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-3 py-3 sm:px-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="register-phone" className="block text-gray-700 font-semibold mb-2 text-sm">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="register-phone"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full px-3 py-3 sm:px-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="register-password" className="block text-gray-700 font-semibold mb-2 text-sm">
                    Password
                  </label>
                  <input
                    type="password"
                    id="register-password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    placeholder="Create a password"
                    className="w-full px-3 py-3 sm:px-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="register-confirm-password" className="block text-gray-700 font-semibold mb-2 text-sm">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="register-confirm-password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    placeholder="Confirm your password"
                    className="w-full px-3 py-3 sm:px-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-lg transition-colors text-base"
                >
                  Register
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}