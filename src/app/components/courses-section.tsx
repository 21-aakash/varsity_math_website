import { Check } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from './fade-in';

const courses = [
  {
    title: "Foundation Course",
    subtitle: "For Classes 7-10",
    features: [
      "Weekly tests & assignments",
      "Concept strengthening sessions",
      "Doubt clearing support",
      "Digital study material (Books, RACEs & more)",
      "Offline classes available"
    ]
  },
  {
    title: "Advanced Course",
    subtitle: "For Classes 11-12",
    features: [
      "Full syllabus coverage with recorded + offline classes",
      "Weekly and monthly tests with performance analysis",
      "Revision notes & advanced study material",
      "Dedicated doubt sessions",
      "Offline support for practice & guidance"
    ]
  }
];

export function CoursesSection() {
  return (
    <section id="courses" className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Courses Offered
            </h2>
            <div className="w-16 h-1 bg-orange-500 mx-auto rounded-full"></div>
          </div>
        </FadeIn>

        {/* Course Cards */}
        <StaggerContainer className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {courses.map((course, index) => (
            <StaggerItem 
              key={index}
              className={`bg-white rounded-2xl shadow-lg p-6 sm:p-8 relative border-t-4 ${
                index === 0 ? 'border-[#0066cc]' : 'border-orange-500'
              } hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}
            >
              {/* Enroll Now Button */}
              <button className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors">
                Enroll Now!
              </button>

              {/* Course Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 pr-24 sm:pr-28">
                {course.title}
              </h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                {course.subtitle}
              </p>

              {/* Features List */}
              <ul className="space-y-3 sm:space-y-4 mb-6">
                {course.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Know More Link */}
              <a 
                href="#contact" 
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm inline-flex items-center gap-1 transition-colors"
              >
                Know more →
              </a>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}