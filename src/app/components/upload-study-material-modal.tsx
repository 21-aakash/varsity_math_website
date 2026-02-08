import { useState } from 'react';
import { X as XIcon, Upload, FileText, CheckCircle } from 'lucide-react';

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

interface UploadStudyMaterialModalProps {
  defaultCategory?: 'books' | 'previous-papers' | 'reference-books' | 'handwritten-notes';
  onClose: () => void;
  onUpload: (material: StudyMaterial) => void;
}

export function UploadStudyMaterialModal({ defaultCategory, onClose, onUpload }: UploadStudyMaterialModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>(defaultCategory || 'books');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const categories = [
    { id: 'books', name: 'Books' },
    { id: 'previous-papers', name: 'Previous Papers' },
    { id: 'reference-books', name: 'Reference Books' },
    { id: 'handwritten-notes', name: 'Handwritten Notes' }
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      // Auto-fill title if empty
      if (!title) {
        setTitle(file.name.replace('.pdf', ''));
      }
    } else {
      alert('Please select a PDF file');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    if (!selectedFile) {
      alert('Please select a PDF file');
      return;
    }

    setUploading(true);

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In real app, upload to Google Drive and get the URL
    // For now, create a mock URL
    const reader = new FileReader();
    reader.onloadend = () => {
      const newMaterial: StudyMaterial = {
        id: Date.now().toString(),
        title: title,
        category: category as any,
        fileUrl: reader.result as string, // In real app, this would be Google Drive URL
        fileName: selectedFile.name,
        uploadedBy: 'Teacher', // In real app, get from auth
        uploadedAt: new Date().toISOString(),
        fileSize: formatFileSize(selectedFile.size)
      };

      onUpload(newMaterial);
      setUploading(false);
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Upload Study Material</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleUpload} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Material Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Algebra Chapter 5"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              PDF File *
            </label>
            
            {selectedFile ? (
              <div className="border-2 border-green-300 bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{selectedFile.name}</p>
                    <p className="text-sm text-gray-600">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors block">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF files only (Max 50MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  required
                />
              </label>
            )}
          </div>

          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Google Drive Integration
                </p>
                <p className="text-xs text-blue-700">
                  In production, files will be uploaded to your Google Drive and students will access them from there.
                  Make sure you have the proper permissions set up.
                </p>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            disabled={uploading}
            className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading || !selectedFile || !title.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Material
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
