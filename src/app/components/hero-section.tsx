import heroImage from "figma:asset/8e41855d282a4bafacc9b76298224e220cab9040.png";

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-140px)] bg-white overflow-hidden">
      {/* Background Pattern - Grid Paper */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: `
              linear-gradient(to right, #9ca3af 1px, transparent 1px),
              linear-gradient(to bottom, #9ca3af 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center justify-center min-h-[calc(100vh-140px)]">
        {/* Heading */}
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-600 text-center mb-6 sm:mb-8 flex items-center gap-2 flex-wrap justify-center px-2">
          <span>LEARN SMART. LEARN DEEP. BUILD YOUR FUTURE</span>
          <span>🚀</span>
        </h2>

        {/* Hero Image Container */}
        <div className="relative w-full max-w-5xl mb-6 sm:mb-8 px-2">
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl">
            <img 
              src={heroImage} 
              alt="Students with instructor" 
              className="w-full h-auto max-h-[50vh] sm:max-h-[60vh] object-cover shadow-2xl"
            />
          </div>
        </div>

        {/* CTA Button */}
        <button className="bg-[#0891b2] hover:bg-[#0e7490] text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-lg transition-all transform hover:scale-105">
          Enroll Now!
        </button>
      </div>
    </section>
  );
}