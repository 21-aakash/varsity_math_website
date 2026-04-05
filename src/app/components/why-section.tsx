import { FadeIn } from './fade-in';

export function WhySection() {
  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
          {/* Logo */}
          <FadeIn direction="right">
          <div className="flex justify-center md:justify-end md:pr-8">
            <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl flex items-center justify-center">
              <span className="text-white text-7xl sm:text-8xl md:text-9xl font-bold">V</span>
            </div>
          </div>
          </FadeIn>

          {/* Content */}
          <FadeIn direction="left" delay={0.15}>
          <div className="md:pl-8 px-4 sm:px-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Why Varsity Maths?
            </h2>
            <div className="w-16 h-1 bg-orange-500 rounded-full mb-6 sm:mb-8"></div>

            <div className="space-y-4 sm:space-y-6 text-gray-700 leading-relaxed text-sm sm:text-base">
              <p>
                At <span className="text-blue-600 font-semibold">Varsity Maths</span>, our journey began with a simple mission – to make strong conceptual understanding accessible to every student.
              </p>

              <p>
                We believe great teachers and guided practice can transform ordinary learning into deep curiosity. Our programs are designed to build confidence, clarity, and love for problem-solving – not just scores.
              </p>
            </div>
          </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}