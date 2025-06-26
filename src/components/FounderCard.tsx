'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Globe,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  Code,
  Users,
  Award,
  UserPlus,
  CheckCircle,
  Clock,
  MessageSquare,
  X
} from 'lucide-react';

// Simple interfaces matching your User model
interface Skill {
  skill: string;
  level: string;
}

interface FounderCardProps {
  _id: string;
  name?: string;
  username: string;
  email: string;
  role: string;
  skills?: Skill[];
  description?: string;
  bio?: string;
  lookingFor?: string[];
  profileImage?: string;
  website?: string;
  location?: string;
  createdAt?: string;
  instagramUrl?: string;
  socialLinks?: Array<{platform: string; url: string}>;
}

const FounderCard: React.FC<FounderCardProps> = ({
  _id,
  name,
  username,
  email,
  role,
  skills = [],
  description,
  bio,
  lookingFor = [],
  profileImage,
  website,
  location,
  createdAt,
  instagramUrl,
  socialLinks = []
}) => {
  const [connectionStatus, setConnectionStatus] = useState('none');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRequester, setIsRequester] = useState(false);
  const [connectionId, setConnectionId] = useState<string | null>(null);

  // Debug: Log the props to see what data we're getting
  useEffect(() => {
    console.log('FounderCard received props:', {
      _id,
      name,
      username,
      skills: skills?.length || 0,
      profileImage: !!profileImage,
      bio: !!bio,
      description: !!description,
      socialLinks: socialLinks?.length || 0
    });
  }, []);

  // Check connection status on mount
  useEffect(() => {
    const checkConnectionStatus = async () => {
      try {
        const response = await fetch(`/api/connections/status?userId=${_id}`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Connection status:', data); // Debug log
          setConnectionStatus(data.status === 'accepted' ? 'connected' : data.status);
          setIsRequester(data.isRequester);
          setConnectionId(data.connectionId);
        } else {
          console.log('Connection status check failed:', response.status);
        }
      } catch (error) {
        console.error('Error checking connection status:', error);
      }
    };

    if (_id) {
      checkConnectionStatus();
    }
  }, [_id]);

  // Connection handlers
  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      console.log('Sending connection request to:', _id); // Debug log
      const response = await fetch('/api/connections/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          recipientId: _id,
          message: `Hi ${name || username}, I'd like to connect with you!`
        }),
      });

      const data = await response.json();
      console.log('Connection response:', data); // Debug log

      if (response.ok) {
        setConnectionStatus('pending');
        setIsRequester(true);
        setConnectionId(data.connectionId);
      } else {
        console.error('Failed to send connection request:', data.error);
        alert(`Failed to send connection request: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Connection error:', error);
      alert('Failed to send connection request. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnectionResponse = async (action: 'accept' | 'reject') => {
    if (!connectionId) return;
    
    setIsConnecting(true);
    try {
      const response = await fetch(`/api/connections/${connectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        setConnectionStatus(action === 'accept' ? 'connected' : 'none');
        if (action === 'reject') {
          setConnectionId(null);
        }
      } else {
        console.error(`Failed to ${action} connection request`);
        alert(`Failed to ${action} connection request`);
      }
    } catch (error) {
      console.error(`Error ${action}ing connection request:`, error);
      alert(`Failed to ${action} connection request`);
    } finally {
      setIsConnecting(false);
    }
  };

  // Helper functions
  const getDisplayName = () => name || username;
  const getDisplayBio = () => bio || description || '';
  
  const getUserInitials = () => {
    const displayName = getDisplayName();
    return displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatRole = (role: string) => {
    return role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short'
    }).format(new Date(dateString));
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-blue-50 text-blue-600';
      case 'intermediate':
        return 'bg-indigo-50 text-indigo-600';
      case 'advanced':
        return 'bg-purple-50 text-purple-600';
      case 'expert':
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6">
        {/* Profile Section */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-200 to-indigo-200 flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <Image 
                  src={profileImage} 
                  alt={getDisplayName()} 
                  width={64} 
                  height={64} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold text-indigo-600">
                  {getUserInitials()}
                </span>
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate">
              {getDisplayName()}
            </h3>
            <p className="text-sm text-gray-500">@{username}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs">
                <Briefcase className="h-3 w-3" />
                {formatRole(role)}
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        {getDisplayBio() && (
          <div className="mb-4">
            <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
              {getDisplayBio()}
            </p>
          </div>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <Code className="h-4 w-4" />
              Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 4).map((skill, index) => (
                <div key={index} className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(skill.level)}`}>
                  {skill.skill}
                </div>
              ))}
              {skills.length > 4 && (
                <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                  +{skills.length - 4} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* Looking For */}
        {lookingFor && lookingFor.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <Users className="h-4 w-4" />
              Looking For
            </h4>
            <div className="flex flex-wrap gap-2">
              {lookingFor.slice(0, 3).map((item, index) => (
                <span key={index} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                  {item}
                </span>
              ))}
              {lookingFor.length > 3 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                  +{lookingFor.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Social Links */}
        {(website || instagramUrl || (socialLinks && socialLinks.length > 0)) && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <Globe className="h-4 w-4" />
              Links
            </h4>
            <div className="flex flex-wrap gap-2">
              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors"
                >
                  <Globe className="h-3 w-3" />
                  Website
                </a>
              )}
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs hover:bg-pink-200 transition-colors"
                >
                  <Instagram className="h-3 w-3" />
                  Instagram
                </a>
              )}
              {socialLinks && socialLinks.slice(0, 2).map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors"
                >
                  {link.platform.toLowerCase() === 'github' && <Github className="h-3 w-3" />}
                  {link.platform.toLowerCase() === 'linkedin' && <Linkedin className="h-3 w-3" />}
                  {link.platform.toLowerCase() === 'twitter' && <Twitter className="h-3 w-3" />}
                  {!['github', 'linkedin', 'twitter'].includes(link.platform.toLowerCase()) && <Globe className="h-3 w-3" />}
                  <span className="capitalize">{link.platform}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {location}
            </span>
          )}
          {createdAt && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Joined {formatDate(createdAt)}
            </span>
          )}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex gap-3">
          {connectionStatus === 'pending' && !isRequester ? (
            // Show accept/reject buttons if user received the request
            <>
              <button
                onClick={() => handleConnectionResponse('accept')}
                disabled={isConnecting}
                className="flex-1 py-2 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm"
              >
                {isConnecting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Accept
                  </>
                )}
              </button>
              <button
                onClick={() => handleConnectionResponse('reject')}
                disabled={isConnecting}
                className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm flex items-center justify-center gap-2"
              >
                <X className="h-4 w-4" />
                Decline
              </button>
            </>
          ) : (
            // Regular connect button or status display
            <button
              onClick={handleConnect}
              disabled={isConnecting || connectionStatus !== 'none'}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                connectionStatus === 'connected'
                  ? 'bg-green-100 text-green-700 cursor-default'
                  : connectionStatus === 'pending'
                  ? 'bg-yellow-100 text-yellow-700 cursor-default'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
              } ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isConnecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Connecting...
                </>
              ) : connectionStatus === 'connected' ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Connected
                </>
              ) : connectionStatus === 'pending' ? (
                <>
                  <Clock className="h-4 w-4" />
                  {isRequester ? 'Request Sent' : 'Request Received'}
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Connect
                </>
              )}
            </button>
          )}
          
          <Link
            href={`mailto:${email}`}
            className="flex-1 py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm flex items-center justify-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Coming Soon
          </Link>
        </div>
        
        <div className="mt-3 text-center">
          {/* <Link
            href={`/founders/${_id}`}
            className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
          >
            View Full Profile
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default FounderCard;