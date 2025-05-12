"use client"
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import FounderCard from '@/components/FounderCard';
import SearchBar from '@/components/SearchBar';
import FilterSection from '@/components/FilterSection';
import Link from 'next/link';

// Define types based on the database model
interface Skill {
  skill: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  profileImage?: string;
  description?: string;
  skills?: Skill[];
  lookingFor?: string[];
}

const FoundersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [founders, setFounders] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
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
  
  const filteredFounders = founders.filter(founder => {
    const matchesSearch = 
      founder.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      founder.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      founder.skills?.some(skill => skill.skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      founder.lookingFor?.some(item => item.toLowerCase().includes(searchQuery.toLowerCase())) ||
      founder.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      
      if (key === 'role') {
        return founder.role?.toLowerCase().includes(value.toString().toLowerCase());
      }
      
      if (key === 'skillLevel' && founder.skills) {
        return founder.skills.some(skill => skill.level === value);
      }
      
      return true;
    });
    
    return matchesSearch && matchesFilters;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Header />
        <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
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
        <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
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
      
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Find Your Co-Founder
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Connect with talented individuals who complement your skills and share your vision.
          </p>
        </div>
        
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <FilterSection onFilterChange={handleFilterChange} />
          </div>
          
          <div className="lg:w-3/4">
            <div className="grid grid-cols-1 gap-6">
              {filteredFounders.length > 0 ? (
                filteredFounders.map((founder) => (
                  <FounderCard 
                    key={founder._id} 
                    name={founder.name || founder.username}
                    role={founder.role}
                    skills={founder.skills || []}
                    bio={founder.description || ''}
                    lookingFor={founder.lookingFor || []}
                    profileImage={founder.profileImage}
                  />
                ))
              ) : (
                <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 text-center">
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No founders found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
                  <Link 
                    href="/founders" 
                    className="inline-block px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => {
                      setSearchQuery('');
                      setFilters({});
                    }}
                  >
                    Reset Filters
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FoundersPage;
