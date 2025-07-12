import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to MindGym
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Practice Python algorithms and data structures
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn btn-primary">
              Start Coding
            </button>
            <button className="btn btn-outline">
              View Problems
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;