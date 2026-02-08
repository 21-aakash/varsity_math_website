import { useState } from 'react';
import { AuthModal } from './auth-modal';

interface NavbarProps {
  onLoginSuccess?: (name: string, email: string) => void;
}

export function Navbar({ onLoginSuccess }: NavbarProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLoginSuccess = (name: string, email: string) => {
    setIsAuthModalOpen(false);
    if (onLoginSuccess) {
      onLoginSuccess(name, email);
    }
  };

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-lg sm:text-xl md:text-2xl text-[#0066cc] font-bold tracking-tight">
                Varsity Maths<sup className="text-[8px] sm:text-xs">™</sup>
              </h1>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#results" className="text-gray-700 hover:text-[#0066cc] transition-colors text-base font-medium">
                Our Results
              </a>
              <a href="#courses" className="text-gray-700 hover:text-[#0066cc] transition-colors text-base font-medium">
                Courses
              </a>
              <a href="#facilities" className="text-gray-700 hover:text-[#0066cc] transition-colors text-base font-medium">
                Facilities
              </a>
            </div>

            {/* Right Section - Phone & Enroll Now Button */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0066cc] hover:bg-[#0052a3] text-white flex items-center justify-center transition-colors text-sm sm:text-base">
                📞
              </button>
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="border-2 border-[#0066cc] text-[#0066cc] hover:bg-[#0066cc] hover:text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-full transition-all font-medium text-xs sm:text-sm"
              >
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}