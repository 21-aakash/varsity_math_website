import { useState, useRef, useEffect } from 'react';
import { Camera, User, Mail, Phone, Save, X, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { getProfile, updateProfile } from '../lib/auth';

interface SettingsPageProps {
  token: string;
  profileName: string;
  profileEmail: string;
  profilePhone: string;
  profilePhotoUrl: string;
  setProfileName: (name: string) => void;
  setProfilePhone: (phone: string) => void;
  setProfilePhotoUrl: (url: string) => void;
}

export function SettingsPage({
  token,
  profileName,
  profileEmail,
  profilePhone,
  profilePhotoUrl,
  setProfileName,
  setProfilePhone,
  setProfilePhotoUrl,
}: SettingsPageProps) {
  const [name, setName] = useState(profileName);
  const [phone, setPhoneLocal] = useState(profilePhone);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState(profilePhotoUrl);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation errors
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  // Fetch profile from backend on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const profile = await getProfile(token);
        if (cancelled) return;
        setName(profile.name);
        setPhoneLocal(profile.phone ?? '');
        if (profile.photoUrl) {
          const base = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? '';
          setPhotoPreview(`${base}${profile.photoUrl}`);
        }
      } catch {
        // Fall back to the props we already have
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  const validate = (): boolean => {
    const errs: { name?: string; phone?: string } = {};
    const trimmedName = name.trim();
    if (!trimmedName) {
      errs.name = 'Name is required.';
    } else if (trimmedName.length < 2) {
      errs.name = 'Name must be at least 2 characters.';
    } else if (trimmedName.length > 120) {
      errs.name = 'Name must be at most 120 characters.';
    }
    const trimmedPhone = phone.trim();
    if (trimmedPhone && !/^\+?[\d\s\-()]{7,20}$/.test(trimmedPhone)) {
      errs.phone = 'Enter a valid phone number.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

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
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setIsEditing(true);
  };

  const markEditing = () => setIsEditing(true);

  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);
    try {
      const result = await updateProfile(token, {
        name: name.trim(),
        phone: phone.trim(),
        photo: photoFile,
      });
      // Sync parent state
      setProfileName(result.name);
      setProfilePhone(result.phone ?? '');
      if (result.photoUrl) {
        const base = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? '';
        const fullUrl = `${base}${result.photoUrl}`;
        setProfilePhotoUrl(fullUrl);
        setPhotoPreview(fullUrl);
      }
      setPhotoFile(null);
      setIsEditing(false);
      setErrors({});
      toast.success(result.message || 'Profile updated successfully.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setName(profileName);
    setPhoneLocal(profilePhone);
    setPhotoFile(null);
    setPhotoPreview(profilePhotoUrl);
    setIsEditing(false);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
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
            {photoPreview ? (
              <img
                src={photoPreview}
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
                ref={fileInputRef}
                id="photo-upload"
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>
          <div className="text-center sm:text-left">
            <h4 className="font-semibold text-gray-900 text-base sm:text-lg">{name}</h4>
            <p className="text-sm text-gray-600">{profileEmail}</p>
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
                markEditing();
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              className={`w-full px-3 py-3 sm:px-4 sm:py-2.5 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
              placeholder="Enter your full name"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email Address
            </label>
            <input
              type="email"
              value={profileEmail}
              readOnly
              className="w-full px-3 py-3 sm:px-4 sm:py-2.5 text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
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
                setPhoneLocal(e.target.value);
                markEditing();
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
              }}
              className={`w-full px-3 py-3 sm:px-4 sm:py-2.5 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${errors.phone ? 'border-red-400' : 'border-gray-300'}`}
              placeholder="+91 9876543210"
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-6 sm:mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-6 py-3 sm:py-2.5 rounded-lg font-medium transition-colors text-base"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 px-6 py-3 sm:py-2.5 rounded-lg font-medium transition-colors text-base"
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