import { useState, useEffect } from 'react';
import { BookOpen, User, LogOut, Menu, X as XIcon, GraduationCap, FileText, Settings, CheckCircle, AlertCircle, MessageSquare, Bell, Info } from 'lucide-react';
import { EnrollmentForm } from './enrollment-form';
import { TestScoresSection } from './test-scores-section';
import { AssignmentsPage } from './assignments-page';
import { StudyMaterialsPage } from './study-materials-page';
import { SettingsPage } from './settings-page';
import { NotificationsDropdown } from './notifications-dropdown';
import { EnrollmentResponse, getAdmissionStatus } from '../lib/auth';

interface Course {
  id: string;
  name: string;
  instructor: string;
  progress: number;
  nextClass: string;
}

interface StudentDashboardProps {
  token: string;
  studentName: string;
  studentEmail: string;
  onLogout: () => void;
}

export function StudentDashboard({ token, studentName, studentEmail, onLogout }: StudentDashboardProps) {
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAdmissionPopup, setShowAdmissionPopup] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'assignments' | 'study-materials' | 'chatbot' | 'settings'>('dashboard');
  
  // Admission status from Google Sheet via backend
  const [admissionStatus, setAdmissionStatus] = useState<'admitted' | 'under_review' | 'rejected' | 'not_enrolled'>('not_enrolled');
  const [admissionLabel, setAdmissionLabel] = useState('Not Enrolled');
  const isAdmitted = admissionStatus === 'admitted';
  
  // Profile state
  const [profileName, setProfileName] = useState(studentName);
  const [profileEmail, setProfileEmail] = useState(studentEmail);
  const [profilePhone, setProfilePhone] = useState('');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
  
  // Notifications state
  const [notifications, setNotifications] = useState<{
    id: string;
    type: 'assignment' | 'success' | 'info' | 'warning';
    title: string;
    message: string;
    time: string;
    read: boolean;
  }[]>([]);
  
  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };
  
  const handleClearAllNotifications = () => {
    setNotifications([]);
  };
  
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);

  const COURSE_LABELS: Record<string, string> = {
    foundation_7_10: 'Foundation 7-10',
    advanced_11_12: 'Advanced 11-12',
  };

  // Fetch admission status from backend (reads Google Sheet)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getAdmissionStatus(token);
        if (cancelled) return;
        setAdmissionStatus(res.status);
        setAdmissionLabel(res.statusLabel);
        if (res.status !== 'admitted') {
          setShowAdmissionPopup(true);
        }
      } catch {
        // If fetch fails, keep default "not_enrolled"
        setShowAdmissionPopup(true);
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  const handleEnrollmentSuccess = (courseData: EnrollmentResponse) => {
    // In real app, this would save to backend
    const newCourse: Course = {
      id: courseData.id,
      name: COURSE_LABELS[courseData.course] ?? courseData.course,
      instructor: 'TBA',
      progress: 0,
      nextClass: 'To be announced'
    };
    setEnrolledCourses([...enrolledCourses, newCourse]);
    setShowEnrollmentForm(false);
    // Update profile photo from enrollment
    if (courseData.photoUrl) {
      const base = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? '';
      setProfilePhotoUrl(`${base}${courseData.photoUrl}`);
    }
    // After enrollment, status goes to "Under Review" until admin approves in Google Sheet
    setAdmissionStatus('under_review');
    setAdmissionLabel('Under Review');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-gray-600 hover:text-gray-900 p-2"
              >
                {isMobileMenuOpen ? <XIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <h1 className="text-base sm:text-xl md:text-2xl text-[#0066cc] font-bold">
                Varsity Maths<sup className="text-xs">™</sup>
              </h1>
            </div>

            {/* Profile Section */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:block text-right">
                <p className="font-semibold text-gray-900 text-sm">{profileName}</p>
                <p className="text-xs text-gray-500">{profileEmail}</p>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                {profilePhotoUrl ? (
                  <img src={profilePhotoUrl} alt={profileName} className="w-full h-full rounded-full object-cover" />
                ) : (
                  profileName.charAt(0).toUpperCase()
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div className={`md:hidden fixed inset-0 z-50 ${isMobileMenuOpen ? '' : 'pointer-events-none'}`}>
        <button
          type="button"
          aria-label="Close menu overlay"
          onClick={() => setIsMobileMenuOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
        />
        <aside
          className={`absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-white shadow-2xl border-r border-gray-200 p-4 transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#0066cc]">Menu</h2>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-700"
              aria-label="Close menu"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => {
                setCurrentView('dashboard');
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium w-full ${
                currentView === 'dashboard' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <GraduationCap className="w-5 h-5" />
              My Classroom
            </button>
            <button
              onClick={() => {
                setCurrentView('assignments');
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium w-full ${
                currentView === 'assignments' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-5 h-5" />
              Assignments
            </button>
            <button
              onClick={() => {
                setCurrentView('study-materials');
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium w-full ${
                currentView === 'study-materials' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              Study Materials
            </button>
            <button
              onClick={() => {
                setCurrentView('chatbot');
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium w-full ${
                currentView === 'chatbot' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              Ask AI
            </button>
            <button
              onClick={() => {
                setCurrentView('settings');
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium w-full ${
                currentView === 'settings' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Settings className="w-5 h-5" />
              Settings
            </button>
            <button
              onClick={() => {
                setShowEnrollmentForm(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 text-white bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg font-medium w-full"
            >
              <User className="w-5 h-5" />
              Fill Enrollment Form
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-3 text-red-600 hover:bg-red-50 px-4 py-3 rounded-lg font-medium w-full"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </nav>
        </aside>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-8">

        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar - Desktop */}
          <aside className="hidden md:block md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-24">
              <nav className="space-y-2">
                <button
                  onClick={() => {
                    setCurrentView('dashboard');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium w-full ${
                    currentView === 'dashboard' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <GraduationCap className="w-5 h-5" />
                  My Classroom
                </button>
                <button
                  onClick={() => {
                    setCurrentView('assignments');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium w-full ${
                    currentView === 'assignments' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  Assignments
                </button>
                <button
                  onClick={() => {
                    setCurrentView('study-materials');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium w-full ${
                    currentView === 'study-materials' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  Study Materials
                </button>
                <button
                  onClick={() => {
                    setCurrentView('chatbot');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium w-full ${
                    currentView === 'chatbot' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                  Ask AI
                </button>
                <button
                  onClick={() => {
                    setCurrentView('settings');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium w-full ${
                    currentView === 'settings' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  Settings
                </button>
                
                {/* Divider */}
                <div className="pt-2 pb-2">
                  <div className="border-t border-gray-200"></div>
                </div>
                
                {/* Enrollment Form Button */}
                <button
                  onClick={() => setShowEnrollmentForm(true)}
                  className="flex items-center gap-3 text-white bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg font-medium w-full transition-colors"
                >
                  <User className="w-5 h-5" />
                  Fill Enrollment Form
                </button>
                
                <button
                  onClick={onLogout}
                  className="flex items-center gap-3 text-red-600 hover:bg-red-50 px-4 py-3 rounded-lg font-medium w-full"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="md:col-span-3">
            {showEnrollmentForm ? (
              /* Enrollment Form View */
              <EnrollmentForm
                studentName={studentName}
                studentEmail={studentEmail}
                onClose={() => setShowEnrollmentForm(false)}
                onSubmit={handleEnrollmentSuccess}
              />
            ) : currentView === 'assignments' ? (
              /* Assignments View */
              <AssignmentsPage studentName={studentName} isTeacher={false} />
            ) : currentView === 'study-materials' ? (
              /* Study Materials View */
              <StudyMaterialsPage studentName={studentName} />
            ) : currentView === 'chatbot' ? (
              /* Chatbot Coming Soon View */
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 md:p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-pulse">
                    <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Ask AI</h2>
                  <p className="text-lg sm:text-xl text-gray-600 mb-4 sm:mb-6">Coming Soon! 🚀</p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 text-left">
                    <h3 className="font-bold text-gray-900 mb-3 text-sm sm:text-base">What to expect:</h3>
                    <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>24/7 instant help with math problems</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Step-by-step solutions and explanations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Practice problems tailored to your level</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Quick answers to homework questions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Study tips and exam preparation guidance</span>
                      </li>
                    </ul>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    We're working hard to bring you an AI-powered math assistant. Stay tuned!
                  </p>
                </div>
              </div>
            ) : currentView === 'settings' ? (
              /* Settings View */
              <SettingsPage
                token={token}
                profileName={profileName}
                profileEmail={profileEmail}
                profilePhone={profilePhone}
                profilePhotoUrl={profilePhotoUrl}
                setProfileName={setProfileName}
                setProfilePhone={setProfilePhone}
                setProfilePhotoUrl={setProfilePhotoUrl}
              />
            ) : (
              <>
                {/* Admission Popup - Shows on login if not admitted */}
                {showAdmissionPopup && !isAdmitted && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative animate-fadeIn">
                      <button
                        onClick={() => setShowAdmissionPopup(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <XIcon className="w-6 h-6" />
                      </button>
                      
                      <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Admission Required</h2>
                        <p className="text-gray-600 mb-6">
                          You need to complete the admission process before accessing courses and test scores.
                        </p>
                        <button
                          onClick={() => {
                            setShowAdmissionPopup(false);
                            setShowEnrollmentForm(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 w-full justify-center"
                        >
                          <GraduationCap className="w-5 h-5" />
                          Take Admission Now
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Welcome Card with Admission Status */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-4 sm:p-6 md:p-8 mb-6 text-white relative">
                  {/* Notification Bell Icon */}
                  <div className="mb-4 flex justify-end sm:absolute sm:top-6 sm:right-6 sm:mb-0 z-50">
                    <NotificationsDropdown
                      notifications={notifications}
                      onMarkAsRead={handleMarkAsRead}
                      onClearAll={handleClearAllNotifications}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6 sm:pr-16">
                    <div>
                      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 break-words">Welcome back, {studentName}! 👋</h1>
                      <p className="text-sm sm:text-base text-blue-100">Ready to continue your learning journey?</p>
                    </div>
                    
                    {/* Admission Status Badge */}
                    <div className="flex-shrink-0">
                      {admissionStatus === 'admitted' ? (
                        <div className="flex items-center gap-2 bg-green-500 px-4 py-2 rounded-lg shadow-lg">
                          <CheckCircle className="w-5 h-5 text-white" />
                          <span className="font-semibold text-white text-sm">Admitted</span>
                        </div>
                      ) : admissionStatus === 'under_review' ? (
                        <div className="flex items-center gap-2 bg-yellow-500 px-4 py-2 rounded-lg shadow-lg">
                          <Info className="w-5 h-5 text-white" />
                          <span className="font-semibold text-white text-sm">Under Review</span>
                        </div>
                      ) : admissionStatus === 'rejected' ? (
                        <div className="flex items-center gap-2 bg-red-500 px-4 py-2 rounded-lg shadow-lg">
                          <AlertCircle className="w-5 h-5 text-white" />
                          <span className="font-semibold text-white text-sm">Rejected</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 bg-red-500 px-4 py-2 rounded-lg shadow-lg">
                          <AlertCircle className="w-5 h-5 text-white" />
                          <span className="font-semibold text-white text-sm">Not Enrolled</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Enrollment Status Section */}
                {enrolledCourses.length > 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900">My Enrolled Courses</h2>
                      <button
                        onClick={() => setShowEnrollmentForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm w-full sm:w-auto"
                      >
                        Enroll in Another Course
                      </button>
                    </div>

                    <div className="space-y-4">
                      {enrolledCourses.map((course) => (
                        <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                            <div>
                              <h3 className="font-bold text-gray-900 text-base sm:text-lg">{course.name}</h3>
                              <p className="text-sm text-gray-600">Instructor: {course.instructor}</p>
                            </div>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold w-fit">
                              Active
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-semibold text-gray-900">{course.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${course.progress}%` }}
                              />
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">Next Class:</span> {course.nextClass}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  null
                )}

                {/* Test Scores Section */}
                <TestScoresSection studentName={studentName} />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}