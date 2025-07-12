import React from 'react';

const ProblemPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Problem Details
        </h1>
        <div className="card">
          <p className="text-gray-600">
            Problem details and code editor will be displayed here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;