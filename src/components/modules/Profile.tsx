import React, { useState, useRef } from 'react';
import { User, Sun, Moon, Monitor, Image, Save, X } from 'lucide-react';
import { useAppStore } from '@/store';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { profile, updateProfile } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    userName: profile.userName || user?.name || '',
    email: profile.email || user?.email || '',
    phone: profile.phone || '',
    theme: profile.theme || 'system',
    whyISell: profile.whyISell || ''
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>(profile.motivationalImages || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    updateProfile({
      ...editedProfile,
      motivationalImages: uploadedImages
    });
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile({
      userName: profile.userName || user?.name || '',
      email: profile.email || user?.email || '',
      phone: profile.phone || '',
      theme: profile.theme || 'system',
      whyISell: profile.whyISell || ''
    });
    setUploadedImages(profile.motivationalImages || []);
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setUploadedImages(prev => [...prev, e.target?.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const getThemeIcon = () => {
    switch (editedProfile.theme) {
      case 'light':
        return <Sun size={16} />;
      case 'dark':
        return <Moon size={16} />;
      default:
        return <Monitor size={16} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Profile & Settings</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Manage your personal information and preferences</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="flex items-center space-x-2">
            <User size={16} />
            <span>Edit Profile</span>
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button onClick={handleCancel} variant="outline" className="flex items-center space-x-2">
              <X size={16} />
              <span>Cancel</span>
            </Button>
            <Button onClick={handleSave} className="flex items-center space-x-2">
              <Save size={16} />
              <span>Save Changes</span>
            </Button>
          </div>
        )}
      </div>

      {/* Personal Information */}
      <Card title="Personal Information">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              {isEditing ? (
                <Input
                  value={editedProfile.userName}
                  onChange={(value) => setEditedProfile({ ...editedProfile, userName: value })}
                  placeholder="Your name"
                />
              ) : (
                <p className="text-gray-900 dark:text-gray-100">{profile.userName || user?.name || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              {isEditing ? (
                <Input
                  type="email"
                  value={editedProfile.email}
                  onChange={(value) => setEditedProfile({ ...editedProfile, email: value })}
                  placeholder="your.email@example.com"
                />
              ) : (
                <p className="text-gray-900 dark:text-gray-100">{profile.email || user?.email || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone
              </label>
              {isEditing ? (
                <Input
                  type="text"
                  value={editedProfile.phone}
                  onChange={(value) => setEditedProfile({ ...editedProfile, phone: value })}
                  placeholder="(555) 123-4567"
                />
              ) : (
                <p className="text-gray-900 dark:text-gray-100">{profile.phone || 'Not set'}</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Preferences */}
      <Card title="Preferences">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Theme Preference
            </label>
            {isEditing ? (
              <div className="grid grid-cols-3 gap-2">
                {['light', 'dark', 'system'].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setEditedProfile({ ...editedProfile, theme: theme as any })}
                    className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-md border-2 transition-colors ${
                      editedProfile.theme === theme
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    {theme === 'light' && <Sun size={16} />}
                    {theme === 'dark' && <Moon size={16} />}
                    {theme === 'system' && <Monitor size={16} />}
                    <span className="capitalize">{theme}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                {getThemeIcon()}
                <span className="capitalize">{profile.theme || 'system'}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Why I Sell */}
      <Card title="My Motivation">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Why I Sell
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Write about your personal motivation for selling. This will be shown after calls to remind you of your purpose.
            </p>
            {isEditing ? (
              <textarea
                value={editedProfile.whyISell}
                onChange={(e) => setEditedProfile({ ...editedProfile, whyISell: e.target.value })}
                placeholder="What drives me to succeed in sales..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                rows={4}
              />
            ) : (
              <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                {profile.whyISell || 'Not set yet. Click "Edit Profile" to add your motivation.'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Motivational Images
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Upload images that inspire you. These will be shown after calls to celebrate success or provide encouragement.
            </p>
            
            {isEditing && (
              <div className="mb-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Image size={16} />
                  <span>Upload Images</span>
                </Button>
              </div>
            )}

            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Motivational ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    {isEditing && (
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {uploadedImages.length === 0 && !isEditing && (
              <p className="text-gray-500 dark:text-gray-400 italic">No motivational images uploaded yet.</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;