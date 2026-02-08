import { useState } from 'react';
import { Camera, User, Mail, Phone, Save, X } from 'lucide-react';

interface SettingsPageProps {
  profileName: string;
  profileEmail: string;
  profilePhone: string;
  profilePhotoUrl: string;
  setProfileName: (name: string) => void;
  setProfileEmail: (email: string) => void;
  setProfilePhone: (phone: string) => void;
  setProfilePhotoUrl: (url: string) => void;
}

export function SettingsPage({ 
  profileName,
  profileEmail,
  profilePhone,
  profilePhotoUrl,
  setProfileName,
  setProfileEmail,
  setProfilePhone,
  setProfilePhotoUrl
}: SettingsPageProps) {
  const [name, setName] = useState(profileName);
  const [email, setEmail] = useState(profileEmail);
  const [phone, setPhone] = useState(profilePhone);
  const [photoUrl, setPhotoUrl] = useState(profilePhotoUrl);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setProfileName(name);
    setProfileEmail(email);
    setProfilePhone(phone);
    setProfilePhotoUrl(photoUrl);
    setIsEditing(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleCancel = () => {
    setName(profileName);
    setEmail(profileEmail);
    setPhone(profilePhone);
    setPhotoUrl(profilePhotoUrl);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 m-4 sm:m-6 sm:mb-0 rounded-r-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Save className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Profile updated successfully!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-gray-200 px-4 sm:px-6 py-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Profile Section */}
      <div className="p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Profile Information</h3>

        {/* Profile Photo */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="relative">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Profile"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-gray-200"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold border-4 border-gray-200">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
            <label
              htmlFor="photo-upload"
              className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors"
            >
              <Camera className="w-4 h-4" />
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>
          <div className="text-center sm:text-left">
            <h4 className="font-semibold text-gray-900 text-base sm:text-lg">{name}</h4>
            <p className="text-sm text-gray-600">{email}</p>
            <p className="text-xs text-gray-500 mt-2">Click the camera icon to change your photo</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 sm:space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setIsEditing(true);
              }}
              className="w-full px-3 py-3 sm:px-4 sm:py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsEditing(true);
              }}
              className="w-full px-3 py-3 sm:px-4 sm:py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter your email"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setIsEditing(true);
              }}
              className="w-full px-3 py-3 sm:px-4 sm:py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-6 sm:mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 sm:py-2.5 rounded-lg font-medium transition-colors text-base"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 sm:py-2.5 rounded-lg font-medium transition-colors text-base"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Additional Settings Section */}
      <div className="border-t border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
        <div className="space-y-3 sm:space-y-4">
          {/* Notification Toggle */}
          <div className="flex items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-4">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 text-sm sm:text-base">Email Notifications</h4>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Receive updates about assignments and announcements</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* SMS Toggle */}
          <div className="flex items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-4">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 text-sm sm:text-base">SMS Notifications</h4>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Get text messages for important updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}