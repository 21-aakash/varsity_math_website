import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import { AuthSession, clearSession, loadSession, persistSession } from "./lib/auth";

export default function App() {
  const [session, setSession] = useState<AuthSession | null>(() => loadSession());

  const handleLoginSuccess = (nextSession: AuthSession) => {
    persistSession(nextSession);
    setSession(nextSession);
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
  };

  // If logged in, show dashboard
  if (session) {
    return (
      <>
        <StudentDashboard
          token={session.token}
          studentName={session.name}
          studentEmail={session.email}
          onLogout={handleLogout}
        />
        <ToastContainer position="top-right" autoClose={2500} newestOnTop closeOnClick />
      </>
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
      <ToastContainer position="top-right" autoClose={2500} newestOnTop closeOnClick />
    </div>
  );
}