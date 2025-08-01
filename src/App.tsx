import React from 'react';
import Header from './components/Header';
import MapView from './components/MapView';

const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <MapView />
    </div>
  );
};

export default App;