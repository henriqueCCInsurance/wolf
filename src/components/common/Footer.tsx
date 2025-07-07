import React from 'react';
import { Heart, Shield, BookOpen, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L12.5 7.5L18 8L14 12L15.5 18L10 15L4.5 18L6 12L2 8L7.5 7.5L10 2Z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">W.O.L.F</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">v1.1.0</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Elite sales enablement platform for Campbell & Co. Group Benefits
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 flex items-center space-x-1 transition-colors">
                  <BookOpen size={14} />
                  <span>Training Resources</span>
                </button>
              </li>
              <li>
                <button className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 flex items-center space-x-1 transition-colors">
                  <Shield size={14} />
                  <span>Best Practices</span>
                </button>
              </li>
              <li>
                <a href="https://campbellco.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 flex items-center space-x-1">
                  <ExternalLink size={14} />
                  <span>Campbell & Co. Website</span>
                </a>
              </li>
            </ul>
          </div>
          
          {/* W.O.L.F. Acronym */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">The W.O.L.F Way</h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <li><span className="font-semibold text-primary-600 dark:text-primary-400">W</span>isdom - Know your prospect</li>
              <li><span className="font-semibold text-primary-600 dark:text-primary-400">O</span>pportunity - Identify their needs</li>
              <li><span className="font-semibold text-primary-600 dark:text-primary-400">L</span>eadership - Guide the conversation</li>
              <li><span className="font-semibold text-primary-600 dark:text-primary-400">F</span>ocus - Close with confidence</li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-300">
            © {currentYear} Campbell & Co. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-300 flex items-center mt-2 md:mt-0">
            Made with <Heart size={14} className="mx-1 text-red-500" /> for elite sales professionals
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;