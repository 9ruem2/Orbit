import React, { useEffect, useState } from 'react';
import { fetchTracks } from '../api/musicApi';
import usePlayerStore from '../store/usePlayerStore';
import { Play, Loader2 } from 'lucide-react';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const { setPlaylist, playTrack, currentTrackIndex, isPlaying } = usePlayerStore();
  const [tracks, setLocalTracks] = useState([]);

  useEffect(() => {
    async function loadMusic() {
      try {
        const data = await fetchTracks();
        setLocalTracks(data);
        setPlaylist(data);
      } catch (error) {
        console.error("Failed to load tracks", error);
      } finally {
        setLoading(false);
      }
    };
    loadMusic();
  }, [setPlaylist]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 min-h-[50vh]">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p>Loading curated royalty-free music...</p>
      </div>
    );
  }

  return (
    <div className="pb-32 px-6 py-8 max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Discover MelosFree
        </h1>
        <p className="text-gray-400 text-lg">
          Copyright-free music for creators, coders, and dreamers.
        </p>
      </header>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Trending Tracks</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tracks.map((track, index) => {
            const isCurrentTrack = currentTrackIndex === index;
            const isTrackPlaying = isCurrentTrack && isPlaying;

            return (
              <div 
                key={track.id} 
                className="glass p-4 rounded-xl hover:bg-white/5 transition duration-300 group cursor-pointer"
                onClick={() => playTrack(index)}
              >
                <div className="relative aspect-square mb-4 overflow-hidden rounded-lg shadow-lg">
                  <img 
                    src={track.image} 
                    alt={track.name} 
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isCurrentTrack ? 'opacity-100 bg-black/60' : ''}`}>
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                      {isTrackPlaying ? (
                        <div className="flex space-x-1">
                          <span className="w-1 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-1 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-1 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      ) : (
                        <Play fill="currentColor" size={20} className="ml-1" />
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg truncate text-white">{track.name}</h3>
                  <p className="text-gray-400 text-sm truncate">{track.artist_name}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};


