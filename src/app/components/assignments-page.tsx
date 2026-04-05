import { useState } from 'react';
import { FileText, Clock, CheckCircle, AlertCircle, Calendar, Award, ChevronRight } from 'lucide-react';
import { CreateAssignmentModal } from './create-assignment-modal';
import { TakeQuizModal } from './take-quiz-modal';

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  totalQuestions: number;
  questions: any[];
  status: 'completed' | 'pending' | 'overdue';
  score?: number;
  completedAt?: string;
  createdAt: string;
}

interface AssignmentsPageProps {
  studentName: string;
  isTeacher?: boolean; // Toggle for teacher view
}

export function AssignmentsPage({ studentName, isTeacher = false }: AssignmentsPageProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  // Will be populated from API (Google Sheets) in future
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const handleCreateAssignment = (assignment: Assignment) => {
    setAssignments([assignment, ...assignments]);
    setShowCreateModal(false);
  };

  const handleTakeQuiz = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowQuizModal(true);
  };

  const handleQuizSubmit = (score: number) => {
    if (selectedAssignment) {
      setAssignments(assignments.map(a => 
        a.id === selectedAssignment.id 
          ? { ...a, status: 'completed' as const, score, completedAt: new Date().toISOString() }
          : a
      ));
    }
    setShowQuizModal(false);
    setSelectedAssignment(null);
  };

  // Separate assignments
  const completedAssignments = assignments.filter(a => a.status === 'completed');
  const pendingAssignments = assignments.filter(a => a.status === 'pending');
  const overdueAssignments = assignments.filter(a => a.status === 'overdue');

  // Calculate average score
  const averageScore = completedAssignments.length > 0
    ? Math.round(completedAssignments.reduce((sum, a) => sum + (a.score || 0), 0) / completedAssignments.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600 mt-1">Manage and complete your assignments</p>
        </div>
        {isTeacher && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <FileText className="w-5 h-5" />
            Create Assignment
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
              <p className="text-sm text-gray-600">Total Assignments</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{completedAssignments.length}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{pendingAssignments.length}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
              <p className="text-sm text-gray-600">Average Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* New Assignments */}
      {(pendingAssignments.length > 0 || overdueAssignments.length > 0) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">New Assignments</h2>
          <div className="space-y-4">
            {/* Overdue */}
            {overdueAssignments.map(assignment => (
              <div key={assignment.id} className="border-l-4 border-red-500 bg-red-50 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-gray-900 text-base sm:text-lg">{assignment.title}</h3>
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
                        OVERDUE
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{assignment.description}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>{assignment.totalQuestions} Questions</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTakeQuiz(assignment)}
                    disabled={!assignment.questions || assignment.questions.length === 0}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-sm inline-flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                  >
                    Start Now
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Pending */}
            {pendingAssignments.map(assignment => (
              <div key={assignment.id} className="border-l-4 border-blue-500 bg-blue-50 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-gray-900 text-base sm:text-lg">{assignment.title}</h3>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                        NEW
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{assignment.description}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>{assignment.totalQuestions} Questions</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTakeQuiz(assignment)}
                    disabled={!assignment.questions || assignment.questions.length === 0}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm inline-flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                  >
                    Take Quiz
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Assignments */}
      {completedAssignments.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Past Assignments</h2>
          <div className="space-y-4">
            {completedAssignments.map(assignment => (
              <div key={assignment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-gray-900 text-base sm:text-lg">{assignment.title}</h3>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        COMPLETED
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{assignment.description}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Submitted: {assignment.completedAt ? new Date(assignment.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>{assignment.totalQuestions} Questions</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className={`text-3xl font-bold ${
                      (assignment.score || 0) >= 90 ? 'text-green-600' :
                      (assignment.score || 0) >= 75 ? 'text-blue-600' :
                      (assignment.score || 0) >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {assignment.score}%
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Score</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {assignments.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Assignments Yet</h3>
          <p className="text-gray-600">New assignments will appear here when created.</p>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateAssignmentModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateAssignment}
        />
      )}

      {showQuizModal && selectedAssignment && (
        <TakeQuizModal
          assignment={selectedAssignment}
          onClose={() => {
            setShowQuizModal(false);
            setSelectedAssignment(null);
          }}
          onSubmit={handleQuizSubmit}
        />
      )}
    </div>
  );
}