import { Youtube, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1a2332] text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Our Address */}
          <div>
            <h3 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4">Our Address</h3>
            <div className="space-y-2 text-xs sm:text-sm">
              <p>Besa main street, Near by Purvansh stationary, pincode-461051</p>
              <p>Besa, Madhya Pradesh, India</p>
              <p>E-mail: - ojubhagar10126@gmail.com</p>
              <p>Phone no: - 7354506728</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#home" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Sections */}
          <div>
            <h3 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4">Sections</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#results" className="hover:text-white transition-colors">
                  Results
                </a>
              </li>
              <li>
                <a href="#achievers" className="hover:text-white transition-colors">
                  Achievers
                </a>
              </li>
              <li>
                <a href="#news" className="hover:text-white transition-colors">
                  News & Updates
                </a>
              </li>
            </ul>
          </div>

          {/* Find Us - Map */}
          <div>
            <h3 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4">Find Us</h3>
            <div className="w-full h-32 sm:h-40 bg-gray-700 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3667.8519087487476!2d77.5016!3d23.1845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDExJzA0LjIiTiA3N8KwMzAnMDUuOCJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Varsity Maths Location"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Icons */}
      <div className="border-t border-gray-700 py-4 sm:py-6">
        <div className="flex justify-center gap-3 sm:gap-4">
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
          >
            <Youtube className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </a>
          <a
            href="https://wa.me/917354506728"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-xs sm:text-sm">
          <p className="mb-1">
            Developed <span className="text-white font-semibold">and</span> | Managed by{' '}
            <span className="text-white font-semibold">metaSolve</span>
          </p>
          <p className="text-gray-400 text-[10px] sm:text-xs">
            © 2025 metaSolve. All rights reserved.
          </p>
          <p className="text-gray-400 text-[10px] sm:text-xs mt-1">
            Contact:{' '}
            <a href="mailto:metaSolve.nj@gmail.com" className="hover:text-white transition-colors">
              metaSolve.nj@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}