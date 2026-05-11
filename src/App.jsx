import React from 'react';
import Home from './components/Home';
import AudioPlayer from './components/AudioPlayer';

function App() {
  return (
    <div className="min-h-screen relative font-sans text-white bg-background overflow-hidden selection:bg-primary/30">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Main Content Area */}
      <main className="relative z-10 min-h-screen">
        <Home />
      </main>

      {/* Global Audio Player - Always mounted for seamless playback */}
      <AudioPlayer />
    </div>
  );
}

export default App;
