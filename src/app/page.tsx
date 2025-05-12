import React from 'react';
import Header from '../components/Header';
import FounderCard from '../components/FounderCard';
import Link from 'next/link';

const HomePage = () => {
  const featuredFounders = [
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
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="block">Find Your Perfect</span>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Co-Founder Match
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with talented individuals who complement your skills and share your vision.
          </p>
        </section>
        
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Featured Founders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredFounders.map((founder, index) => (
              <FounderCard key={index} {...founder} />
            ))}
          </div>
        </section>
        
        <div className="text-center">
          <Link 
            href="/founders" 
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl inline-block"
          >
            Browse All Founders
          </Link>
        </div>
      </main>
    </div>
  );
};

export default HomePage;