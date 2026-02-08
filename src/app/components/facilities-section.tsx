import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface Facility {
  image: string;
  title: string;
}

const leftColumnFacilities: Facility[] = [
  {
    image: 'https://images.unsplash.com/photo-1664382953518-4a664ab8a8c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc3Jvb20lMjB3aGl0ZWJvYXJkJTIwdGVhY2hpbmd8ZW58MXx8fHwxNzcwNTU1MjA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'CBSE & MP Board'
  },
  {
    image: 'https://images.unsplash.com/photo-1578402027070-0f5ebd84ec9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwdG9nZXRoZXIlMjBsaWJyYXJ5fGVufDF8fHx8MTc3MDQ4OTg1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Weekly Test & Discussion'
  },
  {
    image: 'https://images.unsplash.com/photo-1758270704524-596810e891b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc3Jvb20lMjBzdHVkZW50cyUyMGxlYXJuaW5nfGVufDF8fHx8MTc3MDQ2NzQ1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Full Course Coverage'
  }
];

const rightColumnFacilities: Facility[] = [
  {
    image: 'https://images.unsplash.com/photo-1764514606337-bf03cd364af7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkeSUyMG1hdGVyaWFscyUyMGJvb2tzJTIwcGVuY2lsc3xlbnwxfHx8fDE3NzA1NTUyMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'CBSE & MP Board'
  },
  {
    image: 'https://images.unsplash.com/photo-1758685733699-04d6544f2655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb25hbCUyMGJsYWNrYm9hcmQlMjBtYXRofGVufDF8fHx8MTc3MDU1NTIwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Weekly Test & Discussion'
  }
];

function FacilityCard({ facility }: { facility: Facility }) {
  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg h-40 sm:h-48 mb-4">
      <ImageWithFallback
        src={facility.image}
        alt={facility.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 text-center px-2">
        <h3 className="text-white font-semibold text-base sm:text-lg">{facility.title}</h3>
      </div>
    </div>
  );
}

export function FacilitiesSection() {
  const [duplicatedLeft, setDuplicatedLeft] = useState<Facility[]>([]);
  const [duplicatedRight, setDuplicatedRight] = useState<Facility[]>([]);

  useEffect(() => {
    // Duplicate items for infinite scroll effect
    setDuplicatedLeft([...leftColumnFacilities, ...leftColumnFacilities, ...leftColumnFacilities]);
    setDuplicatedRight([...rightColumnFacilities, ...rightColumnFacilities, ...rightColumnFacilities, ...rightColumnFacilities]);
  }, []);

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Our Facilities</h2>
          <div className="w-16 h-1 bg-orange-500 rounded-full mx-auto"></div>
        </div>

        {/* Animated Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {/* Left Column - Scrolls Up */}
          <div className="relative h-[500px] sm:h-[600px] overflow-hidden">
            <motion.div
              animate={{
                y: [0, -100 * leftColumnFacilities.length]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {duplicatedLeft.map((facility, index) => (
                <FacilityCard key={`left-${index}`} facility={facility} />
              ))}
            </motion.div>
          </div>

          {/* Right Column - Scrolls Up (different speed) */}
          <div className="relative h-[500px] sm:h-[600px] overflow-hidden">
            <motion.div
              animate={{
                y: [0, -100 * rightColumnFacilities.length]
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {duplicatedRight.map((facility, index) => (
                <FacilityCard key={`right-${index}`} facility={facility} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}