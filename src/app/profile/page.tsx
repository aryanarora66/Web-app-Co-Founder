"use client";
import { useState, useEffect } from 'react';
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
  const { user, loading: userLoading, error: userError } = useUser(); // Use your hook
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const profileData = await profileService.getProfile(user.id);
      setProfile(profileData);
    } catch (err) {
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
  if (error) {
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
          <div className="text-center">Please log in to view your profile</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-8">
          {/* Profile Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 sm:mb-8 space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full lg:w-auto">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                {user.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt={user.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">
                    {user.name
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {user.name}
                  </span>
                </h1>
                <p className="flex items-center text-gray-600 mt-1 text-sm sm:text-base">
                  <Briefcase className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0" />
                  <span className="break-words">{user.role}</span>
                </p>
                <p className="flex items-center text-gray-600 mt-1 text-sm">
                  <span className="text-gray-500">@{user.username}</span>
                </p>
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

          {/* Social Links */}
          {((profile?.socialLinks && profile.socialLinks.length > 0) || 
            profile?.website || 
            user.instagramUrl) && (
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
                {user.instagramUrl && (
                  <a
                    href={user.instagramUrl}
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
                    {project.technologies.length > 0 && (
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
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm hover:underline flex items-center"
                    >
                      Learn More
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 border-t pt-6">
            <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center text-sm sm:text-base">
              <MessageSquare className="h-4 w-4 mr-2" /> Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}