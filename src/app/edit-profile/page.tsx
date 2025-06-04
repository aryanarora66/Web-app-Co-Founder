"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Camera,
  Mail,
  Globe,
  Lock,
  User,
  Briefcase,
  X,
  Plus,
  Trash2,
  Save,
  Loader2,
} from 'lucide-react';
import { Profile, UpdateProfileData, Skill, SocialLink, Project } from '../../../types/profile';
import { profileService } from '../../../services/profileService';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import ConfirmDialog from '@/components/ConfirmDialog';
import useUser from '../hooks/useUser';

export default function EditProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, loading: userLoading, error: userError } = useUser();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newSocialLink, setNewSocialLink] = useState({
    platform: '',
    url: '',
  });
  const [newSkill, setNewSkill] = useState({
    skill: '',
    level: 'Beginner' as const,
  });
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    url: '',
    technologies: [] as string[],
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) {
      setError('User not found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Use user.id or user._id, whichever is available
      const userId = user.id || (user as any)._id;
      console.log('Fetching profile for user ID:', userId);
      console.log('User object:', user);
      
      if (!userId) {
        throw new Error('User ID not found');
      }
      
      const profileData = await profileService.getProfile(userId);
      setProfile(profileData);
    } catch (err) {
      console.error('Profile fetch error:', err);
      // Initialize empty profile if none exists
      if (err instanceof Error && err.message.includes('not found')) {
        setProfile({
          id: user.id || (user as any)._id,
          name: '',
          email: user.email,
          role: user.role || '',
          bio: '',
          website: '',
          skills: [],
          socialLinks: [],
          projects: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          username: user.username,
          profileImage: undefined
        });
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !user) return;

    const userId = user.id || (user as any)._id;
    if (!userId) {
      setError('User ID not found');
      return;
    }

    try {
      setSaving(true);
      const updateData: UpdateProfileData = {
        name: profile.name || user.username, // Use username as fallback
        role: profile.role || user.role,
        bio: profile.bio || '',
        website: profile.website || '',
        skills: profile.skills?.map(({ id, ...skill }: Skill) => skill) || [],
        socialLinks: profile.socialLinks?.map(({ id, ...link }) => link) || [],
        projects: profile.projects?.map(({ id, ...project }) => project) || [],
      };

      await profileService.updateProfile(userId, updateData);
      router.push('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!user) return;
    
    const userId = user.id || (user as any)._id;
    if (!userId) return;

    try {
      setUploading(true);
      const imageUrl = await profileService.uploadProfileImage(userId, file);
      setProfile(prev => prev ? { ...prev, profileImage: imageUrl } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    const userId = user.id || (user as any)._id;
    if (!userId) return;

    try {
      await profileService.deleteProfile(userId);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
    }
  };

  const addSkill = () => {
    if (!profile || !newSkill.skill.trim()) return;
    
    const skill: Skill = {
      id: Date.now().toString(),
      skill: newSkill.skill.trim(),
      level: newSkill.level,
    };
    
    setProfile({
      ...profile,
      skills: [...(profile.skills || []), skill],
    });
    
    setNewSkill({ skill: '', level: 'Beginner' });
  };

  const removeSkill = (skillId: string) => {
    if (!profile) return;
    setProfile({
      ...profile,
      skills: (profile.skills || []).filter(skill => skill.id !== skillId),
    });
  };

  const addSocialLink = () => {
    if (!profile || !newSocialLink.platform.trim() || !newSocialLink.url.trim()) return;
    
    const socialLink: SocialLink = {
      id: Date.now().toString(),
      platform: newSocialLink.platform.trim(),
      url: newSocialLink.url.trim(),
    };
    
    setProfile({
      ...profile,
      socialLinks: [...(profile.socialLinks || []), socialLink],
    });
    
    setNewSocialLink({ platform: '', url: '' });
  };

  const removeSocialLink = (linkId: string) => {
    if (!profile) return;
    setProfile({
      ...profile,
      socialLinks: (profile.socialLinks || []).filter(link => link.id !== linkId),
    });
  };

  const addProject = () => {
    if (!profile || !newProject.title.trim() || !newProject.description.trim()) return;
    
    const project: Project = {
      id: Date.now().toString(),
      title: newProject.title.trim(),
      description: newProject.description.trim(),
      url: newProject.url.trim(),
      technologies: newProject.technologies,
    };
    
    setProfile({
      ...profile,
      projects: [...(profile.projects || []), project],
    });
    
    setNewProject({
      title: '',
      description: '',
      url: '',
      technologies: [],
    });
  };

  const removeProject = (projectId: string) => {
    if (!profile) return;
    setProfile({
      ...profile,
      projects: (profile.projects || []).filter(project => project.id !== projectId),
    });
  };

  // Show loading if either user or profile is loading
  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Show error if user fetch failed
  if (userError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <ErrorMessage message={userError} />
        </div>
      </div>
    );
  }

  // Show error if profile fetch failed
  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <ErrorMessage message={error} onRetry={fetchProfile} />
        </div>
      </div>
    );
  }

  // If no user, show not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">Please log in to edit your profile</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">Profile not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <h1 className="text-xl sm:text-2xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Edit Profile
              </span>
            </h1>
            <Link 
              href="/profile" 
              className="text-gray-500 hover:text-blue-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </Link>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Debug info
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Debug Info:</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <div>User ID: {user.id || (user as any)._id || 'undefined'}</div>
              <div>Username: {user.username || 'undefined'}</div>
              <div>Profile Loaded: {profile ? 'Yes' : 'No'}</div>
              <div>Profile Name: {profile?.name || 'undefined'}</div>
              <div>Profile Bio: {profile?.bio || 'undefined'}</div>
            </div>
          </div> */}

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Profile Picture Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Camera className="h-5 w-5 mr-2 text-blue-600" />
                Profile Picture
              </h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {uploading ? (
                    <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                  ) : profile.profileImage ? (
                    <Image
                      src={profile.profileImage}
                      alt={profile.name || user.username || 'Profile'}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Upload New Photo'}
                </button>
              </div>
            </div>

            {/* Personal Info Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user.username || ''}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    title="Username cannot be changed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={profile.name || ''}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                    placeholder="How you want to be displayed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    required
                    value={profile.role || user.role || ''}
                    onChange={(e) => setProfile({...profile, role: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  >
                    <option value="">Select your role</option>
                    <option value="founder">Founder</option>
                    <option value="cofounder">Co-founder</option>
                    <option value="developer">Developer</option>
                    <option value="designer">Designer</option>
                    <option value="marketer">Marketer</option>
                    <option value="investor">Investor</option>
                    <option value="advisor">Advisor</option>
                    <option value="product">Product Manager</option>
                    <option value="operations">Operations</option>
                    <option value="sales">Sales</option>
                    <option value="finance">Finance</option>
                    <option value="customer_success">Customer Success</option>
                    <option value="data_scientist">Data Scientist</option>
                    <option value="growth_hacker">Growth Hacker</option>
                    <option value="legal">Legal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email || ''}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    title="Email cannot be changed here"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={profile.website || ''}
                    onChange={(e) => setProfile({...profile, website: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                    placeholder="https://your-website.com"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={profile.bio || ''}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 h-24 sm:h-32 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
              
              <div className="space-y-3">
                {(profile.skills || []).map((skill) => (
                  <div key={skill.id} className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="text"
                      value={skill.skill}
                      onChange={(e) => {
                        const updatedSkills = (profile.skills || []).map(s =>
                          s.id === skill.id ? { ...s, skill: e.target.value } : s
                        );
                        setProfile({ ...profile, skills: updatedSkills });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm"
                    />
                    <select
                      value={skill.level}
                      onChange={(e) => {
                        const updatedSkills = (profile.skills || []).map(s =>
                          s.id === skill.id ? { ...s, level: e.target.value as any } : s
                        );
                        setProfile({ ...profile, skills: updatedSkills });
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm w-full sm:w-auto"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill.id)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <input
                    type="text"
                    value={newSkill.skill}
                    onChange={(e) => setNewSkill({ ...newSkill, skill: e.target.value })}
                    placeholder="Add new skill"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm"
                  />
                  <select
                    value={newSkill.level}
                    onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value as any })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm w-full sm:w-auto"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center text-sm"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </button>
                </div>
              </div>
            </div>

            {/* Social Links Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Globe className="h-5 w-5 mr-2 text-blue-600" />
                Social Links
              </h2>
              
              <div className="space-y-3">
                {(profile.socialLinks || []).map((link) => (
                  <div key={link.id} className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="text"
                      value={link.platform}
                      onChange={(e) => {
                        const updatedLinks = (profile.socialLinks || []).map(l =>
                          l.id === link.id ? { ...l, platform: e.target.value } : l
                        );
                        setProfile({ ...profile, socialLinks: updatedLinks });
                      }}
                      className="w-full sm:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm"
                      placeholder="Platform"
                    />
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => {
                        const updatedLinks = (profile.socialLinks || []).map(l =>
                          l.id === link.id ? { ...l, url: e.target.value } : l
                        );
                        setProfile({ ...profile, socialLinks: updatedLinks });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm"
                      placeholder="URL"
                    />
                    <button
                      type="button"
                      onClick={() => removeSocialLink(link.id)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <input
                    type="text"
                    value={newSocialLink.platform}
                    onChange={(e) => setNewSocialLink({ ...newSocialLink, platform: e.target.value })}
                    placeholder="Platform (e.g., GitHub)"
                    className="w-full sm:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm"
                  />
                  <input
                    type="url"
                    value={newSocialLink.url}
                    onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
                    placeholder="URL"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm"
                  />
                  <button
                    type="button"
                    onClick={addSocialLink}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center text-sm"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </button>
                </div>
              </div>
            </div>

            {/* Projects Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
              
              <div className="space-y-4">
                {(profile.projects || []).map((project) => (
                  <div key={project.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) => {
                            const updatedProjects = (profile.projects || []).map(p =>
                              p.id === project.id ? { ...p, title: e.target.value } : p
                            );
                            setProfile({ ...profile, projects: updatedProjects });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm"
                          placeholder="Project title"
                        />
                        <textarea
                          value={project.description}
                          onChange={(e) => {
                            const updatedProjects = (profile.projects || []).map(p =>
                              p.id === project.id ? { ...p, description: e.target.value } : p
                            );
                            setProfile({ ...profile, projects: updatedProjects });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm h-20 resize-none"
                          placeholder="Project description"
                        />
                        <input
                          type="url"
                          value={project.url}
                          onChange={(e) => {
                            const updatedProjects = (profile.projects || []).map(p =>
                              p.id === project.id ? { ...p, url: e.target.value } : p
                            );
                            setProfile({ ...profile, projects: updatedProjects });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm"
                          placeholder="Project URL"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeProject(project.id)}
                        className="ml-3 text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg space-y-3">
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    placeholder="New project title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm"
                  />
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Project description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm h-20 resize-none"
                  />
                  <input
                    type="url"
                    value={newProject.url}
                    onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                    placeholder="Project URL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm"
                  />
                  <button
                    type="button"
                    onClick={addProject}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center text-sm"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Project
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="px-6 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm sm:text-base"
              >
                Delete Account
              </button>
              
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone."
        confirmText="Delete Account"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}