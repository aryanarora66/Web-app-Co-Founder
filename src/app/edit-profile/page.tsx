"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Camera, Mail, Globe, Lock, User, Briefcase, X } from 'lucide-react';

export default function EditProfilePage() {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@networty.com',
    bio: 'Full-stack developer passionate about building scalable startups',
    role: 'Technical Founder',
    website: 'https://johndoe.com',
    socialLinks: ['https://github.com/johndoe', 'https://linkedin.com/in/johndoe']
  });

  const [newSocialLink, setNewSocialLink] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  const addSocialLink = () => {
    if (newSocialLink) {
      setProfile({...profile, socialLinks: [...profile.socialLinks, newSocialLink]});
      setNewSocialLink('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Edit Profile
              </span>
            </h1>
            <Link href="/profile" className="text-gray-500 hover:text-blue-600">
              <X className="h-6 w-6" />
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Picture Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Camera className="h-5 w-5 mr-2 text-blue-600" />
                Profile Picture
              </h2>
              <div className="flex items-center space-x-4">
                <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-gray-400" />
                </div>
                <button
                  type="button"
                  className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Upload New Photo
                </button>
              </div>
            </div>

            {/* Personal Info Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    value={profile.role}
                    onChange={(e) => setProfile({...profile, role: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 h-32"
                  />
                </div>
              </div>
            </div>

            {/* Social Links Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Globe className="h-5 w-5 mr-2 text-blue-600" />
                Social Links
              </h2>
              
              <div className="space-y-2">
                {profile.socialLinks.map((link, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={link}
                      onChange={(e) => {
                        const newLinks = [...profile.socialLinks];
                        newLinks[index] = e.target.value;
                        setProfile({...profile, socialLinks: newLinks});
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newLinks = profile.socialLinks.filter((_, i) => i !== index);
                        setProfile({...profile, socialLinks: newLinks});
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newSocialLink}
                    onChange={(e) => setNewSocialLink(e.target.value)}
                    placeholder="Add new social link"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  />
                  <button
                    type="button"
                    onClick={addSocialLink}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Account Security Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Lock className="h-5 w-5 mr-2 text-blue-600" />
                Account Security
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      Change
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="2fa" className="rounded text-blue-600" />
                  <label htmlFor="2fa" className="text-sm text-gray-700">
                    Enable Two-Factor Authentication
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="px-6 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Delete Account
              </button>
              
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}