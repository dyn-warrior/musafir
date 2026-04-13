
import React, { useState } from 'react';
import FeedView from './components/FeedView';
import DiscoverView from './components/DiscoverView';
import CommunityView from './components/CommunityView';
import TribeView from './components/TribeView';
import WikiView from './components/WikiView';
import LoginView from './components/LoginView';
import ProfileView from './components/ProfileView';
import Navbar from './components/Navbar';
import { Screen } from './types';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('feed');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'feed': return <FeedView />;
      case 'discover': return <DiscoverView />;
      case 'community': return <CommunityView />;
      case 'tribe': return <TribeView />;
      case 'wiki': return <WikiView />;
      case 'login': return <LoginView onLogin={() => setCurrentScreen('feed')} />;
      case 'profile': return <ProfileView />;
      default: return <FeedView />;
    }
  };

  // Hide Navbar for login screen
  const showNav = currentScreen !== 'login';

  return (
    <div className="min-h-screen flex flex-col">
      {showNav && <Navbar currentScreen={currentScreen} onNavigate={setCurrentScreen} />}
      <main className={`flex-grow ${showNav ? 'pt-2' : ''}`}>
        {renderScreen()}
      </main>
      
      {/* Footer (Simplified as per reference) */}
      {showNav && currentScreen !== 'community' && (
        <footer className="bg-white border-t border-gray-100 py-8 px-8 mt-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-6 text-sm text-gray-500">
              <button className="hover:text-gray-800">About Us</button>
              <button className="hover:text-gray-800">Safety</button>
              <button className="hover:text-gray-800">Contact</button>
              <button className="hover:text-gray-800">Terms & Privacy</button>
            </div>
            <div className="flex gap-4">
              {/* Simple SVG Socials */}
              <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
              <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
              <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
              <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
