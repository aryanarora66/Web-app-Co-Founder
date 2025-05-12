// components/FounderCard.tsx
import React from 'react';
import Image from 'next/image';

interface Skill {
  skill: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

interface FounderCardProps {
  name: string;
  role: string;
  skills?: Skill[];
  bio?: string;
  lookingFor?: string[];
  profileImage?: string;
}

const FounderCard: React.FC<FounderCardProps> = ({
  name,
  role,
  skills = [],
  bio = "",
  lookingFor = [],
  profileImage
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-200 to-indigo-200 flex items-center justify-center overflow-hidden">
            {profileImage ? (
              <Image 
                src={profileImage} 
                alt={name} 
                width={64} 
                height={64} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-indigo-600">
                {name.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
            <p className="text-indigo-600 font-medium">{role}</p>
          </div>
        </div>
        
        {skills.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skillItem, index) => (
                <div key={index} className="bg-blue-50 px-3 py-1 rounded-full text-sm text-blue-700 flex items-center">
                  <span>{skillItem.skill}</span>
                  <span className="ml-1 text-xs bg-blue-100 px-1.5 py-0.5 rounded-full">
                    {skillItem.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {bio && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-600 mb-2">About</h4>
            <p className="text-gray-700">{bio}</p>
          </div>
        )}
        
        {lookingFor.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Looking for</h4>
            <div className="flex flex-wrap gap-2">
              {lookingFor.map((item, index) => (
                <span key={index} className="bg-indigo-50 px-3 py-1 rounded-full text-sm text-indigo-700">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <button className="w-full py-2 text-blue-600 hover:text-blue-700 font-medium text-sm focus:outline-none transition-colors">
          Connect with {name.split(' ')[0]}
        </button>
      </div>
    </div>
  );
};

export default FounderCard;
