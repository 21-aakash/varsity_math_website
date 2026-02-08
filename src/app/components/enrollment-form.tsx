import { Upload, CheckCircle, ArrowLeft } from 'lucide-react';
import { useState, useRef } from 'react';

interface EnrollmentFormProps {
  studentName: string;
  studentEmail: string;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function EnrollmentForm({ studentName, studentEmail, onClose, onSubmit }: EnrollmentFormProps) {
  const [formData, setFormData] = useState({
    firstName: studentName.split(' ')[0] || '',
    lastName: studentName.split(' ')[1] || '',
    phone: '',
    email: studentEmail,
    course: '',
    paymentMethod: 'online',
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [paymentScreenshotPreview, setPaymentScreenshotPreview] = useState<string | null>(null);

  const profileImageRef = useRef<HTMLInputElement>(null);
  const paymentScreenshotRef = useRef<HTMLInputElement>(null);

  const courses = [
    'Class 11 Mathematics',
    'Class 12 Mathematics',
    'JEE Main Preparation',
    'JEE Advanced Preparation',
    'Foundation Course (Class 9-10)',
    'Crash Course - Board Exams',
  ];

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaymentScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would upload files and submit to backend
    onSubmit({
      ...formData,
      profileImage,
      paymentScreenshot,
    });
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

          {/* Profile Image Upload */}
          <div className="mt-4">
            <label className="block text-gray-700 font-semibold mb-2 text-sm">
              Profile Photo *
            </label>
            <div className="flex items-start gap-4">
              {profileImagePreview && (
                <img
                  src={profileImagePreview}
                  alt="Profile preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                />
              )}
              <div className="flex-1">
                <input
                  type="file"
                  ref={profileImageRef}
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                  required
                />
                <button
                  type="button"
                  onClick={() => profileImageRef.current?.click()}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600"
                >
                  <Upload className="w-5 h-5" />
                  {profileImage ? 'Change Photo' : 'Upload Photo'}
                </button>
                {profileImage && (
                  <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {profileImage.name}
                  </p>
                )}
              </div>
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
                <option key={course} value={course}>
                  {course}
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

          {/* Payment Screenshot Upload - Only for Online Payment */}
          {formData.paymentMethod === 'online' && (
            <div className="mt-4">
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                Payment Screenshot *
              </label>
              <div className="space-y-3">
                {paymentScreenshotPreview && (
                  <div className="border border-gray-300 rounded-lg p-3">
                    <img
                      src={paymentScreenshotPreview}
                      alt="Payment screenshot preview"
                      className="max-w-full h-auto max-h-64 rounded-lg mx-auto"
                    />
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    ref={paymentScreenshotRef}
                    accept="image/*"
                    onChange={handlePaymentScreenshotChange}
                    className="hidden"
                    required={formData.paymentMethod === 'online'}
                  />
                  <button
                    type="button"
                    onClick={() => paymentScreenshotRef.current?.click()}
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600"
                  >
                    <Upload className="w-5 h-5" />
                    {paymentScreenshot ? 'Change Screenshot' : 'Upload Payment Screenshot'}
                  </button>
                  {paymentScreenshot && (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      {paymentScreenshot.name}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Please upload a clear screenshot of your payment confirmation
                  </p>
                </div>
              </div>
            </div>
          )}

          {formData.paymentMethod === 'cash' && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Note:</span> Please visit our center to complete the cash payment. 
                Our team will verify your enrollment after payment.
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
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Submit Enrollment
          </button>
        </div>
      </form>
    </div>
  );
}