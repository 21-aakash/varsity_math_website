import { useState } from 'react';
import { BookOpen, FileText, Upload, Download, Eye, FolderOpen, File } from 'lucide-react';
import { PDFViewerModal } from './pdf-viewer-modal';
import { UploadStudyMaterialModal } from './upload-study-material-modal';

interface StudyMaterial {
  id: string;
  title: string;
  category: 'books' | 'previous-papers' | 'reference-books' | 'handwritten-notes';
  fileUrl: string;
  fileName: string;
  uploadedBy: string;
  uploadedAt: string;
  fileSize: string;
}

interface StudyMaterialsPageProps {
  studentName: string;
  isTeacher?: boolean;
}

export function StudyMaterialsPage({ studentName, isTeacher = false }: StudyMaterialsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Mock data - Replace with Google Drive API integration
  const [materials, setMaterials] = useState<StudyMaterial[]>([
    {
      id: '1',
      title: 'Algebra - Complete Guide',
      category: 'books',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileName: 'algebra-guide.pdf',
      uploadedBy: 'Prof. Smith',
      uploadedAt: '2026-02-01',
      fileSize: '2.5 MB'
    },
    {
      id: '2',
      title: 'Calculus Textbook',
      category: 'books',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileName: 'calculus-textbook.pdf',
      uploadedBy: 'Prof. Johnson',
      uploadedAt: '2026-01-28',
      fileSize: '5.8 MB'
    },
    {
      id: '3',
      title: '2025 Final Exam Paper',
      category: 'previous-papers',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileName: '2025-final-exam.pdf',
      uploadedBy: 'Prof. Smith',
      uploadedAt: '2026-01-15',
      fileSize: '1.2 MB'
    },
    {
      id: '4',
      title: '2024 Mid-Term Paper',
      category: 'previous-papers',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileName: '2024-midterm.pdf',
      uploadedBy: 'Prof. Smith',
      uploadedAt: '2026-01-10',
      fileSize: '980 KB'
    },
    {
      id: '5',
      title: 'Advanced Trigonometry Reference',
      category: 'reference-books',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileName: 'trig-reference.pdf',
      uploadedBy: 'Prof. Davis',
      uploadedAt: '2026-02-05',
      fileSize: '3.1 MB'
    },
    {
      id: '6',
      title: 'Geometry Formulas Sheet',
      category: 'reference-books',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileName: 'geometry-formulas.pdf',
      uploadedBy: 'Prof. Davis',
      uploadedAt: '2026-02-03',
      fileSize: '1.5 MB'
    },
    {
      id: '7',
      title: 'Derivatives - Handwritten Notes',
      category: 'handwritten-notes',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileName: 'derivatives-notes.pdf',
      uploadedBy: 'Prof. Johnson',
      uploadedAt: '2026-02-07',
      fileSize: '4.2 MB'
    },
    {
      id: '8',
      title: 'Integration Techniques Notes',
      category: 'handwritten-notes',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileName: 'integration-notes.pdf',
      uploadedBy: 'Prof. Johnson',
      uploadedAt: '2026-02-06',
      fileSize: '3.7 MB'
    }
  ]);

  const categories = [
    {
      id: 'books',
      name: 'Books',
      icon: BookOpen,
      color: 'blue',
      description: 'Complete textbooks and course materials'
    },
    {
      id: 'previous-papers',
      name: 'Previous Papers',
      icon: FileText,
      color: 'green',
      description: 'Past exam papers and solutions'
    },
    {
      id: 'reference-books',
      name: 'Reference Books',
      icon: FolderOpen,
      color: 'purple',
      description: 'Additional reference materials'
    },
    {
      id: 'handwritten-notes',
      name: 'Handwritten Notes',
      icon: File,
      color: 'orange',
      description: 'Teacher handwritten notes and explanations'
    }
  ];

  const handleViewPDF = (material: StudyMaterial) => {
    setSelectedMaterial(material);
    setShowPDFViewer(true);
  };

  const handleUploadComplete = (newMaterial: StudyMaterial) => {
    setMaterials([newMaterial, ...materials]);
    setShowUploadModal(false);
  };

  const getCategoryMaterials = (categoryId: string) => {
    return materials.filter(m => m.category === categoryId);
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return { bg: 'bg-blue-100', text: 'text-blue-600', hover: 'hover:bg-blue-50' };
      case 'green':
        return { bg: 'bg-green-100', text: 'text-green-600', hover: 'hover:bg-green-50' };
      case 'purple':
        return { bg: 'bg-purple-100', text: 'text-purple-600', hover: 'hover:bg-purple-50' };
      case 'orange':
        return { bg: 'bg-orange-100', text: 'text-orange-600', hover: 'hover:bg-orange-50' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600', hover: 'hover:bg-gray-50' };
    }
  };

  // Show category view
  if (selectedCategory) {
    const category = categories.find(c => c.id === selectedCategory);
    const categoryMaterials = getCategoryMaterials(selectedCategory);
    const colors = getColorClasses(category?.color || 'gray');

    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Study Materials
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-700 font-medium">{category?.name}</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{category?.name}</h1>
            <p className="text-gray-600 mt-1">{category?.description}</p>
          </div>
          {isTeacher && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Upload Material
            </button>
          )}
        </div>

        {/* Materials List */}
        {categoryMaterials.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryMaterials.map(material => (
              <div
                key={material.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mb-4`}>
                  <FileText className={`w-6 h-6 ${colors.text}`} />
                </div>
                
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{material.title}</h3>
                
                <div className="space-y-1 mb-4">
                  <p className="text-xs text-gray-500">
                    Uploaded by {material.uploadedBy}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(material.uploadedAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })} • {material.fileSize}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewPDF(material)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm inline-flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <a
                    href={material.fileUrl}
                    download={material.fileName}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm inline-flex items-center justify-center"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <FileText className={`w-8 h-8 ${colors.text}`} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Materials Yet</h3>
            <p className="text-gray-600">Materials will appear here when uploaded.</p>
          </div>
        )}

        {/* Modals */}
        {showPDFViewer && selectedMaterial && (
          <PDFViewerModal
            material={selectedMaterial}
            onClose={() => {
              setShowPDFViewer(false);
              setSelectedMaterial(null);
            }}
          />
        )}

        {showUploadModal && (
          <UploadStudyMaterialModal
            defaultCategory={selectedCategory as any}
            onClose={() => setShowUploadModal(false)}
            onUpload={handleUploadComplete}
          />
        )}
      </div>
    );
  }

  // Main category grid view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Study Materials</h1>
          <p className="text-gray-600 mt-1">Access all your learning resources</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map(category => {
          const count = getCategoryMaterials(category.id).length;
          const colors = getColorClasses(category.color);
          const Icon = category.icon;

          return (
            <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-sm text-gray-600">{category.name}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map(category => {
          const count = getCategoryMaterials(category.id).length;
          const colors = getColorClasses(category.color);
          const Icon = category.icon;

          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow text-left group"
            >
              <div className={`w-16 h-16 ${colors.bg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-8 h-8 ${colors.text}`} />
              </div>
              
              <h3 className="font-bold text-gray-900 text-lg mb-2">{category.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{category.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {count} {count === 1 ? 'file' : 'files'}
                </span>
                <span className={`${colors.text} group-hover:translate-x-1 transition-transform`}>
                  →
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
