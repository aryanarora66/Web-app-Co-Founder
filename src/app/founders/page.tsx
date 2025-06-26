"use client"
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import FounderCard from '@/components/FounderCard';
import SearchBar from '@/components/SearchBar';
import FilterSection from '@/components/FilterSection';
import Link from 'next/link';
import { Users, Filter, Search, Grid, List, SortDesc } from 'lucide-react';

// Define types based on the database model
interface Skill {
  skill: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  url?: string;
  technologies: string[];
}

interface User {
  _id: string;
  name?: string;
  username: string;
  email: string;
  role: string;
  profileImage?: string;
  description?: string;
  skills?: Skill[];
  lookingFor?: string[];
  website?: string;
  socialLinks?: SocialLink[];
  projects?: Project[];
  createdAt?: string;
  instagramUrl?: string;
  bio?: string;
}

const FoundersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<any>({});
  const [founders, setFounders] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'alphabetical' | 'role'>('newest');
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    const fetchFounders = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setFounders(data.data);
      } catch (err) {
        console.error('Error fetching founders:', err);
        setError('Failed to load founders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFounders();
  }, []);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
  };

  const clearAllFilters = () => {
    setFilters({});
    setSearchQuery('');
  };
  
  const filteredFounders = founders.filter(founder => {
    const matchesSearch = 
      founder.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      founder.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      founder.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      founder.skills?.some(skill => skill.skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      founder.lookingFor?.some(item => item.toLowerCase().includes(searchQuery.toLowerCase())) ||
      founder.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      founder.bio?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      
      if (key === 'role') {
        return founder.role?.toLowerCase().includes(value.toString().toLowerCase());
      }
      
      if (key === 'skillLevel' && founder.skills) {
        return founder.skills.some(skill => skill.level === value);
      }
      
      if (key === 'hasProjects') {
        return value ? (founder.projects && founder.projects.length > 0) : true;
      }
      
      if (key === 'hasSocialLinks') {
        return value ? (
          (founder.socialLinks && founder.socialLinks.length > 0) || 
          founder.website || 
          founder.instagramUrl
        ) : true;
      }
      
      return true;
    });
    
    return matchesSearch && matchesFilters;
  });

  // Sort founders
  const sortedFounders = [...filteredFounders].sort((a, b) => {
    switch (sortBy) {
      case 'alphabetical':
        const nameA = a.name || a.username;
        const nameB = b.name || b.username;
        return nameA.localeCompare(nameB);
      case 'role':
        return a.role.localeCompare(b.role);
      case 'newest':
      default:
        if (!a.createdAt || !b.createdAt) return 0;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Header />
        <main className="max-w-7xl mx-auto py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Header />
        <main className="max-w-7xl mx-auto py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center justify-center gap-3">
                <Users className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
                Find Your Co-Founder
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with talented individuals who complement your skills and share your vision.
            </p>
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {founders.length} Total Members
              </span>
              <span className="flex items-center gap-1">
                <Search className="h-4 w-4" />
                {filteredFounders.length} Results
              </span>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  showFilters 
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="h-4 w-4" />
                Filters
                {Object.values(filters).some(v => v) && (
                  <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                    {Object.values(filters).filter(v => v).length}
                  </span>
                )}
              </button>
              
              {(Object.values(filters).some(v => v) || searchQuery) && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <SortDesc className="h-4 w-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="alphabetical">A-Z</option>
                  <option value="role">By Role</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-6">
              <FilterSection onFilterChange={handleFilterChange} />
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 lg:w-3/4">
            {sortedFounders.length > 0 ? (
              <div className={`grid gap-4 sm:gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-2' 
                  : 'grid-cols-1'
              }`}>
                {sortedFounders.map((founder) => (
                  <FounderCard 
                    key={founder._id} 
                    {...founder}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 sm:p-12 rounded-xl shadow-md border border-gray-200 text-center">
                <div className="max-w-md mx-auto">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No founders found</h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery || Object.values(filters).some(v => v)
                      ? "Try adjusting your search criteria or filters to find more matches."
                      : "Be the first to join our community of entrepreneurs!"}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {(searchQuery || Object.values(filters).some(v => v)) && (
                      <button 
                        onClick={clearAllFilters}
                        className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                      >
                        Clear Filters
                      </button>
                    )}
                    <Link 
                      href="/signup"
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                    >
                      Join Community
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Load More Button (for future pagination) */}
            {sortedFounders.length > 0 && sortedFounders.length >= 20 && (
              <div className="mt-8 text-center">
                <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Load More Founders
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        {founders.length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to Find Your Co-Founder?
            </h2>
            <p className="text-lg sm:text-xl mb-6 opacity-90 max-w-2xl mx-auto">
              Join our community of entrepreneurs and start building your dream team today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Create Your Profile
              </Link>
              <Link
                href="/ai-ideas"
                className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Get Startup Ideas
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FoundersPage;