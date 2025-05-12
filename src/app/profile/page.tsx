"use client";
import { Globe, Mail, Briefcase, Github, Linkedin, Twitter, MessageSquare, Edit } from 'lucide-react';
import Link from 'next/link';
import SkillCard from '@/components/SkillCard';

export default function ProfilePage() {
  const profile = {
    name: 'John Doe',
    role: 'Technical Founder',
    bio: 'Full-stack developer passionate about building scalable startups. Currently working on an AI-powered analytics platform.',
    skills: [
      { skill: 'React', level: 'Expert' as 'Expert' },
      { skill: 'Node.js', level: 'Advanced' as 'Advanced' },
      { skill: 'AWS', level: 'Intermediate' as 'Intermediate' },
    ] as Array<{ skill: string; level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' }>,
    socialLinks: {
      github: 'https://github.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      twitter: 'https://twitter.com/johndoe'
    },
    website: 'https://johndoe.com',
    projects: [
      {
        title: 'AI Analytics Platform',
        description: 'Next-gen analytics solution powered by machine learning',
        url: 'https://aianalytics.com'
      },
      {
        title: 'DevTools Suite',
        description: 'Open source developer productivity toolkit',
        url: 'https://devtools.com'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div className="flex items-center space-x-6">
              <div className="h-24 w-24 rounded-full bg-blue-50 flex items-center justify-center">
                <div className="text-2xl font-bold text-blue-600">JD</div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {profile.name}
                  </span>
                </h1>
                <p className="flex items-center text-gray-600 mt-1">
                  <Briefcase className="h-4 w-4 mr-2 text-blue-600" />
                  {profile.role}
                </p>
              </div>
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link
                href="/edit-profile"
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" /> Edit Profile
              </Link>
            </div>
          </div>

          {/* Bio Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">About Me</h2>
            <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
          </div>

          {/* Skills Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills & Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <SkillCard key={index} skill={skill.skill} level={skill.level} />
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Globe className="h-5 w-5 mr-2 text-blue-600" />
              Connect With Me
            </h2>
            <div className="flex flex-wrap gap-3">
              <a
                href={profile.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
              >
                <Github className="h-4 w-4 mr-2" /> GitHub
              </a>
              <a
                href={profile.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center"
              >
                <Linkedin className="h-4 w-4 mr-2" /> LinkedIn
              </a>
              <a
                href={profile.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center"
              >
                <Twitter className="h-4 w-4 mr-2" /> Twitter
              </a>
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center"
              >
                <Globe className="h-4 w-4 mr-2" /> Personal Website
              </a>
            </div>
          </div>

          {/* Projects Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.projects.map((project, index) => (
                <div
                  key={index}
                  className="bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"
                >
                  <h3 className="font-medium text-blue-600 mb-1">{project.title}</h3>
                  <p className="text-gray-700 text-sm mb-2">{project.description}</p>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Learn More →
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 border-t pt-6">
            <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center">
              <MessageSquare className="h-4 w-4 mr-2" /> Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}