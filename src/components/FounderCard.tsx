import React from 'react';
import SkillCard from './SkillCard';

interface FounderCardProps {
  name: string;
  role: string;
  skills: { skill: string; level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' }[];
  bio: string;
  lookingFor: string[];
}

const FounderCard: React.FC<FounderCardProps> = ({ name, role, skills, bio, lookingFor }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {name}
              </span>
            </h3>
            <p className="text-gray-600 mt-1">{role}</p>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg">
            Connect
          </button>
        </div>
        
        <p className="mt-4 text-gray-700 leading-relaxed">{bio}</p>
        
        <div className="mt-6">
          <h4 className="font-semibold text-gray-900 mb-2">Looking for:</h4>
          <ul className="space-y-1 text-gray-700">
            {lookingFor.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-6">
          <h4 className="font-semibold text-gray-900 mb-3">Skills:</h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <SkillCard key={index} skill={skill.skill} level={skill.level} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FounderCard;