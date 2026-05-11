import { create } from 'zustand';

const usePlayerStore = create((set, get) => ({
  playlist: [],
  currentTrackIndex: -1,
  isPlaying: false,
  volume: 0.5,
  progress: 0,
  
  setPlaylist: (tracks) => set({ playlist: tracks }),
  
  playTrack: (index) => set({ 
    currentTrackIndex: index,
    isPlaying: true 
  }),
  
  togglePlay: () => set((state) => {
    // If no track is selected but we have a playlist, play the first track
    if (state.currentTrackIndex === -1 && state.playlist.length > 0) {
      return { currentTrackIndex: 0, isPlaying: true };
    }
    // If playing, pause. If paused, play.
    if (state.currentTrackIndex !== -1) {
      return { isPlaying: !state.isPlaying };
    }
    return state;
  }),
  
  nextTrack: () => set((state) => {
    if (state.playlist.length === 0) return state;
    const nextIndex = (state.currentTrackIndex + 1) % state.playlist.length;
    return { currentTrackIndex: nextIndex, isPlaying: true };
  }),
  
  prevTrack: () => set((state) => {
    if (state.playlist.length === 0) return state;
    let prevIndex = state.currentTrackIndex - 1;
    if (prevIndex < 0) prevIndex = state.playlist.length - 1;
    return { currentTrackIndex: prevIndex, isPlaying: true };
  }),
  
  setVolume: (volume) => set({ volume }),
  
  setProgress: (progress) => set({ progress }),
  
  getCurrentTrack: () => {
    const state = get();
    if (state.currentTrackIndex === -1 || state.playlist.length === 0) return null;
    return state.playlist[state.currentTrackIndex];
  }
}));

export default usePlayerStore;
