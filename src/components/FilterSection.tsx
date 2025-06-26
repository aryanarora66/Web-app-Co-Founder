import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  X, 
  Code, 
  Palette, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Award,
  Building,
  Zap,
  Target,
  Shield,
  BarChart,
  Gavel,
  Briefcase
} from 'lucide-react';

interface FilterSectionProps {
  onFilterChange: (filters: any) => void;
}

interface ExpandedSections {
  role: boolean;
  skills: boolean;
  experience: boolean;
  availability: boolean;
  other: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({ onFilterChange }) => {
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    role: true,
    skills: true,
    experience: false,
    availability: false,
    other: false
  });

  const [activeFilters, setActiveFilters] = useState<any>({});

  const roles = [
    { value: 'founder', label: 'Founder', icon: Users },
    { value: 'cofounder', label: 'Co-founder', icon: Users },
    { value: 'developer', label: 'Developer', icon: Code },
    { value: 'designer', label: 'Designer', icon: Palette },
    { value: 'marketer', label: 'Marketer', icon: TrendingUp },
    { value: 'product', label: 'Product Manager', icon: Award },
    { value: 'finance', label: 'Finance', icon: DollarSign },
    { value: 'operations', label: 'Operations', icon: Building },
    { value: 'sales', label: 'Sales', icon: Target },
    { value: 'investor', label: 'Investor', icon: DollarSign },
    { value: 'advisor', label: 'Advisor', icon: Shield },
    { value: 'growth_hacker', label: 'Growth Hacker', icon: Zap },
    { value: 'data_scientist', label: 'Data Scientist', icon: BarChart },
    { value: 'customer_success', label: 'Customer Success', icon: Shield },
    { value: 'legal', label: 'Legal', icon: Gavel }
  ];

  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const toggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterToggle = (filterType: string, value: string) => {
    const newFilters = { ...activeFilters };
    
    if (filterType === 'role') {
      newFilters.role = newFilters.role === value ? '' : value;
    } else if (filterType === 'skillLevel') {
      newFilters.skillLevel = newFilters.skillLevel === value ? '' : value;
    } else {
      newFilters[filterType] = !newFilters[filterType];
    }
    
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    onFilterChange({});
  };

  const activeFilterCount = Object.values(activeFilters).filter(v => v).length;

  const SectionHeader = ({ title, section, count }: { title: string; section: keyof ExpandedSections; count?: number }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
    >
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-800">{title}</span>
        {count !== undefined && count > 0 && (
          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
            {count}
          </span>
        )}
      </div>
      {expandedSections[section] ? (
        <ChevronUp className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
      ) : (
        <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
      )}
    </button>
  );

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Filters
          </span>
        </h3>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors"
          >
            <X className="h-3 w-3" />
            Clear ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Role Filter */}
      <div className="space-y-2">
        <SectionHeader title="Role" section="role" />
        {expandedSections.role && (
          <div className="pl-2 space-y-2 max-h-64 overflow-y-auto">
            {roles.map((role) => {
              const Icon = role.icon;
              const isActive = activeFilters.role === role.value;
              return (
                <button
                  key={role.value}
                  onClick={() => handleFilterToggle('role', role.value)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  <span className="text-sm font-medium">{role.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Skill Level Filter */}
      <div className="space-y-2">
        <SectionHeader title="Skill Level" section="skills" />
        {expandedSections.skills && (
          <div className="pl-2 space-y-2">
            {skillLevels.map((level) => {
              const isActive = activeFilters.skillLevel === level;
              return (
                <button
                  key={level}
                  onClick={() => handleFilterToggle('skillLevel', level)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                >
                  <span className="text-sm font-medium">{level}</span>
                  <div className={`w-2 h-2 rounded-full ${
                    level === 'Beginner' ? 'bg-blue-400' :
                    level === 'Intermediate' ? 'bg-indigo-400' :
                    level === 'Advanced' ? 'bg-purple-400' :
                    'bg-gradient-to-r from-blue-500 to-indigo-500'
                  } ${isActive ? 'bg-white' : ''}`} />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Experience Filter */}
      <div className="space-y-2">
        <SectionHeader title="Experience" section="experience" />
        {expandedSections.experience && (
          <div className="pl-2 space-y-2">
            {[
              { key: 'hasProjects', label: 'Has Projects', desc: 'Members with portfolio projects' },
              { key: 'hasSocialLinks', label: 'Active Online', desc: 'Members with social profiles' },
            ].map((filter) => {
              const isActive = activeFilters[filter.key];
              return (
                <button
                  key={filter.key}
                  onClick={() => handleFilterToggle(filter.key, filter.key)}
                  className={`w-full p-3 rounded-lg text-left transition-all duration-200 border ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{filter.label}</div>
                      <div className={`text-xs ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                        {filter.desc}
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      isActive 
                        ? 'border-white bg-white' 
                        : 'border-gray-400'
                    }`}>
                      {isActive && <div className="w-2 h-2 bg-blue-600 rounded" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Availability Filter */}
      <div className="space-y-2">
        <SectionHeader title="Availability" section="availability" />
        {expandedSections.availability && (
          <div className="pl-2 space-y-2">
            {[
              { key: 'recentlyActive', label: 'Recently Active', desc: 'Joined in the last 30 days' },
              { key: 'lookingForCofounder', label: 'Seeking Co-founder', desc: 'Actively looking for partnerships' },
            ].map((filter) => {
              const isActive = activeFilters[filter.key];
              return (
                <button
                  key={filter.key}
                  onClick={() => handleFilterToggle(filter.key, filter.key)}
                  className={`w-full p-3 rounded-lg text-left transition-all duration-200 border ${
                    isActive
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-500 shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{filter.label}</div>
                      <div className={`text-xs ${isActive ? 'text-green-100' : 'text-gray-500'}`}>
                        {filter.desc}
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      isActive ? 'bg-white' : 'bg-green-400'
                    }`} />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="pt-4 border-t border-gray-200">
        <div className="space-y-2">
          <button
            onClick={() => handleFilterToggle('role', 'developer')}
            className="w-full p-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
          >
            <Code className="h-4 w-4" />
            Find Developers
          </button>
          <button
            onClick={() => handleFilterToggle('role', 'designer')}
            className="w-full p-2 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-2"
          >
            <Palette className="h-4 w-4" />
            Find Designers
          </button>
          <button
            onClick={() => {
              const newFilters = { hasProjects: true, hasSocialLinks: true };
              setActiveFilters(newFilters);
              onFilterChange(newFilters);
            }}
            className="w-full p-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-2"
          >
            <Award className="h-4 w-4" />
            Experienced Only
          </button>
        </div>
      </div>

      {/* Applied Filters Summary */}
      {activeFilterCount > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-2">Active Filters:</div>
          <div className="flex flex-wrap gap-1">
            {Object.entries(activeFilters).map(([key, value]) => {
              if (!value) return null;
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                >
                  {typeof value === 'string' ? value : key.replace(/([A-Z])/g, ' $1').trim()}
                  <button
                    onClick={() => handleFilterToggle(key, typeof value === 'string' ? value : key)}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;