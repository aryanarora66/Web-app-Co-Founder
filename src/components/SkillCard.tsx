import React from 'react';

interface SkillCardProps {
  skill: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, level }) => {
  const getLevelColor = () => {
    switch (level) {
      case 'Beginner':
        return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'Intermediate':
        return 'bg-indigo-50 text-indigo-600 border border-indigo-100';
      case 'Advanced':
        return 'bg-purple-50 text-purple-600 border border-purple-100';
      case 'Expert':
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0';
      default:
        return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-3 flex flex-col items-center border border-gray-200 hover:shadow-md transition-shadow duration-300">
      <span className="font-medium text-gray-800">{skill}</span>
      <span className={`text-xs font-semibold px-3 py-1 rounded-full mt-2 ${getLevelColor()} transition-all duration-200`}>
        {level}
      </span>
    </div>
  );
};

export default SkillCard;