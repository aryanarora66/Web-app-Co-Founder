"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Globe,
  Mail,
  Briefcase,
  Github,
  Linkedin,
  Twitter,
  MessageSquare,
  Edit,
  MapPin,
  Calendar,
  ExternalLink,
  Loader2,
  Instagram,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Profile } from '../../../types/profile';
import { profileService } from '../../../services/profileService';
import SkillCard from '@/components/SkillCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import useUser from '../hooks/useUser'; // Use your existing hook

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: userLoading, error: userError } = useUser(); // Use your hook
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // Use user.id or user._id, whichever is available
      const userId = user.id || (user as any)._id;
      console.log('Fetching profile for user ID:', userId); // Debug log
      
      if (!userId) {
        throw new Error('User ID not found');
      }
      
      const profileData = await profileService.getProfile(userId);
      setProfile(profileData);
    } catch (err) {
      console.error('Profile fetch error:', err); // Debug log
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return <Github className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  // Helper function to get user initials safely - using username
  const getUserInitials = (username?: string) => {
    if (!username || typeof username !== 'string') return '??';
    // For usernames, just take first 2 characters and uppercase them
    return username.slice(0, 2).toUpperCase();
  };

  // Helper function to get display name - prefer name, fallback to username
  const getDisplayName = () => {
    return user?.name || user?.username || 'User';
  };

  // Show loading if either user or profile is loading
  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="fixed top-3 left-3 z-50 flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:px-3 sm:py-2 sm:gap-2 bg-white border border-gray-300 rounded-full sm:rounded-lg shadow-lg hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Go back"
        >
          <ArrowLeft size={16} className="text-gray-600 sm:w-[18px] sm:h-[18px]" />
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">Back</span>
        </button>
        
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
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="fixed top-3 left-3 z-50 flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:px-3 sm:py-2 sm:gap-2 bg-white border border-gray-300 rounded-full sm:rounded-lg shadow-lg hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Go back"
        >
          <ArrowLeft size={16} className="text-gray-600 sm:w-[18px] sm:h-[18px]" />
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">Back</span>
        </button>
        
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <ErrorMessage message={userError} />
        </div>
      </div>
    );
  }

  // Show error if profile fetch failed
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="fixed top-3 left-3 z-50 flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:px-3 sm:py-2 sm:gap-2 bg-white border border-gray-300 rounded-full sm:rounded-lg shadow-lg hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Go back"
        >
          <ArrowLeft size={16} className="text-gray-600 sm:w-[18px] sm:h-[18px]" />
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">Back</span>
        </button>
        
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
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="fixed top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Go back"
        >
          <ArrowLeft size={18} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">Back</span>
        </button>
        
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">Please log in to view your profile</p>
            <Link
              href="/login"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="fixed top-3 left-3 z-50 flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:px-3 sm:py-2 sm:gap-2 bg-white border border-gray-300 rounded-full sm:rounded-lg shadow-lg hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Go back"
      >
        <ArrowLeft size={16} className="text-gray-600 sm:w-[18px] sm:h-[18px]" />
        <span className="text-sm font-medium text-gray-700 hidden sm:inline">Back</span>
      </button>

      <div className="max-w-4xl mx-auto py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-8">
          {/* Profile Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 sm:mb-8 space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full lg:w-auto">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                {user.imageUrl || (user as any).profileImage ? (
                  <Image
                    src={user.imageUrl || (user as any).profileImage}
                    alt={getDisplayName()}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">
                    {getUserInitials(user.username)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {getDisplayName()}
                  </span>
                </h1>
                <p className="flex items-center text-gray-600 mt-1 text-sm sm:text-base">
                  <Briefcase className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0" />
                  <span className="break-words">{user.role || 'Role not specified'}</span>
                </p>
                {user.username && (
                  <p className="flex items-center text-gray-600 mt-1 text-sm">
                    <span className="text-gray-500">@{user.username}</span>
                  </p>
                )}
                {user.email && (
                  <p className="flex items-center text-gray-600 mt-1 text-sm">
                    <Mail className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-500">{user.email}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              <Link
                href="/edit-profile"
                className="px-3 sm:px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center text-sm sm:text-base"
              >
                <Edit className="h-4 w-4 mr-2" /> Edit Profile
              </Link>
            </div>
          </div>

          {/* Bio Section - only show if profile has bio */}
          {profile?.bio && (
            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                About Me
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base break-words">
                {profile.bio}
              </p>
            </div>
          )}

          {/* User description fallback if no profile bio */}
          {!profile?.bio && (user as any).description && (
            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                About Me
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base break-words">
                {(user as any).description}
              </p>
            </div>
          )}

          {/* Skills Section */}
          {profile?.skills && profile.skills.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Skills & Expertise
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <SkillCard
                    key={skill.id}
                    skill={skill.skill}
                    level={skill.level}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Fallback to user skills if no profile skills */}
          {(!profile?.skills || profile.skills.length === 0) && (user as any).skills && (user as any).skills.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Skills & Expertise
              </h2>
              <div className="flex flex-wrap gap-2">
                {(user as any).skills.map((skill: any, index: number) => (
                  <SkillCard
                    key={index}
                    skill={skill.skill}
                    level={skill.level}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          {((profile?.socialLinks && profile.socialLinks.length > 0) || 
            profile?.website || 
            (user as any).instagramUrl) && (
            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Globe className="h-5 w-5 mr-2 text-blue-600" />
                Connect With Me
              </h2>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {profile?.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 sm:px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center text-sm sm:text-base"
                  >
                    <Globe className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">Website</span>
                  </a>
                )}
                {(user as any).instagramUrl && (
                  <a
                    href={(user as any).instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center text-sm sm:text-base"
                  >
                    <Instagram className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">Instagram</span>
                  </a>
                )}
                {profile?.socialLinks?.map((link: Profile["socialLinks"][number]) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center text-sm sm:text-base"
                  >
                    {getSocialIcon(link.platform)}
                    <span className="ml-2 truncate capitalize">
                      {link.platform}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {profile?.projects && profile.projects.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Current Projects
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {profile.projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"
                  >
                    <h3 className="font-medium text-blue-600 mb-1 break-words">
                      {project.title}
                    </h3>
                    <p className="text-gray-700 text-sm mb-2 break-words">
                      {project.description}
                    </p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {project.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-white text-blue-600 text-xs rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm hover:underline flex items-center"
                      >
                        Learn More
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What I'm Looking For */}
          {(user as any).lookingFor && (user as any).lookingFor.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                What I'm Looking For
              </h2>
              <div className="flex flex-wrap gap-2">
                {(user as any).lookingFor.map((item: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 border-t pt-6">
            <button className="px-6 py-2 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed flex items-center justify-center text-sm sm:text-base">
              <MessageSquare className="h-4 w-4 mr-2" /> Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}