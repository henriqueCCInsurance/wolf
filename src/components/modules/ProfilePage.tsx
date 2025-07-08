import React, { useState, useRef } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Briefcase, 
  Camera, 
  Save, 
  X, 
  Shield, 
  Key,
  Award,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAppStore } from '@/store';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { motion } from 'framer-motion';

const ProfilePage: React.FC = () => {
  const { user, updateSettings } = useAuth();
  const { profile, updateProfile } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  const [editedProfile, setEditedProfile] = useState({
    userName: user?.name || '',
    email: user?.email || '',
    phone: profile.phone || '',
    company: profile.company || '',
    role: profile.jobTitle || '',
    department: profile.department || 'Sales',
    bio: profile.bio || '',
    linkedIn: profile.linkedIn || '',
    whyISell: profile.whyISell || ''
  });
  
  const [profilePicture, setProfilePicture] = useState<string>(profile.profilePicture || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    try {
      // Update profile in store
      updateProfile({
        userName: editedProfile.userName,
        email: editedProfile.email,
        phone: editedProfile.phone,
        company: editedProfile.company,
        jobTitle: editedProfile.role,
        department: editedProfile.department,
        bio: editedProfile.bio,
        linkedIn: editedProfile.linkedIn,
        whyISell: editedProfile.whyISell,
        profilePicture
      });
      
      // Update user settings if changed
      if (user) {
        await updateSettings({
          ...user.settings
        });
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleCancel = () => {
    setEditedProfile({
      userName: user?.name || '',
      email: user?.email || '',
      phone: profile.phone || '',
      company: profile.company || '',
      role: profile.jobTitle || '',
      department: profile.department || 'Sales',
      bio: profile.bio || '',
      linkedIn: profile.linkedIn || '',
      whyISell: profile.whyISell || ''
    });
    setProfilePicture(profile.profilePicture || '');
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfilePicture(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    setPasswordSuccess('');
    
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    try {
      // In a real app, this would call an API to change the password
      // For now, we'll simulate success
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowPasswordChange(false);
        setPasswordSuccess('');
      }, 2000);
    } catch (error) {
      setPasswordError('Failed to change password');
    }
  };

  const isBetaUser = user?.id?.startsWith('beta-');

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage your personal information and account settings
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="flex items-center space-x-2">
            <User size={16} />
            <span>Edit Profile</span>
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button onClick={handleCancel} variant="outline">
              <X size={16} className="mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture & Quick Info */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="text-center">
              {/* Profile Picture */}
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {profilePicture ? (
                    <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={48} className="text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors"
                  >
                    <Camera size={16} />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              {/* User Info */}
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {editedProfile.userName || 'Your Name'}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">{editedProfile.role || 'Sales Professional'}</p>
              
              {/* Beta Badge */}
              {isBetaUser && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center mt-3 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium"
                >
                  <Award size={14} className="mr-1" />
                  Beta Tester
                </motion.div>
              )}
              
              {/* Account Created */}
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <Calendar size={14} className="inline mr-1" />
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
              </div>
            </div>
          </Card>
          
          {/* Account Security */}
          <Card className="p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <Shield size={20} className="mr-2 text-primary-600" />
              Account Security
            </h3>
            
            <div className="space-y-3">
              <Button
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                variant="outline"
                className="w-full justify-start"
              >
                <Key size={16} className="mr-2" />
                Change Password
              </Button>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle size={14} className="inline mr-1 text-green-600" />
                Email verified
              </div>
            </div>
          </Card>
        </div>

        {/* Main Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card title="Personal Information" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  <User size={14} className="inline mr-1" />
                  Full Name
                </label>
                <Input
                  value={editedProfile.userName}
                  onChange={(value) => setEditedProfile({ ...editedProfile, userName: value })}
                  disabled={!isEditing}
                  placeholder="John Smith"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  <Mail size={14} className="inline mr-1" />
                  Email Address
                </label>
                <Input
                  type="email"
                  value={editedProfile.email}
                  disabled={!isEditing}
                  onChange={() => {}}
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  <Phone size={14} className="inline mr-1" />
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={editedProfile.phone}
                  onChange={(value) => setEditedProfile({ ...editedProfile, phone: value })}
                  disabled={!isEditing}
                  placeholder="(555) 123-4567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  <Building size={14} className="inline mr-1" />
                  Company
                </label>
                <Input
                  value={editedProfile.company}
                  onChange={(value) => setEditedProfile({ ...editedProfile, company: value })}
                  disabled={!isEditing}
                  placeholder="Campbell & Co."
                />
              </div>
            </div>
          </Card>

          {/* Professional Information */}
          <Card title="Professional Information" className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    <Briefcase size={14} className="inline mr-1" />
                    Job Title
                  </label>
                  <Input
                    value={editedProfile.role}
                    onChange={(value) => setEditedProfile({ ...editedProfile, role: value })}
                    disabled={!isEditing}
                    placeholder="Senior Sales Executive"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Department
                  </label>
                  <Input
                    value={editedProfile.department}
                    onChange={(value) => setEditedProfile({ ...editedProfile, department: value })}
                    disabled={!isEditing}
                    placeholder="Sales"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  LinkedIn Profile
                </label>
                <Input
                  value={editedProfile.linkedIn}
                  onChange={(value) => setEditedProfile({ ...editedProfile, linkedIn: value })}
                  disabled={!isEditing}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Professional Bio
                </label>
                <textarea
                  value={editedProfile.bio}
                  onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                  placeholder="Tell us about your professional background..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Why I Sell (Your Motivation)
                </label>
                <textarea
                  value={editedProfile.whyISell}
                  onChange={(e) => setEditedProfile({ ...editedProfile, whyISell: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                  placeholder="What drives you in sales? What's your 'why'?"
                />
              </div>
            </div>
          </Card>

          {/* Password Change Form */}
          {showPasswordChange && (
            <Card title="Change Password" className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Current Password
                  </label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(value) => setCurrentPassword(value)}
                    placeholder="Enter current password"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    New Password
                  </label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(value) => setNewPassword(value)}
                    placeholder="Enter new password (min 8 characters)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(value) => setConfirmPassword(value)}
                    placeholder="Confirm new password"
                  />
                </div>
                
                {passwordError && (
                  <div className="text-red-600 dark:text-red-400 text-sm">{passwordError}</div>
                )}
                
                {passwordSuccess && (
                  <div className="text-green-600 dark:text-green-400 text-sm">{passwordSuccess}</div>
                )}
                
                <div className="flex space-x-2">
                  <Button onClick={handlePasswordChange}>Change Password</Button>
                  <Button 
                    onClick={() => {
                      setShowPasswordChange(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                      setPasswordError('');
                    }} 
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;