import { ArrowLeft, Camera, X as XIcon } from 'lucide-react';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { EnrollmentResponse, submitEnrollment } from '../lib/auth';

interface EnrollmentFormProps {
  studentName: string;
  studentEmail: string;
  onClose: () => void;
  onSubmit: (data: EnrollmentResponse) => void;
}

export function EnrollmentForm({ studentName, studentEmail, onClose, onSubmit }: EnrollmentFormProps) {
  const [formData, setFormData] = useState({
    firstName: studentName.split(' ')[0] || '',
    lastName: studentName.split(' ')[1] || '',
    phone: '',
    email: studentEmail,
    course: '' as '' | 'foundation_7_10' | 'advanced_11_12',
    paymentMethod: 'online' as 'online' | 'cash',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPG, PNG, and WebP images are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Photo must be less than 5 MB.');
      return;
    }
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    setPhoto(null);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const courses = [
    { value: 'foundation_7_10' as const, label: 'Foundation 7-10' },
    { value: 'advanced_11_12' as const, label: 'Advanced 11-12' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.course) {
      toast.error('Please select a course.');
      return;
    }
    if (!photo) {
      toast.error('Please upload a profile photo.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await submitEnrollment({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        course: formData.course,
        paymentMethod: formData.paymentMethod,
        photo,
      });
      toast.success(response.message || 'Enrollment submitted successfully.');
      onSubmit(response);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to submit enrollment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-lg">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-white hover:text-blue-100 transition-colors mb-3"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Dashboard</span>
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-white">Course Enrollment Form</h2>
        <p className="text-blue-100 mt-1">Fill in your details to enroll in a course</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8">
        {/* Personal Information */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
            Personal Information
          </h3>

          {/* Profile Photo Upload */}
          <div className="flex flex-col items-center mb-6">
            <label className="block text-gray-700 font-semibold mb-3 text-sm">
              Profile Photo *
            </label>
            <div className="relative">
              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Profile preview"
                    className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-1 -right-1 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-28 h-28 rounded-full border-2 border-dashed border-gray-300 hover:border-blue-400 flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 transition-colors bg-gray-50"
                >
                  <Camera className="w-8 h-8 mb-1" />
                  <span className="text-xs font-medium">Upload</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            {photoPreview && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Change Photo
              </button>
            )}
            <p className="text-xs text-gray-500 mt-1">JPG, PNG, or WebP (max 5 MB)</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-gray-700 font-semibold mb-2 text-sm">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-gray-700 font-semibold mb-2 text-sm">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-gray-700 font-semibold mb-2 text-sm">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 9876543210"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 font-semibold mb-2 text-sm">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                required
                readOnly
              />
            </div>
          </div>

        </div>

        {/* Course Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
            Course Selection
          </h3>
          
          <div>
            <label htmlFor="course" className="block text-gray-700 font-semibold mb-2 text-sm">
              Select Course *
            </label>
            <select
              id="course"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Choose a course...</option>
              {courses.map((course) => (
                <option key={course.value} value={course.value}>
                  {course.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Payment Information */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
            Payment Information
          </h3>

          {/* Payment Method */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-3 text-sm">
              Payment Method *
            </label>
            <div className="grid sm:grid-cols-2 gap-3">
              <label
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  formData.paymentMethod === 'online'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={formData.paymentMethod === 'online'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="mr-3"
                />
                <span className="font-semibold text-gray-900">Online Payment</span>
                <p className="text-sm text-gray-600 mt-1 ml-6">UPI, Net Banking, Card</p>
              </label>

              <label
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  formData.paymentMethod === 'cash'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={formData.paymentMethod === 'cash'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="mr-3"
                />
                <span className="font-semibold text-gray-900">Cash Payment</span>
                <p className="text-sm text-gray-600 mt-1 ml-6">Pay at center</p>
              </label>
            </div>
          </div>

          {formData.paymentMethod === 'cash' ? (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Note:</span> Please visit our center to complete the cash payment. 
                Our team will verify your enrollment after payment.
              </p>
            </div>
          ) : (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Note:</span> For online payment, submit the form after payment. No screenshot upload is required.
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Enrollment'}
          </button>
        </div>
      </form>
    </div>
  );
}