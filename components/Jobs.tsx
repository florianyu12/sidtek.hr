'use client';

import { useState } from 'react';
import { Job } from '@/types';

interface JobsProps {
  jobs: Job[];
}

export default function Jobs({ jobs }: JobsProps) {
  const [filter, setFilter] = useState('全部');
  const [socialFilter, setSocialFilter] = useState('全部');

  const campusJobs = jobs.filter(job => job.category === '校园招聘');
  const socialJobs = jobs.filter(job => job.category === '社会招聘');

  const campusDepartments = ['全部', ...Array.from(new Set(campusJobs.map(job => job.department)))];
  const socialDepartments = ['全部', ...Array.from(new Set(socialJobs.map(job => job.department)))];

  const filteredCampusJobs = filter === '全部'
    ? campusJobs
    : campusJobs.filter(job => job.department === filter);

  const filteredSocialJobs = socialFilter === '全部'
    ? socialJobs
    : socialJobs.filter(job => job.department === socialFilter);

  return (
    <>
      <section id="campus" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-primary text-center mb-12">校园招聘</h2>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {campusDepartments.map(dept => (
              <button
                key={dept}
                onClick={() => setFilter(dept)}
                className={`px-6 py-2 rounded-full transition-colors ${
                  filter === dept
                    ? 'bg-secondary text-white'
                    : 'bg-white text-primary hover:bg-secondary/10'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampusJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>

      <section id="social" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-primary text-center mb-12">社会招聘</h2>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {socialDepartments.map(dept => (
              <button
                key={dept}
                onClick={() => setSocialFilter(dept)}
                className={`px-6 py-2 rounded-full transition-colors ${
                  socialFilter === dept
                    ? 'bg-secondary text-white'
                    : 'bg-gray-100 text-primary hover:bg-secondary/10'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSocialJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function JobCard({ job }: { job: Job }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-primary">{job.name}</h3>
        <span className="px-3 py-1 bg-secondary/10 text-secondary text-sm rounded-full">
          {job.category}
        </span>
      </div>
      <div className="space-y-2 mb-4 text-sm text-gray-600">
        <p className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          {job.department}
        </p>
        <p className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.location}
        </p>
        <p className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
          {job.education}
          {job.experience && ` | ${job.experience}年经验`}
        </p>
      </div>
      <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-4">{job.description}</p>
      <a
        href={job.applyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center py-3 bg-secondary hover:bg-secondary/80 text-white font-semibold rounded-lg transition-colors"
      >
        投递简历
      </a>
    </div>
  );
}
