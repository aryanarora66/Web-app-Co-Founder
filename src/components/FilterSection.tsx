import React from 'react';

interface FilterSectionProps {
  onFilterChange: (filters: any) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ onFilterChange }) => {
  const roles = ['Technical', 'Business', 'Design', 'Marketing', 'Product'];
  const industries = ['Tech', 'Healthcare', 'Finance', 'Education', 'E-commerce'];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Filters
        </span>
      </h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Role</h4>
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <button
                key={role}
                className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white transition-all duration-300 text-sm font-medium"
                onClick={() => onFilterChange({ role })}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Industry</h4>
          <div className="flex flex-wrap gap-2">
            {industries.map((industry) => (
              <button
                key={industry}
                className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white transition-all duration-300 text-sm font-medium"
                onClick={() => onFilterChange({ industry })}
              >
                {industry}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Skill Level</h4>
          <select 
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
            onChange={(e) => onFilterChange({ skillLevel: e.target.value })}
          >
            <option value="">Any level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
        </div>

        <button 
          className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
          onClick={() => onFilterChange({})}
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSection;