import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🧠</span>
            <span className="text-xl font-bold text-gray-900">MindGym</span>
          </div>
          
          <div className="flex items-center space-x-1 text-gray-600">
            <span>Made with</span>
            <span className="text-red-500">❤️</span>
            <span>for Python enthusiasts</span>
          </div>
          
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} MindGym. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;