import { useEffect, useState, useRef } from 'react';
import { Menu, Phone, X } from 'lucide-react';
import { AuthModal } from './auth-modal';
import { AuthSession } from '../lib/auth';

interface NavbarProps {
  onLoginSuccess?: (session: AuthSession) => void;
}

export function Navbar({ onLoginSuccess }: NavbarProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [initialResetToken, setInitialResetToken] = useState<string | undefined>();
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Scroll shadow effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Auto-open auth modal in reset mode when ?resetToken= is in URL (from email link)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('resetToken');
    if (token) {
      setInitialResetToken(token);
      setIsAuthModalOpen(true);
      // Clean the URL without reload
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleLoginSuccess = (session: AuthSession) => {
    setIsAuthModalOpen(false);
    if (onLoginSuccess) {
      onLoginSuccess(session);
    }
  };

  return (
    <>
      <nav className={`bg-white sticky top-0 z-50 border-b border-gray-200 transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
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
              <button
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="md:hidden w-8 h-8 rounded-full border border-gray-300 text-gray-700 flex items-center justify-center"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
              <a href="tel:+917354506728" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0066cc] hover:bg-[#0052a3] text-white flex items-center justify-center transition-colors">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="border-2 border-[#0066cc] text-[#0066cc] hover:bg-[#0066cc] hover:text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-full transition-all font-medium text-xs sm:text-sm"
              >
                Enroll Now
              </button>
            </div>
          </div>

          {/* Animated Mobile Menu */}
          <div
            ref={mobileMenuRef}
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="mt-3 border-t border-gray-200 pt-3">
              <div className="flex flex-col gap-2">
                <a
                  href="#results"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-[#0066cc] transition-colors text-sm font-medium"
                >
                  Our Results
                </a>
                <a
                  href="#courses"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-[#0066cc] transition-colors text-sm font-medium"
                >
                  Courses
                </a>
                <a
                  href="#facilities"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-[#0066cc] transition-colors text-sm font-medium"
                >
                  Facilities
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => { setIsAuthModalOpen(false); setInitialResetToken(undefined); }}
        onLoginSuccess={handleLoginSuccess}
        initialResetToken={initialResetToken}
      />
    </>
  );
}