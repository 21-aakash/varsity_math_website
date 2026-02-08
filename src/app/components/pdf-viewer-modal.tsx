import { X as XIcon, Download, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface StudyMaterial {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
  fileSize: string;
}

interface PDFViewerModalProps {
  material: StudyMaterial;
  onClose: () => void;
}

export function PDFViewerModal({ material, onClose }: PDFViewerModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 truncate">{material.title}</h2>
            <p className="text-sm text-gray-600">
              {material.uploadedBy} • {new Date(material.uploadedAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <a
              href={material.fileUrl}
              download={material.fileName}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5 text-gray-700" />
            </a>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Close"
            >
              <XIcon className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-hidden bg-gray-100">
          <iframe
            src={material.fileUrl}
            className="w-full h-full border-0"
            title={material.title}
          />
        </div>

        {/* Footer Info */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              File: {material.fileName}
            </span>
            <span className="text-gray-600">
              Size: {material.fileSize}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
