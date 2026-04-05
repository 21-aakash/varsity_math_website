import { ImageWithFallback } from './figma/ImageWithFallback';
import { PartyPopper } from 'lucide-react';
import { FadeIn } from './fade-in';

const achievers = [
  { name: "Vanshika Dhurwey", percentage: "94%", image: "https://images.unsplash.com/photo-1761125050322-bbfc155571bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmZW1hbGUlMjBzdHVkZW50JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcwNTU0MjA5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { name: "Diksha Yadav", percentage: "97.6%", image: "https://images.unsplash.com/photo-1729337531424-198f880cb6c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGZlbWFsZSUyMHN0dWRlbnQlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzA1NTQyMDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { name: "Preeti Yadav", percentage: "94.6%", image: "https://images.unsplash.com/photo-1676253135268-2bf3095dfcc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWVuYWdlJTIwZ2lybCUyMHN0dWRlbnQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzA1NTQyMTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { name: "Namrata Yadav", percentage: "92.2%", image: "https://images.unsplash.com/photo-1761125050322-bbfc155571bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmZW1hbGUlMjBzdHVkZW50JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcwNTU0MjA5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { name: "Simran Dhodre", percentage: "90.6%", image: "https://images.unsplash.com/photo-1729337531424-198f880cb6c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGZlbWFsZSUyMHN0dWRlbnQlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzA1NTQyMDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { name: "Janhvi Gautam", percentage: "93.4%", image: "https://images.unsplash.com/photo-1676253135268-2bf3095dfcc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWVuYWdlJTIwZ2lybCUyMHN0dWRlbnQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzA1NTQyMTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { name: "Akshat Soni", percentage: "87%", image: "https://images.unsplash.com/photo-1647934786533-f3c15896410b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYWxlJTIwc3R1ZGVudCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MDU1NDIwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { name: "Harsh Yadav", percentage: "86.6%", image: "https://images.unsplash.com/photo-1614492898637-435e0f87cef8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbGUlMjBzdHVkZW50JTIwaGVhZHNob3R8ZW58MXx8fHwxNzcwNTU0MjEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { name: "Vanshika Dhurwey", percentage: "94%", image: "https://images.unsplash.com/photo-1761125050322-bbfc155571bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmZW1hbGUlMjBzdHVkZW50JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcwNTU0MjA5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { name: "Diksha Yadav", percentage: "97.6%", image: "https://images.unsplash.com/photo-1729337531424-198f880cb6c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGZlbWFsZSUyMHN0dWRlbnQlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzA1NTQyMDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { name: "Preeti Yadav", percentage: "94.6%", image: "https://images.unsplash.com/photo-1676253135268-2bf3095dfcc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWVuYWdlJTIwZ2lybCUyMHN0dWRlbnQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzA1NTQyMTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
];

export function AchieversSection() {
  return (
    <section id="results" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 flex items-center justify-center gap-2">
              Celebrating Our Achievers <PartyPopper className="w-7 h-7 sm:w-8 sm:h-8 text-orange-500" />
            </h2>
            <p className="text-gray-600 text-base sm:text-lg mb-2 px-4">
              Honoring the hard work, perseverance, and dedication of our toppers.
            </p>
            <div className="w-16 h-1 bg-orange-500 mx-auto rounded-full"></div>
          </div>
        </FadeIn>

        {/* Achievers Grid */}
        <div className="mb-12 sm:mb-16 md:mb-20 overflow-hidden relative">
          <style>{`
            @keyframes scroll-left {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-scroll {
              animation: scroll-left 40s linear infinite;
            }
            .animate-scroll:hover {
              animation-play-state: paused;
            }
          `}</style>
          <div className="flex gap-4 sm:gap-6 items-start animate-scroll">
            {[...achievers, ...achievers].map((achiever, index) => (
              <div key={index} className="flex flex-col items-center flex-shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-yellow-400 overflow-hidden mb-2 sm:mb-3 shadow-md">
                  <ImageWithFallback
                    src={achiever.image}
                    alt={achiever.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 text-center max-w-[80px] sm:max-w-[100px] leading-tight mb-1">
                  {achiever.name}
                </h3>
                <p className="text-xs sm:text-sm font-bold text-blue-600">{achiever.percentage}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <FadeIn delay={0.2}>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl shadow-lg py-6 px-4 sm:px-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Proven Results */}
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                Proven Results <span className="text-blue-600">in 2024</span>
              </h3>
            </div>

            {/* 50+ Students */}
            <div className="text-center md:border-l md:border-r border-gray-300 md:px-6">
              <div className="text-4xl sm:text-5xl font-bold text-blue-600 mb-2">50+</div>
              <p className="text-gray-700 text-sm">Students Scored Above 85%</p>
            </div>

            {/* 95% Pass Rate */}
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-blue-600 mb-2">95%</div>
              <p className="text-gray-700 text-sm">Students Passed CBSE 10th & 12th</p>
            </div>
          </div>
        </div>
        </FadeIn>
      </div>
    </section>
  );
}