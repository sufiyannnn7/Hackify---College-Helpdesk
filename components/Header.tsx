
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-brand-surface/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="college-logo" aria-label="College Logo">
            C
          </div>
          <div className="w-px h-8 bg-gray-600 hidden sm:block"></div>
          <h1 className="text-xl md:text-2xl font-bold text-brand-text-primary tracking-tight hidden sm:block">
            College Helpdesk
          </h1>
        </div>
        <div className="flex items-center space-x-3">
           <div className="hackify-logo" aria-label="Hackify Logo">
                <div className="hackify-logo-shape hackify-logo-shape1"></div>
                <div className="hackify-logo-shape hackify-logo-shape2"></div>
           </div>
          <span className="text-xl font-semibold text-brand-text-primary">Hackify</span>
        </div>
      </div>
    </header>
  );
};
