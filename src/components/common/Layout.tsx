import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  onNavigateToAdmin?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onNavigateToAdmin }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col">
      <Header onNavigateToAdmin={onNavigateToAdmin} />
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;