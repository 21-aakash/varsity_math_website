import { ImageWithFallback } from './figma/ImageWithFallback';
import { Youtube, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef } from 'react';

const videos = [
  {
    id: 1,
    title: "How to solve fraction 🤔 #maths #jeeamins #viral",
    thumbnail: "https://images.unsplash.com/photo-1758685848095-249ad965f4f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFjaGVyJTIwZXhwbGFpbmluZyUyMG1hdGglMjBibGFja2JvYXJkfGVufDF8fHx8MTc3MDU1NDc3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    videoUrl: "#"
  },
  {
    id: 2,
    title: "Balance kaise kare chemical equations ko 😊😊🤔🤔 #youtube #maths #chemistry #shorts #reels",
    thumbnail: "https://images.unsplash.com/photo-1758685733987-54952cd1c8c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwbGVhcm5pbmclMjBjaGVtaXN0cnklMjBzY2llbmNlfGVufDF8fHx8MTc3MDU1NDc3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    videoUrl: "#"
  },
  {
    id: 3,
    title: "Amazing trick for LCM ⚡ #maths #viral #shorts",
    thumbnail: "https://images.unsplash.com/photo-1758685733737-71f8945decf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRoZW1hdGljcyUyMGVxdWF0aW9ucyUyMHN0dWR5aW5nfGVufDF8fHx8MTc3MDU1NDc3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    videoUrl: "#"
  },
  {
    id: 4,
    title: "Quadratic equations made easy 📐 #maths #algebra #viral",
    thumbnail: "https://images.unsplash.com/photo-1758685848095-249ad965f4f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFjaGVyJTIwZXhwbGFpbmluZyUyMG1hdGglMjBibGFja2JvYXJkfGVufDF8fHx8MTc3MDU1NDc3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    videoUrl: "#"
  }
];

export function VideosSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3">
            <Youtube className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 fill-red-600" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Latest Videos
            </h2>
          </div>
          <div className="w-16 h-1 bg-orange-500 mx-auto rounded-full"></div>
        </div>

        {/* Videos Carousel */}
        <div className="relative max-w-6xl mx-auto">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 sm:p-3 hover:bg-gray-50 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </button>
          )}

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 sm:p-3 hover:bg-gray-50 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </button>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-4 sm:px-12"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {videos.map((video) => (
              <a
                key={video.id}
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-64 sm:w-80 group"
              >
                {/* Thumbnail */}
                <div className="relative rounded-xl overflow-hidden shadow-lg mb-3 aspect-video bg-gray-200">
                  <ImageWithFallback
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-40 transition-all">
                    <div className="bg-white bg-opacity-90 rounded-full p-3 sm:p-4 group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 fill-red-600" />
                    </div>
                  </div>
                </div>

                {/* Video Title */}
                <h3 className="text-sm text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors px-1">
                  {video.title}
                </h3>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}