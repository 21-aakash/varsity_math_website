import { useState } from "react";
import { Navbar } from "./components/navbar";
import { AnnouncementBanner } from "./components/announcement-banner";
import { HeroSection } from "./components/hero-section";
import { SocialButtons } from "./components/social-buttons";
import { AchieversSection } from "./components/achievers-section";
import { FacultiesSection } from "./components/faculties-section";
import { CoursesSection } from "./components/courses-section";
import { FacilitiesSection } from "./components/facilities-section";
import { VideosSection } from "./components/videos-section";
import { WhySection } from "./components/why-section";
import { ContactSection } from "./components/contact-section";
import { Footer } from "./components/footer";
import { StudentDashboard } from "./components/student-dashboard";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");

  const handleLoginSuccess = (name: string, email: string) => {
    setStudentName(name);
    setStudentEmail(email);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setStudentName("");
    setStudentEmail("");
  };

  // If logged in, show dashboard
  if (isLoggedIn) {
    return (
      <StudentDashboard
        studentName={studentName}
        studentEmail={studentEmail}
        onLogout={handleLogout}
      />
    );
  }

  // Otherwise show main website
  return (
    <div className="min-h-screen bg-white">
      <Navbar onLoginSuccess={handleLoginSuccess} />
      <AnnouncementBanner />
      <HeroSection />
      <AchieversSection />
      <FacultiesSection />
      <CoursesSection />
      <FacilitiesSection />
      <VideosSection />
      <WhySection />
      <ContactSection />
      <Footer />
      <SocialButtons />
    </div>
  );
}