"use client"
import React, { useState } from 'react';
import Header from '@/components/Header';
import FounderCard from '@/components/FounderCard';
import SearchBar from '@/components/SearchBar';
import FilterSection from '@/components/FilterSection';
import Link from 'next/link';

const FoundersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  
  const allFounders = [
    {
      name: "Alex Johnson",
      role: "Technical Founder",
      skills: [
        { skill: "React", level: "Expert" as const },
        { skill: "Node.js", level: "Advanced" as const },
        { skill: "AWS", level: "Intermediate" as const },
      ],
      bio: "Full-stack developer with 5 years of experience building scalable web applications. Looking for a business co-founder to help bring my SaaS idea to market.",
      lookingFor: ["Business development", "Marketing", "Sales"]
    },
    {
      name: "Sarah Miller",
      role: "Business Founder",
      skills: [
        { skill: "Marketing", level: "Expert" as const },
        { skill: "Sales", level: "Advanced" as const },
        { skill: "Finance", level: "Intermediate" as const },
      ],
      bio: "Experienced marketer with a proven track record in B2B SaaS. Have an idea for a productivity tool but need technical expertise to build it.",
      lookingFor: ["Frontend Development", "Backend Development", "UI/UX Design"]
    },
    {
      name: "Raj Patel",
      role: "Design Founder",
      skills: [
        { skill: "UI/UX Design", level: "Expert" as const },
        { skill: "Figma", level: "Advanced" as const },
        { skill: "Product Design", level: "Advanced" as const },
      ],
      bio: "Product designer with experience at top tech companies. Looking for technical and business co-founders to collaborate on a design tool startup.",
      lookingFor: ["Full-stack Development", "Product Management", "Marketing"]
    },
    {
      name: "Emily Chen",
      role: "Technical Founder",
      skills: [
        { skill: "Machine Learning", level: "Expert" as const },
        { skill: "Python", level: "Advanced" as const },
        { skill: "Data Science", level: "Advanced" as const },
      ],
      bio: "AI researcher looking to commercialize my research in healthcare applications. Need co-founders with healthcare domain expertise and business acumen.",
      lookingFor: ["Healthcare Expertise", "Business Strategy", "Regulatory Knowledge"]
    }
  ];
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
  };
  
  const filteredFounders = allFounders.filter(founder => {
    const matchesSearch = 
      founder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      founder.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      founder.skills.some(skill => skill.skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      founder.lookingFor.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      
      if (key === 'role') {
        return founder.role.toLowerCase().includes(value.toString().toLowerCase());
      }
      
      if (key === 'skillLevel') {
        return founder.skills.some(skill => skill.level === value);
      }
      
      return true;
    });
    
    return matchesSearch && matchesFilters;
  });

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
                filteredFounders.map((founder, index) => (
                  <FounderCard key={index} {...founder} />
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