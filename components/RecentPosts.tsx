
import React from 'react';

const RecentPosts: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center text-stone-500 dark:text-stone-400 p-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-bold text-stone-700 dark:text-beige-200">Work in Progress</h3>
        <p className="text-sm mt-1">The live feed feature is currently under construction and will be available soon.</p>
    </div>
  );
};

export default RecentPosts;