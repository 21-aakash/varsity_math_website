import { ImageWithFallback } from './figma/ImageWithFallback';
import { GraduationCap } from 'lucide-react';
import faculty1Image from '../../assets/facaulty_1.png';
import faculty2Image from '../../assets/facaulty_2.png';

const faculties = [
  {
    name: "Ojesh Bhagat",
    position: "Senior Faculty (XI-XII)",
    qualifications: "B.Sc-B.Ed, M.Sc (Maths), CTET+MPTET Qualified",
    image: faculty2Image
  },
  {
    name: "Mr. Anup Kujur",
    position: "Senior Faculty (VI-VIII)",
    qualifications: "B.Sc-B.Ed, MA (English)",
    image: faculty1Image
  }
];

export function FacultiesSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Our Faculties
          </h2>
          <div className="w-16 h-1 bg-orange-500 mx-auto rounded-full"></div>
        </div>

        {/* Faculty Cards */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 max-w-5xl mx-auto">
          {faculties.map((faculty, index) => (
            <div 
              key={index} 
              className="bg-white rounded-3xl shadow-lg overflow-hidden w-full sm:w-72 flex flex-col"
            >
              {/* Image Section */}
              <div className="bg-gray-100 h-56 sm:h-64 overflow-hidden">
                <ImageWithFallback
                  src={faculty.image}
                  alt={faculty.name}
                  className="w-full h-full object-cover grayscale"
                />
              </div>

              {/* Info Section */}
              <div className="p-5 sm:p-6 text-center flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-blue-600 mb-2">
                    {faculty.name}
                  </h3>
                  <p className="text-orange-500 font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                    {faculty.position}
                  </p>
                </div>
                
                <div className="flex items-start gap-2 text-gray-600 text-sm border-t pt-3 sm:pt-4">
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-left">{faculty.qualifications}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}